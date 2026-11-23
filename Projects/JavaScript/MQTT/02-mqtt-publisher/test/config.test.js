import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { parseEnv, loadConfig, loadConfigFromFile, safeSummary, ConfigError } from '../src/config.js';

test('parseEnv handles comments, quotes and export', () => {
  assert.deepEqual(
    parseEnv('# note\nMQTT_PORT=1884\nMQTT_HOST = "127.0.0.1"\nexport MQTT_LOG_LEVEL=\'debug\'\n'),
    { MQTT_PORT: '1884', MQTT_HOST: '127.0.0.1', MQTT_LOG_LEVEL: 'debug' },
  );
});

test('loadConfig returns validated defaults', () => {
  const config = loadConfig({});
  assert.equal(config.host, '127.0.0.1');
  assert.equal(config.port, 1883);
  assert.equal(config.topic, 'demo/publisher');
  assert.equal(config.payload, '{"temperature":24.5}');
  assert.equal(config.loop, false);
  assert.equal(Object.isFrozen(config), true);
});

test('loadConfig validates numeric, topic and payload settings', () => {
  const cases = [
    [{ MQTT_PORT: '70000' }, /Invalid MQTT_PORT/],
    [{ MQTT_TOPIC: 'a/#/b' }, /MQTT_TOPIC/],
    [{ MQTT_QOS: '3' }, /Invalid MQTT_QOS/],
    [{ MQTT_PAYLOAD_FORMAT: 'json', MQTT_PAYLOAD: '{bad' }, /not valid JSON/],
    [{ MQTT_TLS_INSECURE: 'true' }, /requires MQTT_USE_TLS/],
    [{ MQTT_CERT_FILE: 'x.pem' }, /missing file|MQTT_CERT_FILE/],
    [{ MQTT_LOOP: 'sometimes' }, /Invalid MQTT_LOOP/],
    [{ MQTT_MAX_MESSAGES: '0' }, /Invalid MQTT_MAX_MESSAGES/],
  ];
  for (const [env, pattern] of cases) {
    assert.throws(() => loadConfig(env), (error) => error instanceof ConfigError && pattern.test(error.message));
  }
});

test('loadConfig reads TLS certificate files when configured', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mqtt-pub-tls-'));
  const ca = path.join(dir, 'ca.pem');
  fs.writeFileSync(ca, 'not-a-real-cert', 'utf8');
  try {
    const config = loadConfig({ MQTT_USE_TLS: 'true', MQTT_CA_FILE: ca, MQTT_PORT: '8883' });
    assert.equal(config.caFile, ca);
    assert.equal(config.tlsInsecure, false);
    assert.equal(config.port, 8883);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('loadConfigFromFile lets CLI overrides win', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mqtt-pub-env-'));
  fs.writeFileSync(path.join(dir, '.env'), 'MQTT_TOPIC=from/file\nMQTT_QOS=1\n', 'utf8');
  try {
    const config = loadConfigFromFile(path.join(dir, '.env'), { MQTT_TOPIC: 'from/cli' });
    assert.equal(config.topic, 'from/cli');
    assert.equal(config.qos, 1);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('MQTT_PAYLOAD_MODE json|raw is the shared payload switch', () => {
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'json', MQTT_PAYLOAD: '{"a":1}' }).payloadFormat, 'json');
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'raw' }).payloadFormat, 'text');
  // A per-message choice must beat the .env default.
  assert.equal(loadConfig({ MQTT_PAYLOAD_MODE: 'json', MQTT_PAYLOAD_FORMAT: 'text' }).payloadFormat, 'text');
  assert.throws(() => loadConfig({ MQTT_PAYLOAD_MODE: 'xml' }), /MQTT_PAYLOAD_MODE/);
});

test('a non-loopback bind requires ALLOW_REMOTE', () => {
  assert.throws(() => loadConfig({ HTTP_HOST: '0.0.0.0' }), /ALLOW_REMOTE/);
  const config = loadConfig({ HTTP_HOST: '0.0.0.0', ALLOW_REMOTE: 'true' });
  assert.equal(config.allowRemote, true);
  assert.equal(config.httpPort, 8081);
});

test('safeSummary omits credentials and payload content', () => {
  const summary = safeSummary(loadConfig({ MQTT_PASSWORD: 'secret', MQTT_PAYLOAD: 'secret-data' }));
  assert.equal(JSON.stringify(summary).includes('secret'), false);
  assert.equal(summary.broker, 'mqtt://127.0.0.1:1883');
});
