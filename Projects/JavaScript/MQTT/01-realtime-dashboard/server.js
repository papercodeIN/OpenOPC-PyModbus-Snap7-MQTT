#!/usr/bin/env node
/** Entry point: serve the real-time MQTT dashboard over HTTP. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfigFromFile, ConfigError } from './src/config.js';
import { createLogger } from './src/logger.js';
import { createStaticServer } from './src/static-server.js';
import { createEventHub } from './src/event-hub.js';
import { BrokerBridge } from './src/broker-bridge.js';
import { openBrowser } from './src/open-browser.js';

const appDir = path.dirname(fileURLToPath(import.meta.url));

const HELP = `
Real-Time MQTT Dashboard — local web service

Usage:
  run.bat [port]              Windows launcher (prompts for the port)
  node server.js [port]       Start directly
  npm start -- [port]         Start through npm

Options:
  --port <port>   Port for this dashboard (default: PORT in .env, else 8080)
  --host <host>   Bind address (default: HOST in .env, else 127.0.0.1)
  --log-level <level>  debug | info | warn | error
  --help          Show this help

The dashboard subscribes to MQTT. Two transports are available:
  tcp        MQTT over TCP (default, usually port 1883) through this server
  websocket  MQTT over WebSockets straight from the browser (wss:// only for TLS)
Nothing is published and no credentials are written to disk.
`;

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

/** Parse the supported arguments; throws an Error with a user-facing message. */
export function parseArgs(args) {
  const result = { port: null, host: null, logLevel: null, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (/^\d+$/.test(arg)) {
      result.port = arg;
      continue;
    }
    if (arg.startsWith('--port=')) {
      result.port = arg.slice('--port='.length);
      continue;
    }
    if (arg === '--port' || arg === '--host' || arg === '--log-level') {
      const value = args[++index];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} requires a value.`);
      if (arg === '--port') result.port = value;
      if (arg === '--host') result.host = value;
      if (arg === '--log-level') result.logLevel = value;
      continue;
    }
    throw new Error(`Unknown option "${arg}". Run with --help for the supported options.`);
  }
  return result;
}

function toPort(raw) {
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Invalid port "${raw}" — expected an integer between 1 and 65535, e.g. run.bat 8081.`);
  }
  return value;
}

let args;
let config;
try {
  args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }
  const overrides = {};
  if (args.port !== null) overrides.PORT = String(toPort(args.port));
  if (args.host) overrides.HOST = args.host;
  if (args.logLevel) {
    if (!LOG_LEVELS.includes(args.logLevel.toLowerCase())) {
      throw new Error(`Invalid --log-level "${args.logLevel}" — expected debug, info, warn or error.`);
    }
    overrides.LOG_LEVEL = args.logLevel.toLowerCase();
  }
  config = loadConfigFromFile(path.join(appDir, '.env'), overrides);
} catch (error) {
  const prefix = error instanceof ConfigError ? 'Configuration error: ' : '';
  console.error(`\n  [X] ${prefix}${error.message}\n`);
  process.exit(1);
}

const quiet = process.env.MQTT_QUIET === '1';
const logger = createLogger('dashboard', quiet ? 'error' : config.logLevel);
const hub = createEventHub();
const bridge = new BrokerBridge({ logger, onEvent: (type, payload) => hub.broadcast(type, payload) });
const server = createStaticServer({ config, logger, appDir, bridge, hub });

if (!fs.existsSync(path.join(appDir, 'node_modules', 'mqtt', 'dist', 'mqtt.min.js'))) {
  console.error('\n  [!] The MQTT browser bundle is missing (node_modules/mqtt).');
  console.error('      Run npm install — or run.bat, which installs dependencies for you.\n');
}

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n  [X] Port ${config.port} is already in use.`);
    console.error('      Stop the process that owns it, or start the dashboard on another port:');
    console.error('      run.bat 8081\n');
  } else if (error.code === 'EACCES') {
    console.error(`\n  [X] Permission denied while binding ${config.host}:${config.port}.`);
    console.error('      Choose a port above 1024, e.g. run.bat 8080\n');
  } else {
    console.error(`\n  [X] Server error: ${error.message}\n`);
  }
  process.exit(1);
});

server.listen(config.port, config.host, () => {
  const url = `http://${config.host}:${config.port}`;
  console.log(`\n  Real-Time Dashboard  ->  ${url}`);
  console.log(`  MQTT TCP default     ->  ${config.brokerTls ? 'mqtts' : 'mqtt'}://${config.brokerHost}:${config.brokerPort}`);
  console.log(`  WebSocket option     ->  ${config.brokerWsUrl}`);
  console.log('  Press Ctrl+C to stop.\n');
  openBrowser(url);
});

function shutdown(signal) {
  logger.info('shutting down', { signal });
  bridge.disconnect().catch(() => {});
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGBREAK', () => shutdown('SIGBREAK'));

// Fail loudly and predictably instead of leaving a half-dead service behind.
process.on('uncaughtException', (error) => {
  logger.error('uncaught exception', { error: error.message, stack: error.stack });
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  logger.error('unhandled rejection', { error: String(reason?.message ?? reason) });
  process.exit(1);
});
