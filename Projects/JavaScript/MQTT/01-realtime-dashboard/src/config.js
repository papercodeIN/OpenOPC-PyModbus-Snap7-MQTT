/** Server-side configuration: .env parsing, validation and browser-safe defaults. */

import fs from 'node:fs';

export class ConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConfigError';
  }
}

/** Parse a small .env file (comments, blank lines, optional `export`, quoted values). */
export function parseEnv(text) {
  const result = {};
  for (const rawLine of String(text).split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const match = line.replace(/^export\s+/, '').match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      value.length >= 2 &&
      ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'")))
    ) {
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
    throw new ConfigError(
      `Invalid ${key}: "${raw}" — expected an integer between ${min} and ${max}. Check ${key} in .env.`,
    );
  }
  return value;
}

function boolFrom(env, key, fallback) {
  const raw = env[key];
  if (raw === undefined || raw === '') return fallback;
  const value = String(raw).toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(value)) return true;
  if (['false', '0', 'no', 'off'].includes(value)) return false;
  throw new ConfigError(`Invalid ${key}: "${raw}" — expected true or false. Check ${key} in .env.`);
}

function topicsFrom(env) {
  const raw = env.DEFAULT_TOPICS ?? 'sensors/#';
  const parts = String(raw)
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) {
    throw new ConfigError('DEFAULT_TOPICS is empty — provide at least one topic filter, e.g. sensors/#.');
  }
  if (parts.length > 50) {
    throw new ConfigError(`DEFAULT_TOPICS has ${parts.length} entries — the maximum is 50.`);
  }
  for (const part of parts) {
    if (/\s/.test(part) || part.length > 128) {
      throw new ConfigError(`Invalid DEFAULT_TOPICS entry "${part}" — topics cannot contain spaces and must be 128 characters or fewer.`);
    }
  }
  return parts;
}

function wsUrlFrom(env) {
  const raw = env.BROKER_WS_URL ?? 'ws://127.0.0.1:9001/mqtt';
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    throw new ConfigError(`Invalid BROKER_WS_URL: "${raw}" — expected a full URL such as ws://127.0.0.1:9001/mqtt.`);
  }
  if (!['ws:', 'wss:'].includes(parsed.protocol) || !parsed.hostname) {
    throw new ConfigError(`Invalid BROKER_WS_URL: "${raw}" — only ws:// and wss:// are supported (MQTT over WebSockets).`);
  }
  if (parsed.username || parsed.password) {
    throw new ConfigError('BROKER_WS_URL must not contain credentials — supply them in the browser form instead.');
  }
  return raw;
}

/** Accept the shared MQTT_* names used by the other two apps; legacy names still work. */
function withAliases(env) {
  const out = { ...env };
  const copy = (from, to, map) => {
    if (env[from] !== undefined && env[from] !== '') out[to] = map ? map(env[from]) : env[from];
  };
  copy('MQTT_HOST', 'BROKER_HOST');
  copy('MQTT_PORT', 'BROKER_PORT');
  copy('MQTT_USE_TLS', 'BROKER_TLS');
  copy('MQTT_WS_URL', 'BROKER_WS_URL');
  copy('MQTT_TOPICS', 'DEFAULT_TOPICS');
  copy('MQTT_QOS', 'DEFAULT_QOS');
  copy('MQTT_KEEPALIVE', 'KEEPALIVE');
  copy('MQTT_CONNECT_TIMEOUT', 'CONNECT_TIMEOUT');
  copy('MQTT_RECONNECT_PERIOD', 'RECONNECT_PERIOD');
  copy('MQTT_CLIENT_ID_PREFIX', 'CLIENT_ID_PREFIX');

  const mode = env.MQTT_PAYLOAD_MODE;
  if (mode !== undefined && mode !== '' && out.JSON_PARSING === undefined) {
    const value = String(mode).toLowerCase();
    if (!['json', 'raw'].includes(value)) {
      throw new ConfigError(`Invalid MQTT_PAYLOAD_MODE: "${mode}" — expected json or raw.`);
    }
    out.JSON_PARSING = value === 'json' ? 'true' : 'false';
  }
  return out;
}

/** Build a validated, frozen server configuration from an environment object. */
export function loadConfig(env = {}) {
  env = withAliases(env);
  const host = String(env.HOST ?? '127.0.0.1').trim();
  if (!host) throw new ConfigError('HOST must not be empty. Check HOST in .env.');
  const loopback = ['127.0.0.1', 'localhost', '::1', '[::1]'].includes(host);
  const allowRemote = boolFrom(env, 'ALLOW_REMOTE', false);
  if (!loopback && !allowRemote) {
    throw new ConfigError(
      `HOST=${host} would expose the dashboard and its TCP broker connection to the network. ` +
        'Set ALLOW_REMOTE=true only behind a firewall or authenticated reverse proxy.',
    );
  }

  const brokerHost = String(env.BROKER_HOST ?? '127.0.0.1').trim();
  if (!brokerHost || /[\s/]/.test(brokerHost)) {
    throw new ConfigError('BROKER_HOST must be a hostname or IP address without spaces or slashes.');
  }

  const transport = String(env.DEFAULT_TRANSPORT ?? 'tcp').toLowerCase();
  if (!['tcp', 'websocket'].includes(transport)) {
    throw new ConfigError(`Invalid DEFAULT_TRANSPORT: "${transport}" — expected tcp or websocket.`);
  }

  const logLevel = String(env.LOG_LEVEL ?? 'info').toLowerCase();
  if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
    throw new ConfigError(`Invalid LOG_LEVEL: "${logLevel}" — expected debug, info, warn or error.`);
  }

  return Object.freeze({
    host,
    port: intFrom(env, 'PORT', 8080, 1, 65535),
    allowRemote,
    brokerHost,
    brokerPort: intFrom(env, 'BROKER_PORT', 1883, 1, 65535),
    brokerTls: boolFrom(env, 'BROKER_TLS', false),
    transport,
    brokerWsUrl: wsUrlFrom(env),
    topics: topicsFrom(env),
    qos: intFrom(env, 'DEFAULT_QOS', 0, 0, 2),
    keepalive: intFrom(env, 'KEEPALIVE', 60, 5, 3600),
    reconnectPeriod: intFrom(env, 'RECONNECT_PERIOD', 5000, 0, 600000),
    connectTimeout: intFrom(env, 'CONNECT_TIMEOUT', 15000, 1000, 120000),
    jsonParsing: boolFrom(env, 'JSON_PARSING', true),
    maxMessages: intFrom(env, 'MAX_MESSAGES', 200, 10, 5000),
    maxHistoryPoints: intFrom(env, 'MAX_HISTORY_POINTS', 120, 10, 1000),
    clientIdPrefix: String(env.CLIENT_ID_PREFIX ?? 'mqtt-dash-').slice(0, 32) || 'mqtt-dash-',
    logLevel,
  });
}

/** Read .env (if present), then let environment variables and explicit overrides win. */
export function loadConfigFromFile(envPath, overrides = {}) {
  let fromFile = {};
  try {
    fromFile = parseEnv(fs.readFileSync(envPath, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return loadConfig({ ...fromFile, ...process.env, ...overrides });
}

/** Configuration safe to expose to the browser (no secrets are stored server-side). */
export function publicConfig(config) {
  return {
    transport: config.transport,
    brokerHost: config.brokerHost,
    brokerPort: config.brokerPort,
    brokerTls: config.brokerTls,
    brokerWsUrl: config.brokerWsUrl,
    topics: config.topics,
    qos: config.qos,
    keepalive: config.keepalive,
    reconnectPeriod: config.reconnectPeriod,
    connectTimeout: config.connectTimeout,
    jsonParsing: config.jsonParsing,
    maxMessages: config.maxMessages,
    maxHistoryPoints: config.maxHistoryPoints,
    clientIdPrefix: config.clientIdPrefix,
  };
}
