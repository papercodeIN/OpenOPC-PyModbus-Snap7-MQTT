import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseEnv, loadConfig, loadConfigFromFile, publicConfig, ConfigError } from '../src/config.js';

test('parseEnv handles comments, blank lines, export and quotes', () => {
  const parsed = parseEnv(`
# comment
PORT=9000
HOST = "127.0.0.1"
export LOG_LEVEL='debug'
BROKEN LINE
`);
  assert.deepEqual(parsed, { PORT: '9000', HOST: '127.0.0.1', LOG_LEVEL: 'debug' });
});

test('loadConfig returns validated defaults', () => {
  const config = loadConfig({});
  assert.equal(config.port, 8080);
  assert.equal(config.host, '127.0.0.1');
  assert.equal(config.brokerWsUrl, 'ws://127.0.0.1:9001/mqtt');
  assert.deepEqual(config.topics, ['sensors/#']);
  assert.equal(config.jsonParsing, true);
  assert.equal(Object.isFrozen(config), true);
});

test('shared MQTT_* names are accepted alongside the legacy names', () => {
  const config = loadConfig({
    MQTT_HOST: 'broker.local',
    MQTT_PORT: '1884',
    MQTT_USE_TLS: 'true',
    MQTT_TOPICS: 'a/#, b/+',
    MQTT_QOS: '1',
    MQTT_KEEPALIVE: '30',
    MQTT_CONNECT_TIMEOUT: '8000',
    MQTT_RECONNECT_PERIOD: '2000',
    MQTT_PAYLOAD_MODE: 'raw',
    MQTT_CLIENT_ID_PREFIX: 'dash-',
  });
  assert.equal(config.brokerHost, 'broker.local');
  assert.equal(config.brokerPort, 1884);
  assert.equal(config.brokerTls, true);
  assert.deepEqual(config.topics, ['a/#', 'b/+']);
  assert.equal(config.qos, 1);
  assert.equal(config.keepalive, 30);
  assert.equal(config.connectTimeout, 8000);
  assert.equal(config.reconnectPeriod, 2000);
  assert.equal(config.jsonParsing, false);
  assert.equal(config.clientIdPrefix, 'dash-');
  assert.throws(() => loadConfig({ MQTT_PAYLOAD_MODE: 'xml' }), /MQTT_PAYLOAD_MODE/);
  // An explicit legacy flag beats the shared mode.
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'raw', JSON_PARSING: 'true' }).jsonParsing, true);
});

test('loadConfig accepts valid overrides', () => {
  const config = loadConfig({
    PORT: '9090',
    BROKER_WS_URL: 'wss://broker.example/mqtt',
    DEFAULT_TOPICS: 'a/#, b/+/c',
    DEFAULT_QOS: '2',
    JSON_PARSING: 'false',
    MAX_MESSAGES: '50',
  });
  assert.equal(config.port, 9090);
  assert.equal(config.brokerWsUrl, 'wss://broker.example/mqtt');
  assert.deepEqual(config.topics, ['a/#', 'b/+/c']);
  assert.equal(config.qos, 2);
  assert.equal(config.jsonParsing, false);
  assert.equal(config.maxMessages, 50);
});

test('loadConfig rejects invalid values with actionable messages', () => {
  const cases = [
    [{ PORT: 'abc' }, /Invalid PORT/],
    [{ PORT: '70000' }, /Invalid PORT/],
    [{ BROKER_WS_URL: 'http://example.com' }, /only ws:\/\/ and wss:\/\//],
    [{ BROKER_WS_URL: 'ws://user:pass@example.com' }, /must not contain credentials/],
    [{ DEFAULT_TOPICS: '' }, /DEFAULT_TOPICS is empty/],
    [{ DEFAULT_TOPICS: 'a b' }, /cannot contain spaces/],
    [{ DEFAULT_QOS: '3' }, /Invalid DEFAULT_QOS/],
    [{ JSON_PARSING: 'maybe' }, /Invalid JSON_PARSING/],
    [{ LOG_LEVEL: 'trace' }, /Invalid LOG_LEVEL/],
  ];
  for (const [env, pattern] of cases) {
    assert.throws(() => loadConfig(env), (error) => error instanceof ConfigError && pattern.test(error.message));
  }
});

test('loadConfigFromFile reads .env and lets process env win', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mqtt-dash-config-'));
  const envPath = path.join(dir, '.env');
  fs.writeFileSync(envPath, 'PORT=8123\nLOG_LEVEL=warn\n', 'utf8');
  try {
    const original = process.env.PORT;
    delete process.env.PORT;
    try {
      assert.equal(loadConfigFromFile(envPath).port, 8123);
      process.env.PORT = '8234';
      assert.equal(loadConfigFromFile(envPath).port, 8234);
    } finally {
      if (original === undefined) delete process.env.PORT;
      else process.env.PORT = original;
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('a non-loopback bind requires ALLOW_REMOTE', () => {
  assert.throws(() => loadConfig({ HOST: '0.0.0.0' }), /ALLOW_REMOTE/);
  const config = loadConfig({ HOST: '0.0.0.0', ALLOW_REMOTE: 'true' });
  assert.equal(config.allowRemote, true);
  assert.equal(config.host, '0.0.0.0');
  assert.equal(loadConfig({ HOST: 'localhost' }).allowRemote, false);
});

test('publicConfig exposes no credentials', () => {
  const publicCfg = publicConfig(loadConfig({}));
  assert.equal(publicCfg.password, undefined);
  assert.equal('username' in publicCfg, false);
  assert.equal(publicCfg.brokerWsUrl, 'ws://127.0.0.1:9001/mqtt');
});
