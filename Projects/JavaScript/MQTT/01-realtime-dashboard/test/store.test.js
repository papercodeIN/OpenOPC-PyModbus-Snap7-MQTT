import test from 'node:test';
import assert from 'node:assert/strict';

import { MessageStore } from '../public/js/store.js';

function entry(overrides = {}) {
  return {
    topic: 'sensors/room',
    qos: 1,
    timestamp: 1000,
    text: '{"temp":21}',
    kind: 'json',
    metrics: [{ key: 'temp', value: 21 }],
    ...overrides,
  };
}

test('store keeps newest messages first and tracks statistics', () => {
  const store = new MessageStore({ maxMessages: 3, maxHistoryPoints: 2 });
  store.add(entry({ timestamp: 1000 }));
  store.add(entry({ timestamp: 2000, kind: 'text', error: 'bad json', metrics: [] }));
  const stats = store.stats();
  assert.equal(stats.received, 2);
  assert.equal(stats.parseErrors, 1);
  assert.equal(stats.lastAt, 2000);
  assert.equal(stats.firstAt, 1000);
  assert.equal(store.messages[0].timestamp, 2000);
});

test('store enforces message and history limits', () => {
  const store = new MessageStore({ maxMessages: 2, maxHistoryPoints: 2 });
  store.add(entry({ timestamp: 1000, metrics: [{ key: 't', value: 1 }] }));
  store.add(entry({ timestamp: 2000, metrics: [{ key: 't', value: 2 }] }));
  store.add(entry({ timestamp: 3000, metrics: [{ key: 't', value: 3 }] }));
  assert.equal(store.messages.length, 2);
  assert.equal(store.messages[0].timestamp, 3000);
  assert.deepEqual(store.getSeries('t'), [
    { t: 2000, value: 2 },
    { t: 3000, value: 3 },
  ]);
  assert.equal(store.received, 3);
});

test('store filters topics and reports latest metric values', () => {
  const store = new MessageStore();
  store.add(entry({ topic: 'sensors/a', metrics: [{ key: 't', value: 10 }] }));
  store.add(entry({ topic: 'sensors/b', metrics: [{ key: 't', value: 20 }] }));
  assert.equal(store.filtered('b').length, 1);
  assert.equal(store.filtered('SENSORS').length, 2);
  assert.deepEqual(store.latestMetrics().get('t'), { value: 20, t: 1000 });
  assert.deepEqual(store.metricKeys(), ['t']);
});

test('store clear resets all state', () => {
  const store = new MessageStore();
  store.add(entry());
  store.clear();
  assert.equal(store.messages.length, 0);
  assert.equal(store.metricKeys().length, 0);
  assert.equal(store.stats().received, 0);
});
