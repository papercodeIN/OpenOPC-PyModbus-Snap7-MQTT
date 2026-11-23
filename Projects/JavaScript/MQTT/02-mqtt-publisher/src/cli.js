/** Command-line interface and run orchestration for the publisher. */

import path from 'node:path';

import { loadConfigFromFile, safeSummary, ConfigError } from './config.js';
import { createLogger } from './logger.js';
import { MqttPublisher, sanitizeError } from './publisher.js';

const VALUE_OPTIONS = Object.freeze({
  host: 'MQTT_HOST',
  port: 'MQTT_PORT',
  'client-id': 'MQTT_CLIENT_ID',
  username: 'MQTT_USERNAME',
  password: 'MQTT_PASSWORD',
  ca: 'MQTT_CA_FILE',
  cert: 'MQTT_CERT_FILE',
  key: 'MQTT_KEY_FILE',
  topic: 'MQTT_TOPIC',
  qos: 'MQTT_QOS',
  payload: 'MQTT_PAYLOAD',
  'json-payload': 'MQTT_PAYLOAD',
  'payload-format': 'MQTT_PAYLOAD_FORMAT',
  keepalive: 'MQTT_KEEPALIVE',
  interval: 'MQTT_INTERVAL_MS',
  count: 'MQTT_MAX_MESSAGES',
  timeout: 'MQTT_CONNECT_TIMEOUT',
  reconnect: 'MQTT_RECONNECT_PERIOD',
  'log-level': 'MQTT_LOG_LEVEL',
});

const FLAG_OPTIONS = Object.freeze({
  tls: 'MQTT_USE_TLS',
  insecure: 'MQTT_TLS_INSECURE',
  retain: 'MQTT_RETAIN',
  loop: 'MQTT_LOOP',
  json: 'MQTT_PAYLOAD_FORMAT',
  text: 'MQTT_PAYLOAD_FORMAT',
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
      result[FLAG_OPTIONS[name]] = name === 'json' || name === 'text' ? name : 'true';
      continue;
    }
    if (!Object.hasOwn(VALUE_OPTIONS, name)) {
      throw new ConfigError(`Unknown option --${name}. Run with --help for the supported options.`);
    }
    let value = inlineValue;
    if (value === undefined) {
      value = argv[++index];
      if (value === undefined || value.startsWith('--')) {
        throw new ConfigError(`--${name} requires a value.`);
      }
    }
    result[VALUE_OPTIONS[name]] = value;
    if (name === 'json-payload') result.MQTT_PAYLOAD_FORMAT = 'json';
  }
  return result;
}

export function helpText() {
  return `MQTT Publisher — Node.js 22+ LTS

Usage: run.bat [port] [options]  |  node index.js [port] [options]

A bare number is the broker port (default 1883), e.g. run.bat 1884.

Options:
  --host <host>              Broker host (default 127.0.0.1)
  --port <port>              Broker port (default 1883; 8883 with --tls)
  --client-id <id>           Client ID (blank = auto-generated)
  --username <user>          Optional broker username
  --password <password>      Optional broker password (prefer .env or env vars)
  --topic <topic>            Publishing topic (no wildcards)
  --qos <0|1|2>              QoS (default 0)
  --retain                   Set the MQTT retain flag
  --payload <text>           Plain-text payload
  --json                     Treat PAYLOAD as JSON (validated at startup)
  --json-payload <json>      Shorthand for --json --payload <json>
  --payload-format <format>  text or json
  --tls                      Use TLS (mqtts)
  --ca <file>                CA certificate file
  --cert <file>              Client certificate file (mutual TLS)
  --key <file>               Client key file (mutual TLS)
  --insecure                 Disable certificate validation (explicit only; insecure)
  --keepalive <seconds>      Keep alive (default 60)
  --timeout <ms>             Connect timeout (default 15000)
  --reconnect <ms>           Reconnect period (default 5000; 0 disables)
  --loop                     Explicitly enable repeated publishing
  --interval <ms>            Interval when looping (default 5000)
  --count <n>                Messages to publish when looping (default 20, max 1000)
  --log-level <level>        debug | info | warn | error
  --help                     Show this help

A single publish is the default. Publishing never happens unless this process is started.
Configuration precedence: defaults < .env < environment variables < CLI options.
`;
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
  const logger = deps.logger ?? createLogger('publisher', config.logLevel);
  if (process.env.MQTT_QUIET !== '1') logger.info('configuration validated', safeSummary(config));

  const publisher = deps.publisher ?? new MqttPublisher({ logger });
  let stopped = false;
  const onSignal = () => {
    stopped = true;
    logger.warn('shutdown signal received — stopping after the current publish');
  };
  process.on('SIGINT', onSignal);
  process.on('SIGTERM', onSignal);

  let published = 0;
  try {
    await publisher.connect(config);
    const total = config.loop ? config.maxMessages : 1;
    for (let index = 0; index < total; index += 1) {
      if (stopped) break;
      if (index > 0) await delay(config.intervalMs);
      if (stopped) break;
      await publisher.publish(config.topic, config.payloadValue, {
        qos: config.qos,
        retain: config.retain,
        format: config.payloadFormat,
      });
      published += 1;
      logger.info('message published', { sequence: published, topic: config.topic, qos: config.qos, retain: config.retain });
    }
    logger.info('publish run complete', { published, stopped });
    console.log(`Published ${published} message(s) to ${config.topic}.`);
    return 0;
  } catch (error) {
    logger.error('publisher failed', { error: sanitizeError(error) });
    console.error(`Error: ${sanitizeError(error)}`);
    return 1;
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    await publisher.end();
  }
}
