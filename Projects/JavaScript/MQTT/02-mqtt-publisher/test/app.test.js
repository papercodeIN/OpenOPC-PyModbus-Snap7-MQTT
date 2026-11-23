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
  const state = { connected: false, status: 'disconnected', hasSession: false, transport: 'tcp', broker: null, published: 0, failed: 0, job: null };
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
      return this.state();
    },
    async publish(input) {
      if (input.topic === 'bad') throw new ServiceError(400, 'Invalid MQTT_TOPIC');
      return { topic: input.topic, qos: 0, retain: false, bytes: 3, at: 1 };
    },
    startBurst() {
      state.job = { running: true, sent: 0, total: 5 };
      return this.state();
    },
    stopBurst() {
      return this.state();
    },
    async disconnect() {
      state.connected = false;
      state.broker = null;
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

test('GET / serves the publisher UI', async () => {
  const response = await fetch(base + '/');
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Message Composer/);
  assert.match(html, /v2\.0\.0/);
});

test('the broker form exposes the shared connection fields and payload switch', async () => {
  const html = await (await fetch(base + '/')).text();
  for (const label of ['Broker host', 'Broker port', 'Client ID', 'Keep alive (s)', 'Connect timeout (ms)', 'Reconnect period (ms)', 'Payload handling']) {
    assert.ok(html.includes(label), `missing field: ${label}`);
  }
});

test('GET /api/config exposes safe defaults only', async () => {
  const response = await fetch(base + '/api/config');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.httpPort, 8081);
  assert.equal(body.defaults.host, '127.0.0.1');
  assert.equal(body.defaults.password, undefined);
  assert.equal(body.defaults.username, undefined);
});

test('POST /api/publish forwards a validated message', async () => {
  const response = await post('/api/publish', { topic: 'sensors/a', payload: '1', format: 'text', qos: 0 });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).topic, 'sensors/a');
});

test('service validation errors keep their status code', async () => {
  const conflict = await post('/api/publish', { topic: 'bad', payload: '1', format: 'text', qos: 0 });
  assert.equal(conflict.status, 400);

  const failure = await post('/api/connect', { host: 'bad.local', port: 1883 });
  assert.equal(failure.status, 502);
  assert.match((await failure.json()).error, /connection refused/);
});

test('POST /api/connect and /api/disconnect update state', async () => {
  const connected = await post('/api/connect', { host: '127.0.0.1', port: 1883 });
  assert.equal(connected.status, 200);
  assert.equal((await connected.json()).connected, true);

  const disconnected = await post('/api/disconnect', {});
  assert.equal(disconnected.status, 200);
  assert.equal((await disconnected.json()).connected, false);
});

test('POST /api/burst returns 202 with the job state', async () => {
  const response = await post('/api/burst', { topic: 'a/b', payload: 'x', format: 'text', qos: 0, count: 5 });
  assert.equal(response.status, 202);
  assert.equal((await response.json()).job.running, true);
});

test('API rejects wrong content types and unknown routes', async () => {
  const wrongType = await post('/api/publish', {}, { 'Content-Type': 'text/plain' });
  assert.equal(wrongType.status, 415);

  const unknown = await post('/api/nope', {});
  assert.equal(unknown.status, 404);

  const method = await fetch(base + '/api/publish');
  assert.equal(method.status, 405);
});

test('GET /api/events streams an initial state frame', async () => {
  const controller = new AbortController();
  const response = await fetch(base + '/api/events', { signal: controller.signal });
  assert.equal(response.status, 200);
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
  assert.equal(body.service, 'mqtt-publisher');
  assert.equal(typeof body.broker.connected, 'boolean');
  assert.match(response.headers.get('content-security-policy'), /default-src 'none'/);
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
