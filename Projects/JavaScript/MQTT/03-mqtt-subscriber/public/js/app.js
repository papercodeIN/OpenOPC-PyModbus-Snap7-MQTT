/** Subscriber UI: live stream, message inspector, TCP connection and topic filters. */

const $ = (id) => document.getElementById(id);

const ui = {
  messages: [],
  selected: null,
  paused: false,
  pending: 0,
  service: { connected: false, received: 0, topics: [] },
  topics: [],
};

/* ── Helpers ──────────────────────────────────────────────── */

function timeOf(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isFinite(date.getTime()) ? date.toLocaleTimeString([], { hour12: false }) : '--:--:--';
}

function humanBytes(count) {
  if (count < 1024) return `${count} B`;
  if (count < 1024 * 1024) return `${(count / 1024).toFixed(1)} KiB`;
  return `${(count / 1024 / 1024).toFixed(2)} MiB`;
}

function decodeBase64(text) {
  const binary = atob(text ?? '');
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return new TextDecoder('utf-8', { fatal: false }).decode(bytes);
}

function payloadMode() {
  return $('cfg-payload-mode').value === 'raw' ? 'raw' : 'json';
}

function prettyPayload(message) {
  if (!message) return '';
  if (payloadMode() === 'json') {
    try {
      return JSON.stringify(JSON.parse(message.text), null, 2);
    } catch {
      /* fall through to the raw text */
    }
  }
  return message.text;
}

function payloadKind(message) {
  if (!message) return '—';
  if (payloadMode() === 'raw') return 'raw';
  try {
    JSON.parse(message.text);
    return 'json';
  } catch {
    return 'text';
  }
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

/* ── Activity log ─────────────────────────────────────────── */

function addEvent(level, message, at = Date.now()) {
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

/* ── Status ───────────────────────────────────────────────── */

function setPill(pill, on, warn, value) {
  pill.classList.toggle('on', on);
  pill.classList.toggle('warn', !on && warn);
  const node = pill.querySelector('.pill-value');
  if (node) node.textContent = value;
}

function renderStatus(service) {
  ui.service = { ...ui.service, ...service };
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
  setPill($('pill-received'), false, false, String(service.received ?? 0));
  setPill($('pill-last'), false, false, service.lastMessageAt ? timeOf(service.lastMessageAt) : '--:--:--');

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

  $('stat-received').textContent = String(service.received ?? 0);
  $('stat-topics').textContent = String((service.topics ?? []).length);
  $('stat-topics-list').textContent = (service.topics ?? []).join(', ').slice(0, 60) || 'No filters';
  $('stat-last').textContent = service.lastMessageAt ? timeOf(service.lastMessageAt) : '--:--:--';
  $('stat-last-topic').textContent = ui.messages[0]?.topic ?? 'Waiting for data';

  $('btn-connect').disabled = hasSession;
  $('btn-disconnect').disabled = !hasSession;
  if (connected && Array.isArray(service.topics)) {
    $('cfg-qos').value = String(service.qos ?? 0);
    ui.topics = service.topics.map((filter) => ({ filter, qos: service.qos ?? 0 }));
    renderTopics();
  }
}

/* ── Counters ─────────────────────────────────────────────── */

/** Update RECEIVED / LAST from a message frame without re-rendering the whole status. */
function updateCounters(received, lastMessageAt) {
  if (Number.isFinite(received)) ui.service.received = received;
  if (lastMessageAt) ui.service.lastMessageAt = lastMessageAt;
  setPill($('pill-received'), false, false, String(ui.service.received ?? 0));
  setPill($('pill-last'), false, false, ui.service.lastMessageAt ? timeOf(ui.service.lastMessageAt) : '--:--:--');
  $('stat-received').textContent = String(ui.service.received ?? 0);
  $('stat-last').textContent = ui.service.lastMessageAt ? timeOf(ui.service.lastMessageAt) : '--:--:--';
  $('stat-last-topic').textContent = ui.messages[0]?.topic ?? 'Waiting for data';
}

/* ── Topics ───────────────────────────────────────────────── */

function renderTopics() {
  const list = $('topic-list');
  list.textContent = '';
  if (ui.topics.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'chip-empty';
    empty.textContent = 'No topic filters yet.';
    list.append(empty);
    return;
  }
  for (const topic of ui.topics) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.append(document.createTextNode(topic.filter));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.title = `Remove ${topic.filter}`;
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      ui.topics = ui.topics.filter((item) => item !== topic);
      renderTopics();
      applyTopics();
    });
    chip.append(remove);
    list.append(chip);
  }
}

function addTopic() {
  const input = $('new-topic');
  const filter = input.value.trim();
  const qos = Number($('cfg-qos').value);
  if (!filter || /\s/.test(filter) || filter.length > 128) {
    toast('Topic filter must be 1–128 characters with no spaces.', 'error');
    return;
  }
  if (ui.topics.some((item) => item.filter === filter)) {
    toast('That filter is already in the list.', 'warn');
    return;
  }
  if (ui.topics.length >= 50) {
    toast('Maximum of 50 topic filters reached.', 'warn');
    return;
  }
  ui.topics.push({ filter, qos });
  input.value = '';
  renderTopics();
  applyTopics();
}

async function applyTopics() {
  if (!ui.service.hasSession) return;
  const qos = Number($('cfg-qos').value);
  try {
    const service = await api('/api/subscribe', {
      topics: ui.topics.map((item) => ({ filter: item.filter, qos })),
      qos,
    });
    renderStatus(service);
    addEvent('info', `Subscriptions updated (${ui.topics.length})`);
  } catch (error) {
    addEvent('error', `Subscription update failed: ${error.message}`);
    toast(error.message, 'error');
  }
}

/* ── Stream ───────────────────────────────────────────────── */

function visibleMessages() {
  const filter = $('stream-filter').value.trim();
  if (!filter) return ui.messages;
  return ui.messages.filter((message) => message.topic.includes(filter));
}

function renderStream() {
  const body = $('stream-rows');
  const rows = visibleMessages();
  body.textContent = '';

  if (rows.length === 0) {
    const row = document.createElement('tr');
    row.className = 'empty-row';
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = ui.messages.length === 0
      ? 'No messages yet — connect to a broker to begin.'
      : 'No messages match the local filter.';
    row.append(cell);
    body.append(row);
  } else {
    for (const message of rows.slice(0, 200)) {
      const row = document.createElement('tr');
      if (ui.selected && ui.selected.key === message.key) row.classList.add('selected');
      row.addEventListener('click', () => selectMessage(message));

      const time = document.createElement('td');
      time.className = 'mono';
      time.textContent = timeOf(message.at);

      const topic = document.createElement('td');
      topic.className = 'topic-cell';
      topic.textContent = message.topic;

      const qos = document.createElement('td');
      qos.className = 'mono';
      qos.textContent = String(message.qos);

      const size = document.createElement('td');
      size.className = 'size-cell';
      size.textContent = humanBytes(message.bytes);

      const payload = document.createElement('td');
      payload.className = 'payload-cell';
      payload.textContent = message.text.replace(/\s+/g, ' ').slice(0, 160);

      row.append(time, topic, qos, size, payload);
      body.append(row);
    }
  }

  $('stream-count').textContent = `${ui.messages.length} message${ui.messages.length === 1 ? '' : 's'}`;
  $('stream-foot').textContent = `${rows.length} shown / ${ui.messages.length} stored`;
  $('stream-state').textContent = ui.paused ? `paused${ui.pending ? ` · ${ui.pending} new` : ''}` : 'live';
}

function selectMessage(message) {
  ui.selected = message;
  $('ins-topic').textContent = message.topic;
  $('ins-time').textContent = new Date(message.at).toLocaleString();
  $('ins-qos').textContent = String(message.qos);
  $('ins-size').textContent = humanBytes(message.bytes);
  $('ins-format').textContent = payloadKind(message);
  const payload = $('inspector-payload');
  payload.textContent = prettyPayload(message);
  payload.parentElement.classList.remove('empty');
  renderStream();
}

function addMessage(message) {
  const entry = { ...message, key: `${message.at}-${message.topic}-${Math.random().toString(16).slice(2, 8)}` };
  ui.messages.unshift(entry);
  if (ui.messages.length > 200) ui.messages.pop();
  if (ui.paused) {
    ui.pending += 1;
    renderStream();
    return;
  }
  renderStream();
  if (!ui.selected) selectMessage(entry);
}

/* ── Rate ─────────────────────────────────────────────────── */

function computeRate() {
  const cutoff = Date.now() - 60000;
  return ui.messages.filter((message) => message.at >= cutoff).length;
}

/* ── Actions ──────────────────────────────────────────────── */

async function connect() {
  const qos = Number($('cfg-qos').value);
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
    topics: ui.topics.map((item) => ({ filter: item.filter, qos })),
    qos,
    jsonParsing: payloadMode() === 'json',
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

function showErrors(errors) {
  const box = $('config-error');
  box.textContent = errors.join('\n');
  box.classList.toggle('visible', errors.length > 0);
}

/* ── Live events ──────────────────────────────────────────── */

function subscribe() {
  if (!('EventSource' in window)) {
    addEvent('warn', 'Live updates are unavailable — reload the page to refresh state.');
    return;
  }
  const source = new EventSource('/api/events');
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
  source.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (!data.message) return;
      addMessage({ ...data.message, text: data.message.text ?? decodeBase64(data.message.payloadBase64) });
      updateCounters(data.received, data.message.at);
    } catch {
      /* ignore malformed message frames */
    }
  });
  source.onerror = () => setPill($('pill-broker'), false, true, 'STREAM LOST');
}

/* ── Boot ─────────────────────────────────────────────────── */

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => activateTab(item.dataset.tab));
});

$('btn-connect').addEventListener('click', connect);
$('btn-disconnect').addEventListener('click', disconnect);
$('btn-add-topic').addEventListener('click', addTopic);
$('new-topic').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTopic();
});
$('cfg-qos').addEventListener('change', applyTopics);
$('stream-filter').addEventListener('input', renderStream);
$('cfg-payload-mode').addEventListener('change', () => {
  if (ui.selected) selectMessage(ui.selected);
});
$('btn-pause').addEventListener('click', () => {
  ui.paused = !ui.paused;
  $('btn-pause').textContent = ui.paused ? 'Resume' : 'Pause';
  if (!ui.paused) {
    ui.pending = 0;
    renderStream();
  } else {
    renderStream();
  }
});
$('btn-clear').addEventListener('click', () => {
  ui.messages = [];
  ui.selected = null;
  ui.pending = 0;
  $('inspector-payload').textContent = 'Select a message in the stream to inspect its payload.';
  $('inspector-payload').parentElement.classList.add('empty');
  $('ins-topic').textContent = '—';
  $('ins-time').textContent = '—';
  $('ins-qos').textContent = '—';
  $('ins-size').textContent = '—';
  $('ins-format').textContent = '—';
  renderStream();
});
$('btn-copy').addEventListener('click', async () => {
  if (!ui.selected) return;
  try {
    await navigator.clipboard.writeText(ui.selected.text);
    toast('Payload copied to the clipboard.', 'success');
  } catch (error) {
    toast(`Copy failed: ${error.message}`, 'error');
  }
});
$('btn-clear-activity').addEventListener('click', () => {
  $('event-log').textContent = '';
  $('event-log-full').textContent = '';
  addEvent('info', 'Activity cleared');
});

$('inspector-payload').parentElement.classList.add('empty');
setClock();
setInterval(setClock, 1000);
setInterval(() => {
  $('stat-rate').textContent = String(computeRate());
  const suffix = document.createElement('span');
  suffix.style.fontSize = '14px';
  suffix.textContent = '/min';
  $('stat-rate').append(suffix);
}, 1000);
renderStream();
addEvent('info', 'Subscriber service ready.');

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
    $('cfg-payload-mode').value = defaults.jsonParsing === false ? 'raw' : 'json';
    $('cfg-qos').value = String(defaults.qos ?? 0);
    ui.topics = Array.isArray(defaults.topics) ? defaults.topics.map((filter) => ({ filter, qos: defaults.qos ?? 0 })) : [];
    renderTopics();
  } catch (error) {
    addEvent('warn', `Could not load defaults: ${error.message}`);
  }

  try {
    const [service, history] = await Promise.all([api('/api/state'), api('/api/history')]);
    renderStatus(service);
    for (const entry of history.logs ?? []) addEvent(entry.level, entry.message, entry.at);
    for (const message of (history.messages ?? []).slice().reverse()) {
      addMessage({ ...message, text: message.text ?? decodeBase64(message.payloadBase64) });
    }
    updateCounters(service.received, service.lastMessageAt);
  } catch (error) {
    addEvent('warn', `Could not load service state: ${error.message}`);
  }

  subscribe();
}

boot();
