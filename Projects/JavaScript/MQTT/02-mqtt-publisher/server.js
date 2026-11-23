#!/usr/bin/env node
/** Entry point: local web service for the MQTT publisher (MQTT over TCP). */

import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseEnv, loadConfigFromFile, ConfigError } from './src/config.js';
import { createLogger } from './src/logger.js';
import { PublisherService } from './src/service.js';
import { createApp } from './src/app.js';
import { openBrowser } from './src/open-browser.js';

const appDir = path.dirname(fileURLToPath(import.meta.url));

const HELP = `
MQTT Publisher — local web service

Usage:
  run.bat [port]                 Windows launcher (prompts for the port)
  node server.js [port]          Start the web service
  npm start -- [port]            Same, through npm
  node index.js [broker-port]    Headless one-shot publish (no UI)

Options:
  --http-port <port>   Port for this web service (default HTTP_PORT in .env, else 8081)
  --host <host>        Bind address (default HTTP_HOST in .env, else 127.0.0.1)
  --log-level <level>  debug | info | warn | error
  --help               Show this help

MQTT uses TCP (port 1883, or 8883 with TLS) through this service — no broker
WebSocket listener is required. Broker credentials are entered in the page and
kept in memory only.
`;

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

export function parseArgs(args) {
  const result = { httpPort: null, host: null, logLevel: null, help: false };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      result.help = true;
      continue;
    }
    if (/^\d+$/.test(arg)) {
      result.httpPort = arg;
      continue;
    }
    if (arg.startsWith('--http-port=')) {
      result.httpPort = arg.slice('--http-port='.length);
      continue;
    }
    if (arg === '--http-port' || arg === '--host' || arg === '--log-level') {
      const value = args[++index];
      if (value === undefined || value.startsWith('--')) throw new Error(`${arg} requires a value.`);
      if (arg === '--http-port') result.httpPort = value;
      if (arg === '--host') result.host = value;
      if (arg === '--log-level') result.logLevel = value;
      continue;
    }
    if (arg === '--port') {
      throw new Error('--port is the broker port for the headless CLI. Use --http-port for this service.');
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

function readEnvFile(envPath) {
  try {
    return parseEnv(fs.readFileSync(envPath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

let config;
let fileEnv;
try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(HELP);
    process.exit(0);
  }
  const overrides = {};
  if (args.httpPort !== null) overrides.HTTP_PORT = String(toPort(args.httpPort));
  if (args.host) overrides.HTTP_HOST = args.host;
  if (args.logLevel) {
    if (!LOG_LEVELS.includes(args.logLevel.toLowerCase())) {
      throw new Error(`Invalid --log-level "${args.logLevel}" — expected debug, info, warn or error.`);
    }
    overrides.MQTT_LOG_LEVEL = args.logLevel.toLowerCase();
  }
  config = loadConfigFromFile(path.join(appDir, '.env'), overrides);
  fileEnv = readEnvFile(path.join(appDir, '.env'));
} catch (error) {
  const prefix = error instanceof ConfigError ? 'Configuration error: ' : '';
  console.error(`\n  [X] ${prefix}${error.message}\n`);
  process.exit(1);
}

const logger = createLogger('publisher', config.logLevel);
const service = new PublisherService({ env: { ...fileEnv, ...process.env }, logger });
const app = createApp({ service, config, appDir, logger });
const server = http.createServer(app);

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n  [X] Port ${config.httpPort} is already in use.`);
    console.error('      Stop the other process, or start the publisher service on another port:');
    console.error('      run.bat 8082\n');
  } else if (error.code === 'EACCES') {
    console.error(`\n  [X] Permission denied while binding ${config.httpHost}:${config.httpPort}. Use a port above 1024.\n`);
  } else {
    console.error(`\n  [X] Server error: ${error.message}\n`);
  }
  process.exit(1);
});

server.listen(config.httpPort, config.httpHost, () => {
  const url = `http://${config.httpHost}:${config.httpPort}`;
  console.log(`\n  MQTT Publisher      ->  ${url}`);
  console.log(`  Broker default      ->  ${config.useTls ? 'mqtts' : 'mqtt'}://${config.host}:${config.port} (TCP)`);
  console.log('  Press Ctrl+C to stop.\n');
  openBrowser(url);
});

async function shutdown(signal) {
  logger.info('shutting down', { signal });
  await service.disconnect().catch(() => {});
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
