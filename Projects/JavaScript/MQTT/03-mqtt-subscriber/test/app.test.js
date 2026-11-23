import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from '../src/config.js';
import { createApp } from '../src/app.js';
import { ServiceError } from '../src/service.js';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function fakeService() {
  const listeners = new Set();
  const state = { connected: false, status: 'disconnected', hasSession: false, transport: 'tcp', broker: null, topics: [], received: 0, lastMessageAt: null };
  return {
    on(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    emit(event) {
      for (const listener of listeners) listener(event);
    },
    state() {
      return { ...state };
    },
    async connect(input) {
      if (input.host === 'bad.local') throw new ServiceError(502, 'Connection failed: connection refused');
      state.connected = true;
      state.broker = { url: `mqtt://${input.host}:${input.port}`, host: input.host, port: input.port, tls: false };
      state.topics = (input.topics ?? []).map((item) => item.filter);
      return this.state();
    },
    async disconnect() {
      state.connected = false;
      state.broker = null;
      state.topics = [];
      return this.state();
    },
    async updateSubscriptions(input) {
      if (!state.connected) throw new ServiceError(409, 'Not connected to a broker.');
      const filters = (input.topics ?? []).map((item) => item.filter);
      if (filters.includes('bad')) throw new ServiceError(400, 'Invalid topic filter "bad"');
      state.topics = filters;
      return this.state();
    },
  };
}

const service = fakeService();
const config = loadConfig({});
const app = createApp({ service, config, appDir, logger: silentLogger });
const server = http.createServer(app);
let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

const post = (pathname, body, headers = { 'Content-Type': 'application/json' }) =>
  fetch(base + pathname, { method: 'POST', headers, body: JSON.stringify(body) });

test('GET / serves the subscriber UI', async () => {
  const response = await fetch(base + '/');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Incoming Messages/);
});

test('the broker form exposes the shared connection fields and payload switch', async () => {
  const html = await (await fetch(base + '/')).text();
  for (const label of ['Broker host', 'Broker port', 'Client ID', 'Keep alive (s)', 'Connect timeout (ms)', 'Reconnect period (ms)', 'Payload handling']) {
    assert.ok(html.includes(label), `missing field: ${label}`);
  }
  assert.ok(html.includes('id="cfg-payload-mode"'));
});

test('GET /api/config exposes safe defaults', async () => {
  const response = await fetch(base + '/api/config');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.httpPort, 8082);
  assert.ok(Array.isArray(body.defaults.topics));
  assert.equal(body.defaults.password, undefined);
});

test('POST /api/connect and /api/subscribe update the topic list', async () => {
  const connected = await post('/api/connect', { host: '127.0.0.1', port: 1883, topics: [{ filter: 'a/#', qos: 0 }] });
  assert.equal(connected.status, 200);
  assert.equal((await connected.json()).connected, true);

  const updated = await post('/api/subscribe', { topics: [{ filter: 'b/#', qos: 1 }] });
  assert.equal(updated.status, 200);
  assert.deepEqual((await updated.json()).topics, ['b/#']);
});

test('service errors keep their status codes', async () => {
  const invalid = await post('/api/subscribe', { topics: [{ filter: 'bad', qos: 0 }] });
  assert.equal(invalid.status, 400);

  const failure = await post('/api/connect', { host: 'bad.local', port: 1883, topics: [{ filter: 'a/#', qos: 0 }] });
  assert.equal(failure.status, 502);
});

test('broadcast messages land in /api/history for page reloads', async () => {
  service.emit({
    kind: 'message',
    message: { topic: 'a/b', qos: 0, at: 1, bytes: 2, payloadBase64: 'eHk=', text: 'xy' },
  });
  const response = await fetch(base + '/api/history');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.messages[0].topic, 'a/b');
  assert.equal(body.messages[0].text, 'xy');
});

test('API rejects wrong content types, unknown routes and bad methods', async () => {
  assert.equal((await post('/api/connect', {}, { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await post('/api/nope', {})).status, 404);
  assert.equal((await fetch(base + '/api/state', { method: 'DELETE' })).status, 405);
});

test('GET /api/events streams an initial state frame', async () => {
  const controller = new AbortController();
  const response = await fetch(base + '/api/events', { signal: controller.signal });
  const reader = response.body.getReader();
  const { value } = await reader.read();
  assert.match(new TextDecoder().decode(value), /event: state/);
  controller.abort();
  await reader.cancel().catch(() => {});
});

test('GET /healthz reports broker connectivity', async () => {
  const response = await fetch(base + '/healthz');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.service, 'mqtt-subscriber');
  assert.equal(typeof body.broker.connected, 'boolean');
  assert.equal(typeof body.broker.topics, 'number');
});

test('a foreign Host header is rejected on a loopback-only service', async () => {
  const status = await new Promise((resolve, reject) => {
    const request = http.request(
      { host: '127.0.0.1', port: server.address().port, path: '/api/state', headers: { Host: 'evil.example' } },
      (response) => {
        response.resume();
        resolve(response.statusCode);
      },
    );
    request.on('error', reject);
    request.end();
  });
  assert.equal(status, 403);
});
