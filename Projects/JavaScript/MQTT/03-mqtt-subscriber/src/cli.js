/** Command-line interface and run orchestration for the subscriber. */

import path from 'node:path';

import { loadConfigFromFile, safeSummary, ConfigError } from './config.js';
import { createLogger } from './logger.js';
import { MqttSubscriber, sanitizeError } from './subscriber.js';
import { formatMessage } from './formatter.js';

const VALUE_OPTIONS = Object.freeze({
  host: 'MQTT_HOST',
  port: 'MQTT_PORT',
  'client-id': 'MQTT_CLIENT_ID',
  username: 'MQTT_USERNAME',
  password: 'MQTT_PASSWORD',
  topic: 'MQTT_TOPICS',
  qos: 'MQTT_QOS',
  ca: 'MQTT_CA_FILE',
  cert: 'MQTT_CERT_FILE',
  key: 'MQTT_KEY_FILE',
  keepalive: 'MQTT_KEEPALIVE',
  timeout: 'MQTT_CONNECT_TIMEOUT',
  reconnect: 'MQTT_RECONNECT_PERIOD',
  'max-chars': 'MQTT_MAX_PAYLOAD_CHARS',
  'log-level': 'MQTT_LOG_LEVEL',
});

const FLAG_OPTIONS = Object.freeze({
  tls: 'MQTT_USE_TLS',
  insecure: 'MQTT_TLS_INSECURE',
  'no-json': 'MQTT_JSON_PARSING',
});

export function parseArgs(argv = []) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      result.HELP = 'true';
      continue;
    }
    if (!arg.startsWith('--')) {
      if (/^\d+$/.test(arg)) {
        result.MQTT_PORT = arg;
        continue;
      }
      throw new ConfigError(`Unexpected argument "${arg}" — use the port number or --name=value. Run with --help for options.`);
    }
    const equals = arg.indexOf('=');
    const name = equals >= 0 ? arg.slice(2, equals) : arg.slice(2);
    const inlineValue = equals >= 0 ? arg.slice(equals + 1) : undefined;

    if (Object.hasOwn(FLAG_OPTIONS, name)) {
      if (inlineValue !== undefined) throw new ConfigError(`--${name} is a flag and takes no value.`);
      result[FLAG_OPTIONS[name]] = name === 'no-json' ? 'false' : 'true';
      continue;
    }
    if (!Object.hasOwn(VALUE_OPTIONS, name)) {
      throw new ConfigError(`Unknown option --${name}. Run with --help for the supported options.`);
    }
    let value = inlineValue;
    if (value === undefined) {
      value = argv[++index];
      if (value === undefined || value.startsWith('--')) throw new ConfigError(`--${name} requires a value.`);
    }
    if (name === 'topic') {
      if (!Array.isArray(result.MQTT_TOPICS)) result.MQTT_TOPICS = [];
      result.MQTT_TOPICS.push(value);
    } else {
      result[VALUE_OPTIONS[name]] = value;
    }
  }
  if (Array.isArray(result.MQTT_TOPICS)) result.MQTT_TOPICS = result.MQTT_TOPICS.join(',');
  return result;
}

export function helpText() {
  return `MQTT Subscriber — Node.js 22+ LTS

Usage: run.bat [port] [options]  |  node index.js [port] [options]

A bare number is the broker port (default 1883), e.g. run.bat 1884.

Options:
  --host <host>              Broker host (default 127.0.0.1)
  --port <port>              Broker port (default 1883; 8883 with --tls)
  --client-id <id>           Client ID (blank = auto-generated)
  --username <user>          Optional broker username
  --password <password>      Optional broker password (prefer .env or env vars)
  --topic <filter>           Topic filter; repeat for multiple (default demo/#)
  --qos <0|1|2>              Subscription QoS (default 0)
  --tls                      Use TLS (mqtts)
  --ca <file>                CA certificate file
  --cert <file>              Client certificate file (mutual TLS)
  --key <file>               Client key file (mutual TLS)
  --insecure                 Disable certificate validation (explicit only; insecure)
  --keepalive <seconds>      Keep alive (default 60)
  --timeout <ms>             Connect timeout (default 15000)
  --reconnect <ms>           Reconnect period (default 5000; 0 disables)
  --no-json                  Show all payloads as plain text
  --max-chars <n>            Truncate displayed payloads (default 512)
  --log-level <level>        debug | info | warn | error
  --help                     Show this help

Press Ctrl+C to disconnect gracefully. Configuration precedence: defaults < .env <
environment variables < CLI options.
`;
}

export async function run(argv = [], deps = {}) {
  const overrides = parseArgs(argv);
  if (overrides.HELP) {
    console.log(helpText());
    return 0;
  }

  const appDir = deps.appDir ?? process.cwd();
  const config = deps.loadConfigFromFile
    ? deps.loadConfigFromFile(path.join(appDir, '.env'), overrides)
    : loadConfigFromFile(path.join(appDir, '.env'), overrides);
  const logger = deps.logger ?? createLogger('subscriber', config.logLevel);
  const quiet = process.env.MQTT_QUIET === '1';
  if (!quiet) logger.info('configuration validated', safeSummary(config));

  const subscriber = deps.subscriber ?? new MqttSubscriber({ logger });
  subscriber.onMessage = (message) => {
    console.log(formatMessage(message, { jsonParsing: config.jsonParsing, maxPayloadChars: config.maxPayloadChars }));
    logger.info('message received', { topic: message.topic, qos: message.qos });
  };
  subscriber.onEvent = (level, message) => {
    if (level === 'error') logger.error('event', { message });
    else logger.info('event', { level, message });
    console.log(`  [${level.toUpperCase()}] ${message}`);
  };

  let stop;
  const done = new Promise((resolve) => { stop = () => resolve(0); });
  const signals = deps.signals ?? process;
  const onSignal = () => {
    logger.warn('shutdown signal received');
    stop();
  };
  signals.on('SIGINT', onSignal);
  signals.on('SIGTERM', onSignal);

  try {
    await subscriber.connect(config);
    if (!quiet) logger.info('subscriber running', { topics: config.topics });
    return await done;
  } catch (error) {
    logger.error('subscriber failed', { error: sanitizeError(error) });
    console.error(`Error: ${sanitizeError(error)}`);
    return 1;
  } finally {
    signals.off('SIGINT', onSignal);
    signals.off('SIGTERM', onSignal);
    await subscriber.end();
  }
}
