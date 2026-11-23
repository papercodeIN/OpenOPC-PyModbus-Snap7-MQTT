import test from 'node:test';
import assert from 'node:assert/strict';

import { PublisherService, ServiceError } from '../src/service.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function fakePublisher() {
  return {
    connects: 0,
    published: [],
    ended: 0,
    status: 'closed',
    isConnected() {
      return this.status === 'connected';
    },
    failConnect: false,
    failPublish: false,
    async connect(config) {
      this.connects += 1;
      this.config = config;
      if (this.failConnect) throw new Error('connection refused');
      this.status = 'connected';
    },
    async publish(topic, value, options) {
      if (this.failPublish) throw new Error('quota exceeded');
      this.published.push({ topic, value, options });
    },
    async end() {
      this.ended += 1;
      this.status = 'closed';
    },
  };
}

function harness() {
  let publisher;
  const service = new PublisherService({
    env: { MQTT_TOPIC: 'demo/publisher', MQTT_PAYLOAD_FORMAT: 'text', MQTT_PAYLOAD: 'hello' },
    logger: silentLogger,
    createPublisher: () => {
      publisher = fakePublisher();
      return publisher;
    },
  });
  return { service, publisher: () => publisher };
}

const connectInput = { host: '127.0.0.1', port: 1883, tls: false, topics: [] };

test('connect stores a safe broker state and logs the event', async () => {
  const h = harness();
  const logs = [];
  h.service.on((event) => {
    if (event.kind === 'log') logs.push(event.message);
  });
  const state = await h.service.connect(connectInput);
  assert.equal(state.connected, true);
  assert.equal(state.broker.url, 'mqtt://127.0.0.1:1883');
  assert.equal(state.published, 0);
  assert.ok(logs.some((message) => message.includes('TCP connection established')));
});

test('connect forwards keepalive, timeout and reconnect settings', async () => {
  const h = harness();
  const state = await h.service.connect({
    ...connectInput,
    keepalive: 30,
    connectTimeout: 8000,
    reconnectPeriod: 2000,
  });
  assert.equal(state.connected, true);
  assert.equal(h.publisher().config.keepalive, 30);
  assert.equal(h.publisher().config.connectTimeout, 8000);
  assert.equal(h.publisher().config.reconnectPeriod, 2000);
});

test('connect rejects invalid input with status 400', async () => {
  const h = harness();
  await assert.rejects(h.service.connect({ port: 70000 }), (error) => error instanceof ServiceError && error.status === 400);
  await assert.rejects(h.service.connect({ host: '' }), (error) => error.status === 400);
});

test('a broker failure is reported as status 502 and leaves the service disconnected', async () => {
  const h = harness();
  h.publisher(); // ensure factory exists, then force the failure
  const service = h.service;
  service.createPublisher = () => {
    const client = fakePublisher();
    client.failConnect = true;
    return client;
  };
  await assert.rejects(service.connect(connectInput), (error) => error.status === 502 && /connection refused/.test(error.message));
  assert.equal(service.state().connected, false);
  assert.match(service.state().lastError, /connection refused/);
});

test('publish validates the message and forwards format, QoS and retain', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  const record = await h.service.publish({
    topic: 'sensors/a',
    payload: '{"t":21}',
    format: 'json',
    qos: 1,
    retain: true,
  });
  assert.equal(record.topic, 'sensors/a');
  assert.equal(record.qos, 1);
  assert.equal(record.retain, true);
  assert.deepEqual(h.publisher().published[0], {
    topic: 'sensors/a',
    value: { t: 21 },
    options: { qos: 1, retain: true, format: 'json', timeoutMs: 10000 },
  });
  assert.equal(h.service.state().published, 1);
});

test('publish rejects wildcards, bad QoS and invalid JSON as 400', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  const base = { payload: 'x', format: 'text', qos: 0, retain: false };
  await assert.rejects(h.service.publish({ ...base, topic: 'a/#' }), (error) => error.status === 400);
  await assert.rejects(h.service.publish({ ...base, topic: 'a/b', qos: 3 }), (error) => error.status === 400);
  await assert.rejects(h.service.publish({ ...base, topic: 'a/b', format: 'json', payload: '{oops' }), (error) => error.status === 400);
});

test('publish before connect is rejected with status 409', async () => {
  const h = harness();
  await assert.rejects(h.service.publish({ topic: 'a/b', payload: 'x', format: 'text', qos: 0 }), (error) => error.status === 409);
});

test('a publish failure increments the failure counter and returns 502', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  h.publisher().failPublish = true;
  await assert.rejects(h.service.publish({ topic: 'a/b', payload: 'x', format: 'text', qos: 0 }), (error) => error.status === 502);
  assert.equal(h.service.state().failed, 1);
  assert.equal(h.service.state().lastError, 'quota exceeded');
});

test('a burst publishes a bounded number of messages and reports progress', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  const started = h.service.startBurst({ topic: 'burst/a', payload: 'tick', format: 'text', qos: 0, count: 2, intervalMs: 1000 });
  assert.equal(started.job.running, true);
  assert.equal(started.job.total, 2);

  await new Promise((resolve) => setTimeout(resolve, 1300));
  const state = h.service.state();
  assert.equal(state.job.running, false);
  assert.equal(state.job.sent, 2);
  assert.equal(state.published, 2);
});

test('disconnect stops the burst and closes the client', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  h.service.startBurst({ topic: 'burst/a', payload: 'tick', format: 'text', qos: 0, count: 2, intervalMs: 1000 });
  const state = await h.service.disconnect();
  assert.equal(state.connected, false);
  assert.equal(h.publisher().ended, 1);
  await new Promise((resolve) => setTimeout(resolve, 50));
  assert.equal(h.service.state().job.cancelled, true);
});
