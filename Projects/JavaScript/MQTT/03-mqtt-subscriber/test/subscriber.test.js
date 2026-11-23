import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';

import { MqttSubscriber, sanitizeError } from '../src/subscriber.js';
import { loadConfig } from '../src/config.js';

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

class MockClient extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
    this.subscriptions = null;
    this.ended = false;
  }

  subscribe(topics, callback) {
    this.subscriptions = topics;
    callback?.(null);
  }

  end() {
    this.ended = true;
    this.emit('end');
  }
}

function harness(config = {}) {
  let mock;
  const events = [];
  const messages = [];
  const subscriber = new MqttSubscriber({
    logger: silentLogger,
    onEvent: (level, message) => events.push({ level, message }),
    onMessage: (message) => messages.push(message),
    createClient: (options) => {
      mock = new MockClient(options);
      return mock;
    },
  });
  return { subscriber, cfg: loadConfig(config), events, messages, mock: () => mock };
}

test('sanitizeError removes credentials from URLs', () => {
  assert.equal(sanitizeError(new Error('mqtt://u:p@host failed')), 'mqtt://***@host failed');
});

test('connect builds safe options and subscribes on connect', async () => {
  const h = harness({ MQTT_CLIENT_ID: 'fixed', MQTT_TOPICS: 'a/#, b/+', MQTT_QOS: 2 });
  const pending = h.subscriber.connect(h.cfg);
  const mock = h.mock();
  assert.equal(mock.options.protocol, 'mqtt');
  assert.equal(mock.options.clientId, 'fixed');
  assert.equal(mock.options.password, undefined);
  assert.equal(mock.options.reconnectPeriod, 5000);
  mock.emit('connect');
  await pending;
  assert.deepEqual(mock.subscriptions, { 'a/#': { qos: 2 }, 'b/+': { qos: 2 } });
  assert.deepEqual(h.subscriber.subscribed, ['a/#', 'b/+']);
});

test('connect generates a client id when none is configured', async () => {
  const h = harness();
  const pending = h.subscriber.connect(h.cfg);
  assert.match(h.mock().options.clientId, /^mqtt-sub-[0-9a-f]{8}$/);
  h.mock().emit('connect');
  await pending;
});

test('connect rejects on broker error and on timeout', async () => {
  const fail = harness();
  const pending = fail.subscriber.connect(fail.cfg);
  fail.mock().emit('error', new Error('broker unavailable'));
  await assert.rejects(pending, /Connection failed: broker unavailable/);

  const timeout = harness();
  await assert.rejects(
    timeout.subscriber.connect({ ...timeout.cfg, connectTimeout: 50 }),
    /Connection timed out after 50 ms/,
  );
});

test('messages, reconnect and errors are forwarded', async () => {
  const h = harness();
  const pending = h.subscriber.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  h.mock().emit('message', 'a/1', '{"t":1}', { qos: 1 });
  h.mock().emit('reconnect');
  h.mock().emit('error', new Error('mqtt://user:pw@host failed'));
  assert.equal(h.messages.length, 1);
  assert.equal(h.messages[0].topic, 'a/1');
  assert.equal(h.messages[0].qos, 1);
  assert.ok(h.events.some((event) => /reconnecting/i.test(event.message)));
  assert.ok(h.events.some((event) => /\*\*\*@host/.test(event.message)));
});

test('subscription errors are reported without throwing', async () => {
  const h = harness();
  const pending = h.subscriber.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  h.mock().subscribe = (topics, callback) => callback(new Error('ACL denied'));
  h.subscriber._subscribe();
  assert.ok(h.events.some((event) => /Subscription failed: ACL denied/.test(event.message)));
});

test('connection status follows the client lifecycle', async () => {
  const h = harness();
  const pending = h.subscriber.connect(h.cfg);
  assert.equal(h.subscriber.status, 'connecting');
  h.mock().emit('connect');
  await pending;
  assert.equal(h.subscriber.status, 'connected');
  assert.equal(h.subscriber.isConnected(), true);

  h.mock().emit('offline');
  assert.equal(h.subscriber.status, 'offline');
  assert.equal(h.subscriber.isConnected(), false);

  h.mock().emit('connect');
  assert.equal(h.subscriber.status, 'connected');
});

test('end is idempotent and stops message delivery', async () => {
  const h = harness();
  const pending = h.subscriber.connect(h.cfg);
  h.mock().emit('connect');
  await pending;
  await h.subscriber.end();
  await h.subscriber.end();
  assert.equal(h.mock().ended, true);
  assert.equal(h.subscriber.client, null);
});
