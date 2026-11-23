/** Publisher configuration: .env parsing, validation and safe defaults. */

import fs from 'node:fs';

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

export function parseEnv(text) {
  const result = {};
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.replace(/^export\s+/, '').match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
      value = value.slice(1, -1);
    }
    result[match[1]] = value;
  }
  return result;
}

function intFrom(env, key, fallback, min, max) {
  const raw = env[key];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ConfigError(`Invalid ${key}: "${raw}" — expected an integer between ${min} and ${max}. Check ${key} in .env or the CLI flag.`);
  }
  return value;
}

function boolFrom(env, key, fallback) {
  const raw = env[key];
  if (raw === undefined || raw === '') return fallback;
  const value = String(raw).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(value)) return true;
  if (['false', '0', 'no', 'off'].includes(value)) return false;
  throw new ConfigError(`Invalid ${key}: "${raw}" — expected true or false.`);
}

function fileFrom(env, key) {
  const value = String(env[key] ?? '').trim();
  if (!value) return '';
  if (!fs.existsSync(value) || !fs.statSync(value).isFile()) {
    throw new ConfigError(`${key} points to a missing file: "${value}". Provide a readable path.`);
  }
  return value;
}

/** Shared MQTT_PAYLOAD_MODE=json|raw maps onto the legacy format setting. */
function withAliases(env) {
  const out = { ...env };
  const mode = env.MQTT_PAYLOAD_MODE;
  if (mode !== undefined && mode !== '' && out.MQTT_PAYLOAD_FORMAT === undefined) {
    const value = String(mode).toLowerCase();
    if (!['json', 'raw'].includes(value)) {
      throw new ConfigError(`Invalid MQTT_PAYLOAD_MODE: "${mode}" — expected json or raw.`);
    }
    out.MQTT_PAYLOAD_FORMAT = value === 'raw' ? 'text' : 'json';
  }
  return out;
}

export function loadConfig(env = {}) {
  env = withAliases(env);
  const host = String(env.MQTT_HOST ?? '127.0.0.1').trim();
  if (!host) throw new ConfigError('MQTT_HOST must not be empty.');

  const httpHost = String(env.HTTP_HOST ?? '127.0.0.1').trim();
  if (!httpHost) throw new ConfigError('HTTP_HOST must not be empty.');
  const loopback = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(httpHost);
  const allowRemote = boolFrom(env, 'ALLOW_REMOTE', false);
  if (!loopback && !allowRemote) {
    throw new ConfigError(
      `HTTP_HOST=${httpHost} would expose the browser UI and publish API to the network. ` +
        'Set ALLOW_REMOTE=true only behind a firewall or authenticated reverse proxy.',
    );
  }

  const clientId = String(env.MQTT_CLIENT_ID ?? '').trim();
  if (clientId.length > 128 || /[\x00-\x1f]/.test(clientId)) {
    throw new ConfigError('MQTT_CLIENT_ID must be 128 characters or fewer and contain no control characters.');
  }
  const username = String(env.MQTT_USERNAME ?? '');
  const password = String(env.MQTT_PASSWORD ?? '');
  if (username.length > 256 || password.length > 256) {
    throw new ConfigError('MQTT_USERNAME and MQTT_PASSWORD must be 256 characters or fewer.');
  }

  const topic = String(env.MQTT_TOPIC ?? 'demo/publisher').trim();
  if (!topic || topic.length > 128 || /\s/.test(topic) || topic.includes('#') || topic.includes('+')) {
    throw new ConfigError('MQTT_TOPIC must be a non-empty publishing topic (no spaces, no # or + wildcards) of at most 128 characters.');
  }

  const format = String(env.MQTT_PAYLOAD_FORMAT ?? 'text').toLowerCase();
  if (!['text', 'json'].includes(format)) {
    throw new ConfigError(`Invalid MQTT_PAYLOAD_FORMAT: "${format}" — expected text or json.`);
  }
  const payload = String(env.MQTT_PAYLOAD ?? '{"temperature":24.5}');
  if (payload.length === 0 || payload.length > 65536) {
    throw new ConfigError('MQTT_PAYLOAD must be between 1 and 65536 characters.');
  }
  let payloadValue = payload;
  if (format === 'json') {
    try {
      payloadValue = JSON.parse(payload);
    } catch (error) {
      throw new ConfigError(`MQTT_PAYLOAD is not valid JSON (MQTT_PAYLOAD_FORMAT=json): ${error.message}`);
    }
  }

  const useTls = boolFrom(env, 'MQTT_USE_TLS', false);
  const tlsInsecure = boolFrom(env, 'MQTT_TLS_INSECURE', false);
  if (tlsInsecure && !useTls) throw new ConfigError('MQTT_TLS_INSECURE requires MQTT_USE_TLS=true.');
  const caFile = fileFrom(env, 'MQTT_CA_FILE');
  const certFile = fileFrom(env, 'MQTT_CERT_FILE');
  const keyFile = fileFrom(env, 'MQTT_KEY_FILE');
  if ((certFile && !keyFile) || (!certFile && keyFile)) {
    throw new ConfigError('MQTT_CERT_FILE and MQTT_KEY_FILE must be supplied together for mutual TLS.');
  }

  const loop = boolFrom(env, 'MQTT_LOOP', false);
  const intervalMs = intFrom(env, 'MQTT_INTERVAL_MS', 5000, 1000, 3600000);
  const maxMessages = intFrom(env, 'MQTT_MAX_MESSAGES', 20, 1, 1000);
  const logLevel = String(env.MQTT_LOG_LEVEL ?? 'info').toLowerCase();
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
    throw new ConfigError(`Invalid MQTT_LOG_LEVEL: "${logLevel}" — expected debug, info, warn or error.`);
  }

  return Object.freeze({
    host,
    port: intFrom(env, 'MQTT_PORT', 1883, 1, 65535),
    httpHost,
    httpPort: intFrom(env, 'HTTP_PORT', 8081, 1, 65535),
    clientId,
    username,
    password,
    useTls,
    tlsInsecure,
    caFile,
    certFile,
    keyFile,
    topic,
    qos: intFrom(env, 'MQTT_QOS', 0, 0, 2),
    retain: boolFrom(env, 'MQTT_RETAIN', false),
    payloadFormat: format,
    payload,
    payloadValue,
    keepalive: intFrom(env, 'MQTT_KEEPALIVE', 60, 5, 3600),
    connectTimeout: intFrom(env, 'MQTT_CONNECT_TIMEOUT', 15000, 1000, 120000),
    reconnectPeriod: intFrom(env, 'MQTT_RECONNECT_PERIOD', 5000, 0, 600000),
    publishTimeout: intFrom(env, 'MQTT_PUBLISH_TIMEOUT', 10000, 1000, 120000),
    allowRemote,
    loop,
    intervalMs,
    maxMessages,
    logLevel,
  });
}

export function loadConfigFromFile(envPath, overrides = {}) {
  let fromFile = {};
  try {
    fromFile = parseEnv(fs.readFileSync(envPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return loadConfig({ ...fromFile, ...process.env, ...overrides });
}

/** Values safe to hand to the browser: never credentials, certificates or env secrets. */
export function publicConfig(config) {
  return {
    httpPort: config.httpPort,
    defaults: {
      host: config.host,
      port: config.port,
      topic: config.topic,
      qos: config.qos,
      retain: config.retain,
      payloadFormat: config.payloadFormat,
      payload: config.payload,
      clientId: config.clientId,
      useTls: config.useTls,
      keepalive: config.keepalive,
      connectTimeout: config.connectTimeout,
      reconnectPeriod: config.reconnectPeriod,
    },
  };
}

/** Values safe to log — credentials and payload content are excluded. */
export function safeSummary(config) {
  return {
    broker: `${config.useTls ? 'mqtts' : 'mqtt'}://${config.host}:${config.port}`,
    clientId: config.clientId || '(auto)',
    topic: config.topic,
    qos: config.qos,
    retain: config.retain,
    payloadFormat: config.payloadFormat,
    tls: config.useTls,
    tlsVerification: config.useTls ? !config.tlsInsecure : 'n/a',
    mode: config.loop ? `loop (max ${config.maxMessages}, every ${config.intervalMs} ms)` : 'single publish',
  };
}
