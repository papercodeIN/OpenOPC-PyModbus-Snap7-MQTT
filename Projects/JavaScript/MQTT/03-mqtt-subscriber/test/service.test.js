import test from 'node:test';
import assert from 'node:assert/strict';

import { SubscriberService } from '../src/service.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function fakeSubscriber() {
  return {
    connects: 0,
    ended: 0,
    subscriptions: null,
    status: 'closed',
    isConnected() {
      return this.status === 'connected';
    },
    failConnect: false,
    async connect(config) {
      this.connects += 1;
      this.config = config;
      if (this.failConnect) throw new Error('connection refused');
      this.status = 'connected';
    },
    setSubscriptions(topics, qos) {
      this.subscriptions = { topics, qos };
    },
    async end() {
      this.ended += 1;
      this.status = 'closed';
    },
  };
}

function harness() {
  let subscriber;
  const service = new SubscriberService({
    env: { MQTT_TOPICS: 'demo/#' },
    logger: silentLogger,
    createSubscriber: () => {
      subscriber = fakeSubscriber();
      return subscriber;
    },
  });
  return { service, subscriber: () => subscriber };
}

const connectInput = { host: '127.0.0.1', port: 1883, tls: false, topics: [{ filter: 'sensors/#', qos: 0 }], qos: 0 };

test('connect exposes a safe broker state with the topic list', async () => {
  const h = harness();
  const state = await h.service.connect(connectInput);
  assert.equal(state.connected, true);
  assert.equal(state.broker.url, 'mqtt://127.0.0.1:1883');
  assert.deepEqual(state.topics, ['sensors/#']);
  assert.equal(state.qos, 0);
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
  assert.equal(h.subscriber().config.keepalive, 30);
  assert.equal(h.subscriber().config.connectTimeout, 8000);
  assert.equal(h.subscriber().config.reconnectPeriod, 2000);
});

test('connect rejects an empty or invalid topic list with status 400', async () => {
  const h = harness();
  await assert.rejects(h.service.connect({ ...connectInput, topics: [] }), (error) => error.status === 400);
  await assert.rejects(h.service.connect({ ...connectInput, topics: [{ filter: 'a/#/b', qos: 0 }] }), (error) => error.status === 400);
  await assert.rejects(h.service.connect({ ...connectInput, port: 70000 }), (error) => error.status === 400);
});

test('a broker failure is reported as 502 and keeps the service disconnected', async () => {
  const h = harness();
  h.service.createSubscriber = () => {
    const client = fakeSubscriber();
    client.failConnect = true;
    return client;
  };
  await assert.rejects(h.service.connect(connectInput), (error) => error.status === 502 && /connection refused/.test(error.message));
  assert.equal(h.service.state().connected, false);
});

test('messages are emitted as text plus base64 with a counter', async () => {
  const h = harness();
  const events = [];
  h.service.on((event) => events.push(event));
  await h.service.connect(connectInput);

  h.subscriber().onMessage({ topic: 'sensors/a', payload: Buffer.from('{"t":1}'), qos: 1 });
  const event = events.find((item) => item.kind === 'message');
  const message = event.message;
  assert.equal(message.topic, 'sensors/a');
  assert.equal(message.qos, 1);
  assert.equal(message.text, '{"t":1}');
  assert.equal(Buffer.from(message.payloadBase64, 'base64').toString(), '{"t":1}');
  assert.equal(event.received, 1);
  assert.equal(event.lastMessageAt, message.at);
  assert.equal(h.service.state().received, 1);
  assert.equal(typeof message.at, 'number');
});

test('updateSubscriptions forwards the new filters', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  const state = await h.service.updateSubscriptions({
    ...connectInput,
    topics: [{ filter: 'a/+', qos: 1 }, { filter: 'b/#', qos: 2 }],
    qos: 1,
  });
  assert.deepEqual(state.topics, ['a/+', 'b/#']);
  assert.deepEqual(h.subscriber().subscriptions, { topics: ['a/+', 'b/#'], qos: 1 });
});

test('updateSubscriptions before connect is rejected with 409', async () => {
  const h = harness();
  await assert.rejects(h.service.updateSubscriptions({ topics: [{ filter: 'a/#', qos: 0 }] }), (error) => error.status === 409);
});

test('disconnect closes the client and clears the broker', async () => {
  const h = harness();
  await h.service.connect(connectInput);
  const state = await h.service.disconnect();
  assert.equal(state.connected, false);
  assert.equal(state.broker, null);
  assert.deepEqual(state.topics, []);
  assert.equal(h.subscriber().ended, 1);
});
