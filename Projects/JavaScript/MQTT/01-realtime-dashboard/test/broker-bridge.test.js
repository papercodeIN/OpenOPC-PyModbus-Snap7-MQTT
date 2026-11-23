import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { BrokerBridge, BrokerInputError, normalizeBrokerInput } from '../src/broker-bridge.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

class FakeClient extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.subscriptions = [];
    this.ended = null;
  }

  subscribe(map, callback) {
    this.subscriptions.push(map);
    callback?.(null);
  }

  unsubscribe(filters, callback) {
    this.unsubscribed = filters;
    callback?.(null);
  }

  end(force) {
    this.ended = force;
    this.emit('end');
  }
}

function harness() {
  let client;
  const events = [];
  const bridge = new BrokerBridge({
    logger: silentLogger,
    createClient: (options) => {
      client = new FakeClient(options);
      return client;
    },
    onEvent: (type, payload) => events.push({ type, payload }),
  });
  return { bridge, events, client: () => client };
}

test('normalizeBrokerInput validates host, port and topics', () => {
  const options = normalizeBrokerInput({ host: 'broker.local', port: 1884, topics: [{ filter: 'a/#', qos: 1 }] });
  assert.equal(options.host, 'broker.local');
  assert.equal(options.port, 1884);
  assert.deepEqual(options.topics, [{ filter: 'a/#', qos: 1 }]);

  assert.throws(() => normalizeBrokerInput({ host: '' }), BrokerInputError);
  assert.throws(() => normalizeBrokerInput({ host: 'a b' }), /without spaces/);
  assert.throws(() => normalizeBrokerInput({ port: 70000 }), /between 1 and 65535/);
  assert.throws(() => normalizeBrokerInput({ topics: [] }), /at least one topic/);
  assert.throws(() => normalizeBrokerInput({ topics: ['a/#/b'] }), /Invalid topic filter/);
  assert.throws(() => normalizeBrokerInput({ topics: ['a/#', 'a/#'] }), /Duplicate topic filter/);
});

test('normalizeBrokerInput defaults to the TLS port when TLS is enabled', () => {
  assert.equal(normalizeBrokerInput({ tls: true, topics: ['a/#'] }).port, 8883);
  assert.equal(normalizeBrokerInput({ topics: ['a/#'] }).port, 1883);
});

test('connect uses MQTT over TCP and subscribes to every filter', async () => {
  const h = harness();
  const pending = h.bridge.connect({ host: '127.0.0.1', port: 1884, topics: [{ filter: 'a/#', qos: 1 }] });
  assert.equal(h.client().options.protocol, 'mqtt');
  assert.equal(h.client().options.port, 1884);
  h.client().emit('connect');
  const state = await pending;

  assert.equal(state.connected, true);
  assert.equal(state.transport, 'tcp');
  assert.equal(state.broker, 'mqtt://127.0.0.1:1884');
  assert.deepEqual(Object.keys(h.client().subscriptions[0]), ['a/#']);
});

test('messages are forwarded with a base64 payload', async () => {
  const h = harness();
  const pending = h.bridge.connect({ topics: ['sensors/#'] });
  h.client().emit('connect');
  await pending;

  h.client().emit('message', 'sensors/a', Buffer.from('{"t":1}'), { qos: 1 });
  const message = h.events.find((event) => event.type === 'message');
  assert.ok(message);
  assert.equal(message.payload.topic, 'sensors/a');
  assert.equal(message.payload.qos, 1);
  assert.equal(Buffer.from(message.payload.payloadBase64, 'base64').toString(), '{"t":1}');
  assert.equal(h.bridge.getState().received, 1);
});

test('a failed handshake leaves the bridge reusable', async () => {
  const h = harness();
  const pending = h.bridge.connect({ topics: ['a/#'] });
  h.client().emit('error', new Error('connection refused'));
  await assert.rejects(pending, /Connection failed: connection refused/);
  assert.equal(h.bridge.client, null);
  assert.equal(h.bridge.getState().connected, false);

  const retry = h.bridge.connect({ topics: ['a/#'] });
  h.client().emit('connect');
  await retry;
  assert.equal(h.bridge.getState().connected, true);
});

test('reconnect returns the bridge to connected and replays subscriptions', async () => {
  const h = harness();
  const pending = h.bridge.connect({ topics: ['a/#'] });
  h.client().emit('connect');
  await pending;
  assert.equal(h.bridge.getState().state, 'connected');

  h.client().emit('close');
  assert.equal(h.bridge.getState().state, 'offline');
  h.client().emit('reconnect');
  assert.equal(h.bridge.getState().state, 'reconnecting');

  h.client().emit('error', new Error('boom'));
  assert.equal(h.bridge.getState().lastError, 'boom');

  h.client().emit('connect');
  assert.equal(h.bridge.getState().state, 'connected');
  assert.equal(h.bridge.getState().lastError, null);
  assert.equal(h.client().subscriptions.length, 2);
});

test('disconnect closes the client and clears subscriptions', async () => {
  const h = harness();
  const pending = h.bridge.connect({ topics: ['a/#'] });
  h.client().emit('connect');
  await pending;

  const state = await h.bridge.disconnect();
  assert.equal(state.connected, false);
  assert.deepEqual(state.topics, []);
  assert.equal(h.client().ended, false);
});
