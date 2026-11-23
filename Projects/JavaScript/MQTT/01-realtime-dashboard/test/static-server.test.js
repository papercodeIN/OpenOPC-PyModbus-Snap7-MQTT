import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from '../src/config.js';
import { createStaticServer } from '../src/static-server.js';

const appDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };
const server = createStaticServer({ config: loadConfig({}), logger: silentLogger, appDir });
let base;

before(async () => {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET / serves the dashboard HTML', async () => {
  const response = await fetch(base + '/');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  assert.match(await response.text(), /Real-Time Dashboard/);
});

test('the broker form exposes the shared connection fields and payload switch', async () => {
  const html = await (await fetch(base + '/')).text();
  for (const label of ['Broker host', 'Broker port', 'Client ID', 'Keep alive (s)', 'Connect timeout (ms)', 'Reconnect period (ms)', 'Payload handling']) {
    assert.ok(html.includes(label), `missing field: ${label}`);
  }
  assert.ok(html.includes('id="cfg-payload-mode"'));
});

test('GET /config serves browser-safe defaults only', async () => {
  const response = await fetch(base + '/config');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.brokerWsUrl, 'ws://127.0.0.1:9001/mqtt');
  assert.equal(body.password, undefined);
  assert.equal(body.username, undefined);
});

test('GET /vendor/mqtt.min.js serves the pinned MQTT browser bundle', async () => {
  const response = await fetch(base + '/vendor/mqtt.min.js');
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /javascript/);
  assert.ok((await response.text()).length > 100000);
});

test('GET /css/theme.css, /css/dashboard.css and /js/app.js serve static assets', async () => {
  for (const asset of ['/css/theme.css', '/css/dashboard.css', '/js/app.js']) {
    const response = await fetch(base + asset);
    assert.equal(response.status, 200, asset);
  }
});

test('non-GET methods are rejected with 405', async () => {
  const response = await fetch(base + '/', { method: 'POST' });
  assert.equal(response.status, 405);
  assert.match(response.headers.get('allow'), /GET/);
});

test('missing files return 404 without directory access', async () => {
  const response = await fetch(base + '/does-not-exist.js');
  assert.equal(response.status, 404);
  const parent = await fetch(base + '/package.json');
  assert.equal(parent.status, 404);
});

test('encoded path traversal is blocked', async () => {
  const response = await fetch(base + '/%2e%2e/%2e%2e/package.json');
  assert.ok([403, 404].includes(response.status), `unexpected status ${response.status}`);
  const text = await response.text();
  assert.equal(text.includes('"name": "mqtt-realtime-dashboard"'), false);
});

test('GET /healthz reports service health', async () => {
  const response = await fetch(base + '/healthz');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.status, 'ok');
  assert.equal(body.service, 'mqtt-realtime-dashboard');
});

test('every response carries a Content-Security-Policy that blocks inline scripts', async () => {
  const response = await fetch(base + '/');
  const csp = response.headers.get('content-security-policy') ?? '';
  assert.match(csp, /script-src 'self'/);
  assert.match(csp, /default-src 'none'/);
  assert.equal(csp.includes("script-src 'unsafe-inline'"), false);
});

test('HEAD / returns headers with no body', async () => {
  const response = await fetch(base + '/', { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});
