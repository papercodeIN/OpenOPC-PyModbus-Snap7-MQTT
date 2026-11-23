import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseEnv, loadConfig, loadConfigFromFile, parseTopics, safeSummary, ConfigError } from '../src/config.js';

test('parseEnv handles comments and quoted values', () => {
  assert.deepEqual(parseEnv('# c\nMQTT_PORT=1884\nMQTT_TOPICS="a/#, b/#"\n'), {
    MQTT_PORT: '1884',
    MQTT_TOPICS: 'a/#, b/#',
  });
});

test('loadConfig returns validated defaults', () => {
  const config = loadConfig({});
  assert.equal(config.host, '127.0.0.1');
  assert.equal(config.port, 1883);
  assert.deepEqual(config.topics, ['demo/#']);
  assert.equal(config.reconnectPeriod, 5000);
  assert.equal(config.jsonParsing, true);
  assert.equal(Object.isFrozen(config), true);
});

test('parseTopics accepts wildcards but rejects malformed or duplicate filters', () => {
  assert.deepEqual(parseTopics('a/#, b/+/c, d'), ['a/#', 'b/+/c', 'd']);
  assert.throws(() => parseTopics(''), /empty/);
  assert.throws(() => parseTopics('a/#/b'), /Invalid topic filter/);
  assert.throws(() => parseTopics('a/#, a/#'), /Duplicate/);
});

test('loadConfig rejects invalid values', () => {
  const cases = [
    [{ MQTT_PORT: '0' }, /Invalid MQTT_PORT/],
    [{ MQTT_QOS: '4' }, /Invalid MQTT_QOS/],
    [{ MQTT_RECONNECT_PERIOD: '-1' }, /Invalid MQTT_RECONNECT_PERIOD/],
    [{ MQTT_TLS_INSECURE: 'true' }, /requires MQTT_USE_TLS/],
    [{ MQTT_CA_FILE: 'missing.pem' }, /missing file/],
    [{ MQTT_LOG_LEVEL: 'verbose' }, /Invalid MQTT_LOG_LEVEL/],
  ];
  for (const [env, pattern] of cases) {
    assert.throws(() => loadConfig(env), (error) => error instanceof ConfigError && pattern.test(error.message));
  }
});

test('loadConfigFromFile reads .env and CLI overrides win', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mqtt-sub-env-'));
  fs.writeFileSync(path.join(dir, '.env'), 'MQTT_TOPICS=from/file\nMQTT_QOS=1\n', 'utf8');
  try {
    const config = loadConfigFromFile(path.join(dir, '.env'), { MQTT_TOPICS: 'from/cli' });
    assert.deepEqual(config.topics, ['from/cli']);
    assert.equal(config.qos, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('MQTT_PAYLOAD_MODE json|raw is the shared payload switch', () => {
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'json' }).jsonParsing, true);
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'raw' }).jsonParsing, false);
  // The page selection must beat the .env default.
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'json', MQTT_JSON_PARSING: 'false' }).jsonParsing, false);
  assert.throws(() => loadConfig({ MQTT_PAYLOAD_MODE: 'xml' }), /MQTT_PAYLOAD_MODE/);
});

test('a non-loopback bind requires ALLOW_REMOTE', () => {
  assert.throws(() => loadConfig({ HTTP_HOST: '0.0.0.0' }), /ALLOW_REMOTE/);
  const config = loadConfig({ HTTP_HOST: '0.0.0.0', ALLOW_REMOTE: 'true' });
  assert.equal(config.allowRemote, true);
  assert.equal(config.httpPort, 8082);
});

test('safeSummary omits credentials', () => {
  const summary = safeSummary(loadConfig({ MQTT_PASSWORD: 'secret' }));
  assert.equal(JSON.stringify(summary).includes('secret'), false);
});
