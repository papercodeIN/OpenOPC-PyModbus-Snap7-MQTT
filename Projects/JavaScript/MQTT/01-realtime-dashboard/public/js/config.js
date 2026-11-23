/** Browser configuration: defaults, validation and local persistence (no secrets). */

export const STORAGE_KEY = 'mqtt-dashboard.config.v1';

export function defaultConfig() {
  return {
    transport: 'tcp',
    brokerHost: '127.0.0.1',
    brokerPort: 1883,
    useTls: false,
    brokerWsUrl: 'ws://127.0.0.1:9001/mqtt',
    clientId: '',
    username: '',
    password: '',
    keepalive: 60,
    reconnectPeriod: 5000,
    connectTimeout: 15000,
    qos: 0,
    topics: [{ filter: 'sensors/#', qos: 0 }],
    payloadMode: 'json',
    jsonParsing: true,
    maxMessages: 200,
    maxHistoryPoints: 120,
    clientIdPrefix: 'mqtt-dash-',
  };
}

/** Coerce a raw object into known config fields with safe defaults. */
export function normalizeConfig(raw = {}) {
  const base = defaultConfig();
  const num = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const topics = Array.isArray(raw.topics)
    ? raw.topics.map((item) =>
        typeof item === 'string'
          ? { filter: item, qos: base.qos }
          : { filter: item?.filter ?? '', qos: num(item?.qos, base.qos) },
      )
    : base.topics;
  const transport = raw.transport === 'websocket' ? 'websocket' : base.transport;
  return {
    transport,
    brokerHost: String(raw.brokerHost ?? base.brokerHost).trim(),
    brokerPort: num(raw.brokerPort, base.brokerPort),
    useTls: raw.useTls === undefined ? base.useTls : Boolean(raw.useTls),
    brokerWsUrl: String(raw.brokerWsUrl ?? base.brokerWsUrl).trim(),
    clientId: String(raw.clientId ?? '').trim(),
    username: String(raw.username ?? ''),
    password: String(raw.password ?? ''),
    keepalive: num(raw.keepalive, base.keepalive),
    reconnectPeriod: num(raw.reconnectPeriod, base.reconnectPeriod),
    connectTimeout: num(raw.connectTimeout, base.connectTimeout),
    qos: num(raw.qos, base.qos),
    topics,
    jsonParsing: raw.jsonParsing === undefined ? base.jsonParsing : Boolean(raw.jsonParsing),
    maxMessages: num(raw.maxMessages, base.maxMessages),
    maxHistoryPoints: num(raw.maxHistoryPoints, base.maxHistoryPoints),
    clientIdPrefix: String(raw.clientIdPrefix ?? base.clientIdPrefix),
  };
}

export function isValidTopicFilter(filter) {
  if (typeof filter !== 'string' || filter.length === 0 || filter.length > 128 || /\s/.test(filter)) return false;
  const levels = filter.split('/');
  for (let i = 0; i < levels.length; i += 1) {
    const level = levels[i];
    if (level.includes('#') && (level !== '#' || i !== levels.length - 1)) return false;
    if (level.includes('+') && level !== '+') return false;
  }
  return true;
}

/** Return a list of human-readable validation errors (empty means valid). */
export function validateConfig(config) {
  const errors = [];
  const cfg = normalizeConfig(config);

  if (!['tcp', 'websocket'].includes(cfg.transport)) {
    errors.push('Choose either TCP or WebSocket as the MQTT transport.');
  }

  if (cfg.transport === 'tcp') {
    if (!cfg.brokerHost || /[\s/]/.test(cfg.brokerHost)) {
      errors.push('Broker host must be a hostname or IP address without spaces or slashes.');
    }
    if (!Number.isInteger(cfg.brokerPort) || cfg.brokerPort < 1 || cfg.brokerPort > 65535) {
      errors.push('Broker TCP port must be an integer between 1 and 65535 (usually 1883, or 8883 with TLS).');
    }
  } else {
    let url;
    try {
      url = new URL(cfg.brokerWsUrl);
    } catch {
      errors.push('Broker WebSocket URL is not a valid URL. Example: ws://127.0.0.1:9001/mqtt');
    }
    if (url) {
      if (!['ws:', 'wss:'].includes(url.protocol)) {
        errors.push('Broker WebSocket URL must start with ws:// or wss:// (MQTT over WebSockets).');
      }
      if (!url.hostname) errors.push('Broker WebSocket URL must include a hostname.');
      if (url.username || url.password) {
        errors.push('Do not put credentials in the WebSocket URL — use the Username and Password fields.');
      }
    }
  }

  if (cfg.clientId.length > 128 || /[\x00-\x1f]/.test(cfg.clientId)) {
    errors.push('Client ID must be 128 characters or fewer and contain no control characters.');
  }
  if (cfg.username.length > 256 || cfg.password.length > 256) {
    errors.push('Username and password must be 256 characters or fewer.');
  }
  if (!Number.isInteger(cfg.keepalive) || cfg.keepalive < 5 || cfg.keepalive > 3600) {
    errors.push('Keep alive must be an integer between 5 and 3600 seconds.');
  }
  if (!Number.isInteger(cfg.reconnectPeriod) || cfg.reconnectPeriod < 0 || cfg.reconnectPeriod > 600000) {
    errors.push('Reconnect period must be an integer between 0 (disabled) and 600000 ms.');
  }
  if (!Number.isInteger(cfg.connectTimeout) || cfg.connectTimeout < 1000 || cfg.connectTimeout > 120000) {
    errors.push('Connect timeout must be an integer between 1000 and 120000 ms.');
  }
  if (![0, 1, 2].includes(cfg.qos)) errors.push('Subscription QoS must be 0, 1 or 2.');

  if (!Array.isArray(cfg.topics) || cfg.topics.length === 0) {
    errors.push('Add at least one topic filter to subscribe to.');
  } else if (cfg.topics.length > 50) {
    errors.push('A maximum of 50 topic filters is supported.');
  } else {
    const seen = new Set();
    for (const topic of cfg.topics) {
      if (!isValidTopicFilter(topic.filter)) {
        errors.push(`Invalid topic filter "${topic.filter}" — use levels separated by "/" with # only at the end.`);
      }
      if (seen.has(topic.filter)) errors.push(`Duplicate topic filter "${topic.filter}".`);
      seen.add(topic.filter);
      if (![0, 1, 2].includes(topic.qos)) errors.push(`Invalid QoS for "${topic.filter}" — use 0, 1 or 2.`);
    }
  }
  return errors;
}

export function assertValidConfig(config) {
  const errors = validateConfig(config);
  if (errors.length) {
    const error = new Error(errors.map((message) => `• ${message}`).join('\n'));
    error.name = 'ConfigValidationError';
    error.details = errors;
    throw error;
  }
  return normalizeConfig(config);
}

/** Merge server-provided defaults with settings saved in this browser. */
export function mergeDefaults(defaults = {}, saved = {}) {
  const merged = { ...defaultConfig(), ...defaults, ...saved };
  merged.password = '';
  if (!Array.isArray(merged.topics) || merged.topics.length === 0) merged.topics = [...(defaults.topics ?? [])];
  if (defaults.brokerTls !== undefined && saved.useTls === undefined) merged.useTls = Boolean(defaults.brokerTls);
  return normalizeConfig(merged);
}

/** Persist everything except the password (and demo mode) to localStorage. */
export function saveConfig(config) {
  if (typeof localStorage === 'undefined') return false;
  const safe = normalizeConfig(config);
  delete safe.password;
  safe.demoMode = undefined;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return true;
  } catch {
    return false;
  }
}

export function loadSavedConfig() {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    delete parsed.password;
    return parsed;
  } catch {
    return {};
  }
}
