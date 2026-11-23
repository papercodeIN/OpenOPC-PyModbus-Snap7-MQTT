/** Application wiring: configuration UI, MQTT lifecycle, rendering and local demo mode. */

import {
  defaultConfig,
  normalizeConfig,
  mergeDefaults,
  assertValidConfig,
  isValidTopicFilter,
  saveConfig,
  loadSavedConfig,
} from './config.js';
import { MqttDashboardClient } from './mqtt-client.js';
import { ServerMqttClient } from './server-client.js';
import { parsePayload } from './payload.js';
import { MessageStore } from './store.js';
import { createChart } from './charts.js';
import { createUI } from './ui.js';

const $ = (id) => document.getElementById(id);
const ui = createUI();
const chart = createChart($('signal-chart'));

let serverDefaults = defaultConfig();
let config = defaultConfig();
let topics = [];
let client = null;
let selectedMetric = '';
let demoTimer = null;
let refreshQueued = false;

const store = new MessageStore({
  maxMessages: config.maxMessages,
  maxHistoryPoints: config.maxHistoryPoints,
});

function applyToForm(cfg) {
  config = cfg;
  $('cfg-transport').value = cfg.transport;
  $('cfg-host').value = cfg.brokerHost;
  $('cfg-port').value = cfg.brokerPort;
  $('cfg-tls').checked = cfg.useTls;
  $('cfg-ws-url').value = cfg.brokerWsUrl;
  $('cfg-client-id').value = cfg.clientId;
  $('cfg-username').value = cfg.username;
  $('cfg-password').value = '';
  $('cfg-keepalive').value = cfg.keepalive;
  $('cfg-reconnect').value = cfg.reconnectPeriod;
  $('cfg-timeout').value = cfg.connectTimeout;
  $('cfg-qos').value = String(cfg.qos);
  $('cfg-payload-mode').value = cfg.jsonParsing ? 'json' : 'raw';
  syncTransportFields();
  topics = cfg.topics.map((item) => ({ ...item }));
  renderTopics();
  ui.setConfigError([]);
  $('about-buffer').textContent = `${cfg.maxMessages} messages / ${cfg.maxHistoryPoints} points`;
  $('about-transport').textContent =
    cfg.transport === 'tcp'
      ? `MQTT 3.1.1 over TCP (${cfg.useTls ? 'mqtts' : 'mqtt'}://${cfg.brokerHost}:${cfg.brokerPort}) via this server`
      : `MQTT 3.1.1 over WebSockets (${cfg.brokerWsUrl}) from the browser`;
  ui.setStatus({ state: 'disconnected', detail: '', transport: cfg.transport });
}

/** Show only the fields that belong to the selected transport. */
function syncTransportFields() {
  const tcp = $('cfg-transport').value === 'tcp';
  $('tcp-fields').hidden = !tcp;
  $('ws-fields').hidden = tcp;
  $('tls-note').hidden = !tcp;
}

function readFormConfig() {
  return normalizeConfig({
    ...config,
    transport: $('cfg-transport').value,
    brokerHost: $('cfg-host').value,
    brokerPort: Number($('cfg-port').value),
    useTls: $('cfg-tls').checked,
    brokerWsUrl: $('cfg-ws-url').value,
    clientId: $('cfg-client-id').value,
    username: $('cfg-username').value,
    password: $('cfg-password').value,
    keepalive: Number($('cfg-keepalive').value),
    reconnectPeriod: Number($('cfg-reconnect').value),
    connectTimeout: Number($('cfg-timeout').value),
    qos: Number($('cfg-qos').value),
    topics: topics.map((item) => ({ ...item })),
    jsonParsing: $('cfg-payload-mode').value === 'json',
  });
}

function renderTopics() {
  const list = $('topic-list');
  list.textContent = '';
  if (topics.length === 0) {
    const empty = document.createElement('span');
    empty.style.cssText = 'color:var(--dim);font-size:11px;font-style:italic';
    empty.textContent = 'No active topics.';
    list.append(empty);
    return;
  }
  for (const topic of topics) {
    const chip = document.createElement('span');
    chip.className = 'chip';
    chip.append(document.createTextNode(`${topic.filter}  ·  QoS ${topic.qos}`));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.title = `Remove ${topic.filter}`;
    remove.textContent = '×';
    remove.addEventListener('click', () => {
      topics = topics.filter((item) => item !== topic);
      renderTopics();
    });
    chip.append(remove);
    list.append(chip);
  }
}

function addTopic() {
  const input = $('new-topic');
  const filter = input.value.trim();
  const qos = Number($('new-qos').value);
  if (!isValidTopicFilter(filter)) {
    ui.showToast('Invalid topic filter. Use / levels, # only at the end, + for one level.', 'error');
    return;
  }
  if (topics.some((item) => item.filter === filter)) {
    ui.showToast('That topic filter is already in the list.', 'warn');
    return;
  }
  if (topics.length >= 50) {
    ui.showToast('Maximum of 50 topic filters reached.', 'warn');
    return;
  }
  topics.push({ filter, qos });
  input.value = '';
  renderTopics();
  if (client?.isConnected()) client.setSubscriptions(topics);
  ui.addEvent('info', `Added topic filter ${filter} (QoS ${qos})`);
}

function refresh() {
  const stats = store.stats();
  const keys = store.metricKeys();
  selectedMetric = ui.updateMetricSelect(keys, selectedMetric);
  ui.renderMetrics(store.latestMetrics(), keys);
  ui.renderMessages(store.filtered($('feed-filter').value), store.messages.length);
  ui.setStats(stats, topics.length);
  renderChart();
}

function renderChart() {
  const points = selectedMetric ? store.getSeries(selectedMetric) : [];
  chart.render(points, { label: selectedMetric });
  ui.setChartEmpty(points.length === 0);
}

function scheduleRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    refresh();
  });
}

function handleMessage({ topic, payload, qos }) {
  try {
    const parsed = parsePayload(payload, { jsonParsing: config.jsonParsing });
    store.add({
      topic,
      qos,
      timestamp: Date.now(),
      text: parsed.text,
      kind: parsed.kind,
      error: parsed.error,
      metrics: parsed.metrics,
    });
    if (parsed.error) ui.addEvent('warn', `Non-JSON payload on ${topic} — displayed as plain text`);
    scheduleRefresh();
  } catch (error) {
    ui.addEvent('error', `Failed to process message on ${topic}: ${error.message}`);
  }
}

function stopDemo({ silent = false } = {}) {
  if (demoTimer === null) return;
  clearInterval(demoTimer);
  demoTimer = null;
  if (!silent) ui.addEvent('info', 'Local simulation stopped');
}

function startDemo() {
  const filter = topics[0]?.filter ?? 'sensors/demo';
  const topic = filter.replace(/[+#]/g, 'demo');
  ui.addEvent('warn', 'Local simulation active — no broker connection, no network traffic.');
  ui.showToast('Local simulation started (no broker).', 'warn');
  let tick = 0;
  demoTimer = setInterval(() => {
    tick += 1;
    const payload = JSON.stringify({
      temperature: Number((21 + Math.sin(tick / 6) * 3 + Math.random()).toFixed(2)),
      humidity: Number((48 + Math.cos(tick / 8) * 6).toFixed(1)),
      pressure: Math.round(1010 + Math.random() * 4),
      device: 'simulated-sensor',
    });
    handleMessage({ topic, payload, qos: 0 });
  }, 1000);
}

function connect() {
  let cfg;
  try {
    cfg = assertValidConfig(readFormConfig());
  } catch (error) {
    ui.setConfigError(error.details ?? [error.message]);
    ui.showToast('Configuration error — see the highlighted messages.', 'error');
    activateTab('config');
    return;
  }
  ui.setConfigError([]);
  config = cfg;
  saveConfig(cfg);

  if ($('cfg-demo').checked) {
    ui.setStatus({ state: 'connected', detail: 'Local simulation', transport: cfg.transport });
    startDemo();
    return;
  }

  if (client) {
    client.dispose?.();
    client = null;
  }
  client = createClient(cfg);
  const target = cfg.transport === 'tcp' ? `${cfg.brokerHost}:${cfg.brokerPort}` : cfg.brokerWsUrl;
  ui.addEvent('info', `Connecting over ${cfg.transport === 'tcp' ? 'TCP' : 'WebSocket'} to ${target}…`);
  Promise.resolve()
    .then(() => client.connect(cfg))
    .catch((error) => {
      ui.addEvent('error', `Connect failed: ${error.message}`);
      ui.showToast(error.message, 'error');
    });
}

function createClient(cfg) {
  const handlers = {
    onStatus: (status) => ui.setStatus(status),
    onEvent: (level, message) => ui.addEvent(level, message),
    onMessage: handleMessage,
  };
  return cfg.transport === 'tcp' ? new ServerMqttClient(handlers) : new MqttDashboardClient(handlers);
}

function disconnect() {
  stopDemo();
  if (client) {
    client.disconnect();
    client = null;
  } else {
    ui.setStatus({ state: 'disconnected', detail: '' });
  }
}

function activateTab(name) {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.toggle('active', item.dataset.tab === name);
  });
  document.querySelectorAll('.tab-panel').forEach((panel) => {
    panel.classList.toggle('active', panel.id === `tab-${name}`);
  });
}

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => activateTab(item.dataset.tab));
});

$('btn-connect').addEventListener('click', connect);
$('btn-connect-cfg').addEventListener('click', connect);
$('cfg-transport').addEventListener('change', syncTransportFields);
$('cfg-payload-mode').addEventListener('change', () => {
  const jsonParsing = $('cfg-payload-mode').value === 'json';
  config = normalizeConfig({ ...config, jsonParsing });
  saveConfig(config);
  store.clear();
  selectedMetric = '';
  refresh();
  ui.addEvent('info', `Payload handling: ${jsonParsing ? 'JSON' : 'Raw'} — feed cleared`);
});
$('btn-disconnect').addEventListener('click', disconnect);
$('btn-disconnect-cfg').addEventListener('click', disconnect);
$('btn-add-topic').addEventListener('click', addTopic);
$('new-topic').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addTopic();
});
$('btn-clear-feed').addEventListener('click', () => {
  store.clear();
  selectedMetric = '';
  refresh();
  ui.addEvent('info', 'Message feed cleared');
});
$('feed-filter').addEventListener('input', () => scheduleRefresh());
$('metric-select').addEventListener('change', (event) => {
  selectedMetric = event.target.value;
  renderChart();
});
$('btn-clear-events').addEventListener('click', () => ui.clearEvents());
$('btn-clear-events-full').addEventListener('click', () => ui.clearEvents());

window.addEventListener('beforeunload', () => {
  stopDemo({ silent: true });
  if (client?.dispose) client.dispose();
  else client?.disconnect({ silent: true });
});

new ResizeObserver(() => renderChart()).observe($('signal-chart').parentElement);

ui.setClock();
setInterval(() => ui.setClock(), 1000);
ui.setStatus({ state: 'disconnected', detail: '' });
ui.renderMessages([], 0);
ui.renderEvents();
ui.setStats(store.stats(), 0);

try {
  const response = await fetch('/config');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  serverDefaults = normalizeConfig(await response.json());
} catch (error) {
  ui.addEvent('warn', `Could not load server defaults (${error.message}) — using built-in defaults.`);
}
applyToForm(mergeDefaults(serverDefaults, loadSavedConfig()));
refresh();

// A reload must not hide an already running server-side TCP bridge.
if (config.transport === 'tcp') {
  try {
    const response = await fetch('/api/state');
    if (response.ok) {
      const state = await response.json();
      if (state.connected) {
        client = createClient(config);
        client.resume(state);
        ui.addEvent('info', `Reattached to the running TCP bridge (${state.broker}).`);
      }
    }
  } catch {
    /* the bridge API is optional; ignore */
  }
}
