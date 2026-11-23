import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from '../src/config.js';
import { createStaticServer } from '../src/static-server.js';
import { createEventHub } from '../src/event-hub.js';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function fakeBridge() {
  return {
    state: 'disconnected',
    calls: [],
    getState() {
      return { state: this.state, connected: this.state === 'connected', transport: 'tcp', topics: [] };
    },
    async connect(input) {
      this.calls.push(['connect', input]);
      if (input.host === 'fail.local') throw new Error('Connection failed: connection refused');
      this.state = 'connected';
      return this.getState();
    },
    async setSubscriptions(topics) {
      this.calls.push(['subscribe', topics]);
      return this.getState();
    },
    async disconnect() {
      this.state = 'disconnected';
      return this.getState();
    },
  };
}

const bridge = fakeBridge();
const server = createStaticServer({
  config: loadConfig({}),
  logger: silentLogger,
  appDir,
  bridge,
  hub: createEventHub(),
});
let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

function post(pathname, body, headers = { 'Content-Type': 'application/json' }) {
  return fetch(base + pathname, { method: 'POST', headers, body: JSON.stringify(body) });
}

test('GET /api/state reports the TCP bridge state', async () => {
  const response = await fetch(base + '/api/state');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.transport, 'tcp');
  assert.equal(typeof body.connected, 'boolean');
});

test('POST /api/broker/connect validates and forwards the request', async () => {
  bridge.state = 'disconnected';
  const response = await post('/api/broker/connect', { host: '127.0.0.1', port: '1884', topics: [{ filter: 'a/#', qos: 0 }] });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.connected, true);
  assert.deepEqual(bridge.calls.at(-1), ['connect', { host: '127.0.0.1', port: '1884', topics: [{ filter: 'a/#', qos: 0 }] }]);
});

test('a broker failure is reported as 502 with the reason', async () => {
  const response = await post('/api/broker/connect', { host: 'fail.local', topics: [{ filter: 'a/#', qos: 0 }] });
  assert.equal(response.status, 502);
  assert.match((await response.json()).error, /connection refused/);
});

test('API requires JSON content type and a JSON object body', async () => {
  const wrongType = await post('/api/broker/connect', {}, { 'Content-Type': 'text/plain' });
  assert.equal(wrongType.status, 415);

  const malformed = await fetch(base + '/api/broker/connect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{oops',
  });
  assert.equal(malformed.status, 400);
});

test('unsupported methods are rejected', async () => {
  const response = await fetch(base + '/api/broker/connect');
  assert.equal(response.status, 405);
});

test('POST /api/broker/subscribe forwards topic filters', async () => {
  const response = await post('/api/broker/subscribe', { topics: [{ filter: 'b/+', qos: 2 }] });
  assert.equal(response.status, 200);
  assert.deepEqual(bridge.calls.at(-1)[1], [{ filter: 'b/+', qos: 2 }]);
});

test('GET /api/stream opens an SSE stream with an initial status frame', async () => {
  const controller = new AbortController();
  const response = await fetch(base + '/api/stream', { signal: controller.signal });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/event-stream/);

  const reader = response.body.getReader();
  const { value } = await reader.read();
  const frame = new TextDecoder().decode(value);
  assert.match(frame, /event: status/);
  assert.match(frame, /"transport":"tcp"/);
  controller.abort();
  await reader.cancel().catch(() => {});
});
