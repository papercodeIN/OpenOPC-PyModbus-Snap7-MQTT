import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { MqttDashboardClient, sanitizeError } from '../public/js/mqtt-client.js';

class MockClient extends EventEmitter {
  constructor(url, options) {
    super();
    this.url = url;
    this.options = options;
    this.subscriptions = null;
    this.removed = [];
    this.ended = false;
  }

  subscribe(topics, callback) {
    this.subscriptions = topics;
    callback?.(null, []);
  }

  unsubscribe(topics, callback) {
    this.removed.push(topics);
    callback?.(null);
  }

  end() {
    this.ended = true;
    this.emit('end');
  }
}

function harness(options = {}) {
  const statuses = [];
  const events = [];
  const messages = [];
  let mock;
  const client = new MqttDashboardClient({
    createClient: (url, opts) => {
      mock = new MockClient(url, opts);
      return mock;
    },
    onStatus: (status) => statuses.push(status),
    onEvent: (level, message) => events.push({ level, message }),
    onMessage: (message) => messages.push(message),
    ...options,
  });
  const cfg = {
    brokerWsUrl: 'ws://127.0.0.1:9001/mqtt',
    clientId: '',
    clientIdPrefix: 'test-',
    username: '',
    password: '',
    keepalive: 30,
    reconnectPeriod: 0,
    connectTimeout: 5000,
    topics: [{ filter: 'sensors/#', qos: 1 }],
  };
  return { client, cfg, statuses, events, messages, mock: () => mock };
}

test('sanitizeError removes credentials from URLs and newlines', () => {
  assert.equal(sanitizeError(new Error('ws://user:secret@host:9001 failed\nagain')), 'ws://***@host:9001 failed again');
});

test('connect validates the URL and builds safe connect options', () => {
  const h = harness();
  assert.throws(() => h.client.connect({ ...h.cfg, brokerWsUrl: 'tcp://host:1883' }), /ws:\/\/ or wss:\/\//);
  h.client.connect(h.cfg);
  const mock = h.mock();
  assert.match(mock.options.clientId, /^test-[0-9a-f]{8}$/);
  assert.equal(mock.options.username, undefined);
  assert.equal(mock.options.password, undefined);
  assert.equal(mock.options.reconnectPeriod, 0);
  assert.equal(h.statuses[0].state, 'connecting');
});

test('connect passes supplied credentials and keeps them out of status events', () => {
  const h = harness();
  h.client.connect({ ...h.cfg, clientId: 'fixed-id', username: 'reader', password: 'topsecret' });
  const mock = h.mock();
  assert.equal(mock.options.clientId, 'fixed-id');
  assert.equal(mock.options.username, 'reader');
  assert.equal(mock.options.password, 'topsecret');
  assert.equal(JSON.stringify(h.statuses).includes('topsecret'), false);
  assert.equal(JSON.stringify(h.events).includes('topsecret'), false);
});

test('subscribe happens on connect and subscription success is reported', () => {
  const h = harness();
  h.client.connect(h.cfg);
  const mock = h.mock();
  mock.emit('connect');
  assert.deepEqual(mock.subscriptions, { 'sensors/#': { qos: 1 } });
  assert.equal(h.client.isConnected(), true);
  assert.ok(h.events.some((event) => event.level === 'success' && /Subscribed/.test(event.message)));
  assert.equal(h.statuses.at(-1).detail, 'Subscribed');
});

test('message, reconnect and error events are forwarded safely', () => {
  const h = harness();
  h.client.connect(h.cfg);
  const mock = h.mock();
  mock.emit('connect');
  mock.emit('message', 'sensors/1', '{"t":1}', { qos: 2 });
  mock.emit('reconnect');
  mock.emit('error', new Error('ws://user:pass@host failed'));
  assert.deepEqual(h.messages[0], { topic: 'sensors/1', payload: '{"t":1}', qos: 2 });
  assert.equal(h.statuses.at(-1).state, 'reconnecting');
  const errorEvent = h.events.find((event) => event.level === 'error');
  assert.match(errorEvent.message, /\*\*\*@host/);
});

test('setSubscriptions unsubscribes removed filters while connected', () => {
  const h = harness();
  h.client.connect(h.cfg);
  const mock = h.mock();
  mock.emit('connect');
  h.client.setSubscriptions([{ filter: 'new/#', qos: 0 }]);
  assert.deepEqual(mock.removed, [['sensors/#']]);
  assert.deepEqual(mock.subscriptions, { 'new/#': { qos: 0 } });
});

test('disconnect ends the client and ignores later broker events', () => {
  const h = harness();
  h.client.connect(h.cfg);
  const mock = h.mock();
  mock.emit('connect');
  h.client.disconnect();
  assert.equal(mock.ended, true);
  assert.equal(h.client.isConnected(), false);
  const eventCount = h.events.length;
  mock.emit('message', 'late/topic', 'x', { qos: 0 });
  assert.equal(h.events.length, eventCount);
  assert.equal(h.statuses.at(-1).state, 'disconnected');
});

test('callback exceptions from the UI do not break the client', () => {
  const h = harness({ onMessage: () => { throw new Error('UI bug'); } });
  h.client.connect(h.cfg);
  const mock = h.mock();
  mock.emit('connect');
  assert.doesNotThrow(() => mock.emit('message', 'a/b', 'x', { qos: 0 }));
});
