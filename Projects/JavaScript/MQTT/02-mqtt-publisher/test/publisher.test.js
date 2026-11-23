import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { MqttPublisher, sanitizeError } from '../src/publisher.js';
import { loadConfig } from '../src/config.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

class MockClient extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.published = [];
    this.ended = false;
    this.endForce = null;
    this.publishError = null;
  }

  publish(topic, payload, options, callback) {
    this.published.push({ topic, payload, options });
    callback?.(this.publishError);
  }

  end(force) {
    this.ended = true;
    this.endForce = force;
    this.emit('end');
  }
}

function harness(config = {}) {
  let mock;
  const publisher = new MqttPublisher({
    logger: silentLogger,
    createClient: (options) => {
      mock = new MockClient(options);
      return mock;
    },
  });
  return { publisher, cfg: loadConfig(config), mock: () => mock };
}

test('sanitizeError removes credentials from URLs', () => {
  assert.equal(sanitizeError(new Error('mqtt://user:pw@host failed')), 'mqtt://***@host failed');
});

test('connect builds safe options and resolves on connect', async () => {
  const h = harness({ MQTT_CLIENT_ID: 'fixed', MQTT_USERNAME: 'reader', MQTT_PASSWORD: 'topsecret' });
  const pending = h.publisher.connect(h.cfg);
  assert.match(h.mock().options.clientId, /^fixed$/);
  assert.equal(h.mock().options.protocol, 'mqtt');
  assert.equal(h.mock().options.hostname, '127.0.0.1');
  assert.equal(h.mock().options.port, 1883);
  assert.equal(h.mock().options.password, 'topsecret');
  h.mock().emit('connect');
  await pending;
  assert.equal(h.publisher.client !== null, true);
});

test('connect generates a client id when none is configured', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  assert.match(h.mock().options.clientId, /^mqtt-pub-[0-9a-f]{8}$/);
  h.mock().emit('connect');
  await pending;
});

test('connect rejects on broker error and on timeout', async () => {
  const withError = harness();
  const pending = withError.publisher.connect(withError.cfg);
  withError.mock().emit('error', new Error('connection refused'));
  await assert.rejects(pending, /Connection failed: connection refused/);

  const withTimeout = harness();
  await assert.rejects(
    withTimeout.publisher.connect({ ...withTimeout.cfg, connectTimeout: 50 }),
    /Connection timed out after 50 ms/,
  );
});

test('publish serializes JSON and forwards QoS/retain', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  await h.publisher.publish('a/b', { temp: 1 }, { qos: 2, retain: true, format: 'json' });
  assert.deepEqual(h.mock().published[0], {
    topic: 'a/b',
    payload: '{"temp":1}',
    options: { qos: 2, retain: true },
  });
});

test('publish rejects on callback error and when disconnected', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  h.mock().publishError = new Error('quota exceeded');
  await assert.rejects(h.publisher.publish('a/b', 'x'), /Publish failed: quota exceeded/);
  await h.publisher.end();
  await assert.rejects(h.publisher.publish('a/b', 'x'), /Not connected/);
});

test('TLS options load certificate files and default to verification on', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mqtt-pub-cert-'));
  const ca = path.join(dir, 'ca.pem');
  fs.writeFileSync(ca, 'ca-content', 'utf8');
  try {
    const h = harness({ MQTT_USE_TLS: 'true', MQTT_CA_FILE: ca, MQTT_PORT: '8883' });
    const pending = h.publisher.connect(h.cfg);
    assert.equal(h.mock().options.protocol, 'mqtts');
    assert.equal(h.mock().options.rejectUnauthorized, true);
    assert.equal(h.mock().options.ca.toString(), 'ca-content');
    h.mock().emit('connect');
    await pending;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('connection status follows the client lifecycle', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  assert.equal(h.publisher.status, 'connecting');
  h.mock().emit('connect');
  await pending;
  assert.equal(h.publisher.status, 'connected');
  assert.equal(h.publisher.isConnected(), true);

  h.mock().emit('close');
  assert.equal(h.publisher.status, 'offline');
  assert.equal(h.publisher.isConnected(), false);

  h.mock().emit('connect');
  assert.equal(h.publisher.status, 'connected');
  assert.equal(h.publisher.isConnected(), true);
});

test('a publish that never settles times out instead of hanging', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  h.mock().emit('connect');
  await pending;

  h.mock().publish = () => {}; // the broker never acknowledges
  await assert.rejects(h.publisher.publish('a/b', 'x', { timeoutMs: 40 }), /Publish timed out after 40 ms/);
});

test('end is idempotent and closes gracefully so QoS 0 publishes flush', async () => {
  const h = harness();
  const pending = h.publisher.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  await h.publisher.end();
  await h.publisher.end();
  assert.equal(h.mock().ended, true);
  assert.equal(h.mock().endForce, false);
});
