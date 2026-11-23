/** Publisher UI: composer, TCP connection, burst control and live service events. */

const $ = (id) => document.getElementById(id);

const ui = {
  status: { connected: false },
  logs: [],
  sent: [],
  stream: null,
};

/* ── Small helpers ─────────────────────────────────────────── */

function timeOf(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isFinite(date.getTime()) ? date.toLocaleTimeString([], { hour12: false }) : '--:--:--';
}

function bytesOf(text) {
  return new TextEncoder().encode(String(text)).length;
}

function humanBytes(count) {
  if (count < 1024) return `${count} B`;
  if (count < 1024 * 1024) return `${(count / 1024).toFixed(1)} KiB`;
  return `${(count / 1024 / 1024).toFixed(2)} MiB`;
}

function toast(message, kind = 'info') {
  const node = document.createElement('div');
  node.className = `toast ${kind}`;
  node.textContent = message;
  $('toast-stack').append(node);
  setTimeout(() => node.remove(), 4200);
}

function setClock() {
  const now = new Date();
  $('clock-time').textContent = now.toLocaleTimeString([], { hour12: false });
  $('clock-date').textContent = now.toLocaleDateString([], { year: 'numeric', month: 'short', day: '2-digit' });
}

function activateTab(name) {
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `tab-${name}`));
}

async function api(path, body) {
  const options = body === undefined
    ? { method: 'GET' }
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) };
  const response = await fetch(path, options);
  let payload = {};
  try {
    payload = await response.json();
  } catch {
    /* empty body */
  }
  if (!response.ok) throw new Error(payload.error ?? `HTTP ${response.status}`);
  return payload;
}

/* ── Logging to the two event panels ──────────────────────── */

function addEvent(level, message, at = Date.now()) {
  ui.logs.push({ level, message, at });
  if (ui.logs.length > 300) ui.logs.shift();
  for (const target of ['event-log', 'event-log-full']) {
    const log = $(target);
    if (!log) continue;
    const item = document.createElement('div');
    item.className = `event-item ${level}`;
    const time = document.createElement('span');
    time.className = 'event-time';
    time.textContent = timeOf(at);
    const text = document.createElement('span');
    text.className = 'event-msg';
    text.textContent = message;
    item.append(time, text);
    log.append(item);
    while (log.children.length > 300) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  }
}

/* ── Rendering ────────────────────────────────────────────── */

function setPill(pill, on, warn, value) {
  pill.classList.toggle('on', on);
  pill.classList.toggle('warn', !on && warn);
  const node = pill.querySelector('.pill-value');
  if (node) node.textContent = value;
}

function renderStatus(service) {
  ui.status = service;
  const status = service.status ?? (service.connected ? 'connected' : 'disconnected');
  const labels = {
    connected: 'CONNECTED',
    connecting: 'RECONNECTING',
    offline: 'OFFLINE',
    closed: 'DISCONNECTED',
    disconnected: 'DISCONNECTED',
  };
  const connected = status === 'connected';
  const warn = !connected && (status === 'connecting' || status === 'offline');
  const label = labels[status] ?? 'DISCONNECTED';
  const hasSession = Boolean(service.hasSession ?? service.connected);

  setPill($('pill-broker'), connected, warn, label);
  setPill($('pill-sent'), false, false, String(service.published ?? 0));
  setPill($('pill-last'), false, false, service.lastPublishAt ? timeOf(service.lastPublishAt) : '--:--:--');

  for (const id of ['conn-state', 'conn-state-2']) {
    const chip = $(id);
    chip.className = `state-chip${connected ? ' online' : ''}${warn ? ' alert' : ''}`;
    chip.textContent = '';
    const led = document.createElement('span');
    led.className = 'led';
    chip.append(led, document.createTextNode(` ${label}`));
  }

  const link = $('nav-link');
  link.className = `badge ${connected ? 'badge-on' : 'badge-off'}`;
  link.textContent = connected ? 'TCP LIVE' : hasSession ? 'TCP RETRY' : 'TCP OFF';

  $('stat-published').textContent = String(service.published ?? 0);
  $('stat-failed').textContent = String(service.failed ?? 0);
  $('stat-broker').textContent = label;
  $('stat-broker-url').textContent = service.broker ? service.broker.url : 'No TCP connection';
  $('stat-last').textContent = service.lastPublishAt ? timeOf(service.lastPublishAt) : '--:--:--';
  $('stat-last-topic').textContent = service.lastPublishAt ? (ui.sent[0]?.topic ?? 'sent') : 'Nothing sent yet';

  $('btn-connect').disabled = hasSession;
  $('btn-connect-2').disabled = hasSession;
  $('btn-disconnect').disabled = !hasSession;
  // Publishing while reconnecting is allowed: mqtt.js queues it and the service times out.
  $('btn-publish').disabled = !hasSession;
  const burstRunning = Boolean(service.job?.running);
  $('btn-burst').disabled = !connected || burstRunning;
  $('btn-burst-stop').disabled = !burstRunning;

  renderBurst(service.job);
}

function renderBurst(job) {
  const fill = $('burst-fill');
  if (!job) {
    fill.style.width = '0%';
    fill.classList.remove('done');
    $('burst-count').textContent = 'idle';
    return;
  }
  const percent = job.total > 0 ? Math.min(100, Math.round((job.sent / job.total) * 100)) : 0;
  fill.style.width = `${percent}%`;
  fill.classList.toggle('done', !job.running);
  $('burst-count').textContent = job.running ? `${job.sent}/${job.total} running` : `${job.sent}/${job.total} finished`;
}

function sentRow(record, index) {
  const row = document.createElement('tr');
  const cells = [
    String(ui.sent.length - index),
    timeOf(record.at),
    record.topic,
    String(record.qos),
    record.retain ? 'yes' : 'no',
    humanBytes(record.bytes),
  ];
  cells.forEach((value, cellIndex) => {
    const cell = document.createElement('td');
    cell.textContent = value;
    if (cellIndex === 0) cell.className = 'num-cell';
    if (cellIndex === 2) cell.className = 'topic-cell';
    if (cellIndex === 4) cell.className = record.retain ? 'retain-on' : 'retain-off';
    if (cellIndex === 5) cell.className = 'bytes-cell';
    row.append(cell);
  });
  return row;
}

function renderSent() {
  const body = $('sent-rows');
  body.textContent = '';
  if (ui.sent.length === 0) {
    const row = document.createElement('tr');
    row.className = 'empty-row';
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No messages sent in this session.';
    row.append(cell);
    body.append(row);
  } else {
    ui.sent.slice(0, 100).forEach((record, index) => body.append(sentRow(record, index)));
  }
  $('sent-count').textContent = `${ui.sent.length} message${ui.sent.length === 1 ? '' : 's'}`;
  $('stat-last-topic').textContent = ui.sent[0]?.topic ?? (ui.status.lastPublishAt ? 'sent' : 'Nothing sent yet');
}

/* ── Composer validation ──────────────────────────────────── */

function readComposer() {
  return {
    topic: $('pub-topic').value.trim(),
    qos: Number($('pub-qos').value),
    retain: $('pub-retain').checked,
    format: $('pub-format').value === 'raw' ? 'text' : 'json',
    payload: $('pub-payload').value,
  };
}

function validateComposer(message) {
  const errors = [];
  if (!message.topic) errors.push('Topic must not be empty.');
  if (/\s/.test(message.topic) || message.topic.length > 128 || message.topic.includes('#') || message.topic.includes('+')) {
    errors.push('Topic must be 1–128 characters, contain no spaces and no # or + wildcards.');
  }
  if (![0, 1, 2].includes(message.qos)) errors.push('QoS must be 0, 1 or 2.');
  const size = bytesOf(message.payload);
  if (size === 0) errors.push('Payload must not be empty.');
  if (size > 65536) errors.push('Payload must be at most 64 KiB.');
  if (message.format === 'json') {
    try {
      JSON.parse(message.payload);
    } catch (error) {
      errors.push(`Payload is not valid JSON: ${error.message}`);
    }
  }
  return errors;
}

function updatePayloadMeta() {
  const message = readComposer();
  const size = bytesOf(message.payload);
  $('payload-size').textContent = humanBytes(size);
  const badge = $('payload-badge');
  const validity = $('payload-validity');
  badge.textContent = message.format === 'json' ? 'JSON' : 'RAW';
  if (message.format !== 'json') {
    validity.className = 'ok';
    validity.textContent = 'Raw payload — sent exactly as typed';
    return;
  }
  try {
    JSON.parse(message.payload);
    validity.className = 'ok';
    validity.textContent = 'Valid JSON';
  } catch (error) {
    validity.className = 'error';
    validity.textContent = `Invalid JSON — ${error.message}`;
  }
}

function showErrors(errors) {
  const box = $('config-error');
  box.textContent = errors.join('\n');
  box.classList.toggle('visible', errors.length > 0);
}

/* ── Actions ──────────────────────────────────────────────── */

async function connect() {
  const body = {
    host: $('cfg-host').value.trim(),
    port: Number($('cfg-port').value),
    tls: $('cfg-tls').checked,
    clientId: $('cfg-client-id').value.trim(),
    username: $('cfg-username').value,
    password: $('cfg-password').value,
    keepalive: Number($('cfg-keepalive').value),
    connectTimeout: Number($('cfg-timeout').value),
    reconnectPeriod: Number($('cfg-reconnect').value),
  };
  showErrors([]);
  try {
    const service = await api('/api/connect', body);
    renderStatus(service);
    addEvent('success', `Connected to ${service.broker?.url ?? 'broker'}`);
    toast('Connected to the broker over TCP.', 'success');
  } catch (error) {
    showErrors([error.message]);
    addEvent('error', `Connect failed: ${error.message}`);
    toast(error.message, 'error');
    activateTab('connection');
  }
}

async function disconnect() {
  try {
    const service = await api('/api/disconnect', {});
    renderStatus(service);
    addEvent('info', 'Disconnected from broker');
    toast('Disconnected.', 'warn');
  } catch (error) {
    toast(error.message, 'error');
  }
}

async function publishOnce() {
  const message = readComposer();
  const errors = validateComposer(message);
  if (errors.length) {
    showErrors(errors);
    toast('Fix the highlighted message fields first.', 'error');
    return;
  }
  showErrors([]);
  $('btn-publish').disabled = true;
  try {
    const record = await api('/api/publish', message);
    // The SSE stream normally records the publish first; only add it if it is missing.
    if (!ui.sent.some((item) => item.at === record.at && item.topic === record.topic)) {
      ui.sent.unshift(record);
      renderSent();
    }
    addEvent('published', `Published ${humanBytes(record.bytes)} to ${record.topic} (QoS ${record.qos}${record.retain ? ', retained' : ''})`);
    toast('Message published.', 'success');
  } catch (error) {
    addEvent('error', `Publish failed: ${error.message}`);
    toast(error.message, 'error');
  } finally {
    $('btn-publish').disabled = !ui.status.hasSession && !ui.status.connected;
  }
}

async function startBurst() {
  const message = readComposer();
  const errors = validateComposer(message);
  const count = Number($('burst-count').value);
  const intervalMs = Number($('burst-interval').value);
  if (!Number.isInteger(count) || count < 1 || count > 100) errors.push('Burst count must be between 1 and 100.');
  if (!Number.isInteger(intervalMs) || intervalMs < 1000 || intervalMs > 60000) {
    errors.push('Burst interval must be between 1000 and 60000 ms.');
  }
  if (errors.length) {
    showErrors(errors);
    toast('Fix the highlighted fields first.', 'error');
    return;
  }
  showErrors([]);
  try {
    const service = await api('/api/burst', { ...message, count, intervalMs });
    renderStatus(service);
    addEvent('info', `Burst started: ${count} messages every ${intervalMs} ms`);
  } catch (error) {
    addEvent('error', `Burst failed: ${error.message}`);
    toast(error.message, 'error');
  }
}

async function stopBurst() {
  try {
    const service = await api('/api/burst/stop', {});
    renderStatus(service);
  } catch (error) {
    toast(error.message, 'error');
  }
}

/* ── Live events ──────────────────────────────────────────── */

function subscribe() {
  if (!('EventSource' in window)) {
    addEvent('warn', 'Live updates are unavailable — reload the page to refresh state.');
    return;
  }
  const source = new EventSource('/api/events');
  ui.stream = source;

  source.addEventListener('state', (event) => {
    try {
      const data = JSON.parse(event.data);
      // The first frame is a bare state object; later frames wrap it as { kind, state }.
      renderStatus(data.state ?? data);
    } catch {
      /* ignore malformed state */
    }
  });
  source.addEventListener('log', (event) => {
    try {
      const data = JSON.parse(event.data);
      addEvent(data.level ?? 'info', data.message ?? '', data.at);
    } catch {
      /* ignore malformed log frames */
    }
  });
  source.addEventListener('published', (event) => {
    try {
      const data = JSON.parse(event.data);
      ui.sent.unshift(data.record);
      if (ui.sent.length > 100) ui.sent.pop();
      renderSent();
    } catch {
      /* ignore malformed publish frames */
    }
  });
  source.onerror = () => {
    setPill($('pill-broker'), false, true, 'STREAM LOST');
  };
}

/* ── Boot ─────────────────────────────────────────────────── */

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => activateTab(item.dataset.tab));
});

$('btn-connect').addEventListener('click', connect);
$('btn-connect-2').addEventListener('click', connect);
$('btn-disconnect').addEventListener('click', disconnect);
$('btn-publish').addEventListener('click', publishOnce);
$('btn-burst').addEventListener('click', startBurst);
$('btn-burst-stop').addEventListener('click', stopBurst);
$('btn-clear-log').addEventListener('click', () => {
  $('event-log').textContent = '';
  ui.logs = [];
});
$('btn-clear-activity').addEventListener('click', () => {
  $('event-log-full').textContent = '';
  $('event-log').textContent = '';
  ui.logs = [];
  addEvent('info', 'Activity cleared');
});
$('pub-payload').addEventListener('input', updatePayloadMeta);

/** The Connection page and the Composer are two views of the same publish defaults. */
function syncPublishDefaults(source) {
  const qos = source === 'cfg-qos' ? $('cfg-qos').value : $('pub-qos').value;
  const format = source === 'cfg-payload-mode' ? $('cfg-payload-mode').value : $('pub-format').value;
  $('cfg-qos').value = qos;
  $('pub-qos').value = qos;
  $('cfg-payload-mode').value = format;
  $('pub-format').value = format;
  $('about-qos').textContent = qos;
  $('about-format').textContent = format === 'json' ? 'JSON' : 'Raw';
  updatePayloadMeta();
}

$('cfg-qos').addEventListener('change', () => syncPublishDefaults('cfg-qos'));
$('pub-qos').addEventListener('change', () => syncPublishDefaults('pub-qos'));
$('cfg-payload-mode').addEventListener('change', () => syncPublishDefaults('cfg-payload-mode'));
$('pub-format').addEventListener('change', () => syncPublishDefaults('pub-format'));

setClock();
setInterval(setClock, 1000);
renderStatus({ connected: false, published: 0, failed: 0 });
renderSent();
addEvent('info', 'Publisher service ready.');

async function boot() {
  try {
    const config = await api('/api/config');
    $('nav-port').textContent = `:${config.httpPort}`;
    const defaults = config.defaults ?? {};
    $('cfg-host').value = defaults.host ?? '127.0.0.1';
    $('cfg-port').value = defaults.port ?? 1883;
    $('cfg-tls').checked = Boolean(defaults.useTls);
    $('cfg-keepalive').value = defaults.keepalive ?? 60;
    $('cfg-timeout').value = defaults.connectTimeout ?? 15000;
    $('cfg-reconnect').value = defaults.reconnectPeriod ?? 5000;
    $('cfg-client-id').value = defaults.clientId ?? '';
    $('cfg-qos').value = String(defaults.qos ?? 0);
    $('cfg-payload-mode').value = defaults.payloadFormat === 'json' ? 'json' : 'raw';
    $('pub-topic').value = defaults.topic ?? 'demo/publisher';
    $('pub-qos').value = String(defaults.qos ?? 0);
    $('pub-retain').checked = Boolean(defaults.retain);
    $('pub-format').value = defaults.payloadFormat === 'json' ? 'json' : 'raw';
    $('pub-payload').value = defaults.payload ?? '';
    $('about-topic').textContent = defaults.topic ?? '—';
    $('about-qos').textContent = String(defaults.qos ?? 0);
    $('about-retain').textContent = defaults.retain ? 'true' : 'false';
    $('about-format').textContent = defaults.payloadFormat === 'json' ? 'JSON' : 'Raw';
    updatePayloadMeta();
  } catch (error) {
    addEvent('warn', `Could not load defaults: ${error.message}`);
  }

  try {
    const [service, history] = await Promise.all([api('/api/state'), api('/api/history')]);
    renderStatus(service);
    for (const entry of history.logs ?? []) addEvent(entry.level, entry.message, entry.at);
    ui.sent = history.published ?? [];
    renderSent();
  } catch (error) {
    addEvent('warn', `Could not load service state: ${error.message}`);
  }

  subscribe();
}

boot();
