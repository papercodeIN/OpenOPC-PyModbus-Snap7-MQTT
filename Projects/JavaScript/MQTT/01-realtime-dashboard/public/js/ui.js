/** DOM rendering for the dashboard. All untrusted values use textContent. */

import { truncate } from './payload.js';

const $ = (id) => document.getElementById(id);

function timeOf(timestamp) {
  const date = new Date(timestamp);
  return Number.isFinite(date.getTime()) ? date.toLocaleTimeString([], { hour12: false }) : '--:--:--';
}

const STATUS_LABELS = Object.freeze({
  connected: 'CONNECTED',
  connecting: 'CONNECTING',
  reconnecting: 'RECONNECTING',
  offline: 'OFFLINE',
  disconnected: 'DISCONNECTED',
});

export function createUI() {
  const el = {
    pillConn: $('pill-conn'),
    pillLast: $('pill-last'),
    pillRate: $('pill-rate'),
    connState: $('conn-state'),
    btnConnect: $('btn-connect'),
    btnDisconnect: $('btn-disconnect'),
    navWs: $('nav-ws'),
    feedBadge: $('feed-badge'),
    statReceived: $('stat-received'),
    statRate: $('stat-rate'),
    statLast: $('stat-last'),
    statSubscriptions: $('stat-subscriptions'),
    statErrors: $('stat-errors'),
    feedCount: $('feed-count'),
    feedFoot: $('feed-foot'),
    feedTable: $('message-feed'),
    feedFilter: $('feed-filter'),
    metricGrid: $('metric-grid'),
    metricSelect: $('metric-select'),
    chartEmpty: $('chart-empty'),
    eventLog: $('event-log'),
    eventLogFull: $('event-log-full'),
    toastStack: $('toast-stack'),
    configError: $('config-error'),
    clockTime: $('clock-time'),
    clockDate: $('clock-date'),
  };
  let events = [];
  let lastStatus = 'disconnected';
  let transportLabel = 'TCP';

  function setPill(pill, on, warn, value) {
    pill.classList.toggle('on', on);
    pill.classList.toggle('warn', !on && warn);
    const node = pill.querySelector('.pill-value');
    if (node) node.textContent = value;
  }

  function setStatus({ state, detail = '', transport } = {}) {
    lastStatus = state;
    if (transport) transportLabel = transport === 'tcp' ? 'TCP' : 'WS';
    const connected = state === 'connected';
    const warn = ['connecting', 'reconnecting', 'offline'].includes(state);
    setPill(el.pillConn, connected, warn, `${STATUS_LABELS[state] ?? state.toUpperCase()}${detail ? ` · ${truncate(detail, 20)}` : ''}`);
    el.connState.className = `state-chip${connected ? ' online' : ''}`;
    el.connState.textContent = '';
    const led = document.createElement('span');
    led.className = 'led';
    el.connState.append(led, document.createTextNode(` ${STATUS_LABELS[state] ?? state.toUpperCase()}`));

    el.btnConnect.disabled = ['connecting', 'connected', 'reconnecting', 'offline'].includes(state);
    el.btnDisconnect.disabled = state === 'disconnected';
    el.navWs.className = `badge ${connected ? 'badge-on' : 'badge-off'}`;
    el.navWs.textContent = connected ? `${transportLabel} LIVE` : state === 'reconnecting' ? `${transportLabel} RETRY` : `${transportLabel} OFF`;
    el.feedBadge.className = `badge ${connected ? 'badge-on' : 'badge-off'}`;
    el.feedBadge.textContent = '';
    const feedLed = document.createElement('span');
    feedLed.className = 'led small';
    el.feedBadge.append(feedLed, document.createTextNode(connected ? 'LIVE' : 'OFFLINE'));
  }

  function getStatus() {
    return lastStatus;
  }

  function setStats(stats = {}, subscriptionCount = 0) {
    el.statReceived.textContent = String(stats.received ?? 0);
    el.statRate.textContent = '';
    const rate = document.createTextNode(String(stats.ratePerMinute ?? 0));
    const unit = document.createElement('span');
    unit.style.fontSize = '14px';
    unit.textContent = '/min';
    el.statRate.append(rate, unit);
    el.statLast.textContent = stats.lastAt ? timeOf(stats.lastAt) : '--:--:--';
    el.statSubscriptions.textContent = String(subscriptionCount);
    el.statErrors.textContent = String(stats.parseErrors ?? 0);
    setPill(el.pillLast, Boolean(stats.lastAt), false, stats.lastAt ? timeOf(stats.lastAt) : '--:--:--');
    setPill(el.pillRate, false, false, `${stats.ratePerMinute ?? 0}/min`);
    el.feedCount.textContent = `${stats.stored ?? 0} messages`;
  }

  function renderMessages(messages = [], total = 0) {
    el.feedTable.textContent = '';
    if (messages.length === 0) {
      const row = document.createElement('tr');
      row.className = 'empty-row';
      const cell = document.createElement('td');
      cell.colSpan = 6;
      cell.textContent = total > 0 ? 'No messages match the current topic filter.' : 'No messages yet — connect to a broker to begin.';
      row.append(cell);
      el.feedTable.append(row);
    } else {
      const fragment = document.createDocumentFragment();
      for (const message of messages) {
        const row = document.createElement('tr');
        const values = [
          String(message.id),
          timeOf(message.timestamp),
          message.topic,
          String(message.qos),
          null,
          truncate(message.text, 400),
        ];
        values.forEach((value, index) => {
          const cell = document.createElement('td');
          if (index === 2) cell.className = 'topic-cell';
          if (index === 5) cell.className = 'payload-cell';
          if (index === 4) {
            const badge = document.createElement('span');
            const kind = message.error ? 'error' : message.kind;
            badge.className = `type-badge ${kind}`;
            badge.textContent = kind.toUpperCase();
            cell.append(badge);
          } else {
            cell.textContent = value;
          }
          row.append(cell);
        });
        fragment.append(row);
      }
      el.feedTable.append(fragment);
    }
    el.feedFoot.textContent = `${messages.length} shown / ${total} stored`;
  }

  function renderEvents() {
    for (const log of [el.eventLog, el.eventLogFull]) {
      if (!log) continue;
      log.textContent = '';
      if (events.length === 0) {
        const item = document.createElement('div');
        item.className = 'event-item';
        item.textContent = '--:--:--  No events yet.';
        log.append(item);
        continue;
      }
      const fragment = document.createDocumentFragment();
      for (const event of events) {
        const item = document.createElement('div');
        item.className = `event-item ${event.level}`;
        const time = document.createElement('span');
        time.className = 'event-time';
        time.textContent = timeOf(event.timestamp);
        const message = document.createElement('span');
        message.className = 'event-msg';
        message.textContent = event.message;
        item.append(time, message);
        fragment.append(item);
      }
      log.append(fragment);
      log.scrollTop = log.scrollHeight;
    }
  }

  function addEvent(level, message) {
    events.push({ timestamp: Date.now(), level: ['success', 'warn', 'error', 'published'].includes(level) ? level : '', message: String(message) });
    if (events.length > 300) events.shift();
    renderEvents();
  }

  function clearEvents() {
    events = [];
    renderEvents();
  }

  function updateMetricSelect(keys, selected) {
    el.metricSelect.textContent = '';
    if (keys.length === 0) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = 'No numeric data yet';
      el.metricSelect.append(option);
      return '';
    }
    for (const key of keys) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = key;
      el.metricSelect.append(option);
    }
    const value = keys.includes(selected) ? selected : keys[0];
    el.metricSelect.value = value;
    return value;
  }

  function renderMetrics(latest, keys) {
    el.metricGrid.textContent = '';
    if (keys.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'metric-empty';
      empty.textContent = 'Numeric fields in JSON payloads appear here as live value cards.';
      el.metricGrid.append(empty);
      return;
    }
    const accents = ['accent-cyan', 'accent-amber', 'accent-green', 'accent-blue'];
    keys.forEach((key, index) => {
      const item = latest.get(key);
      if (!item) return;
      const card = document.createElement('div');
      card.className = `metric-card ${accents[index % accents.length]}`;
      const label = document.createElement('div');
      label.className = 'metric-key';
      label.textContent = key;
      label.title = key;
      const value = document.createElement('div');
      value.className = 'metric-value';
      value.textContent = Number(item.value).toFixed(Number.isInteger(item.value) ? 0 : 2);
      const time = document.createElement('div');
      time.className = 'metric-time';
      time.textContent = timeOf(item.t);
      card.append(label, value, time);
      el.metricGrid.append(card);
    });
  }

  function setChartEmpty(empty) {
    el.chartEmpty.hidden = !empty;
  }

  function showToast(message, level = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${level}`;
    toast.textContent = String(message);
    el.toastStack.append(toast);
    while (el.toastStack.children.length > 4) el.toastStack.firstElementChild.remove();
    setTimeout(() => toast.remove(), 5000);
  }

  function setConfigError(errors) {
    const list = Array.isArray(errors) ? errors : errors ? [errors] : [];
    if (list.length === 0) {
      el.configError.classList.remove('visible');
      el.configError.textContent = '';
      return;
    }
    el.configError.classList.add('visible');
    el.configError.textContent = list.map((item) => `• ${item}`).join('\n');
  }

  function setClock() {
    const now = new Date();
    el.clockTime.textContent = now.toLocaleTimeString([], { hour12: true });
    el.clockDate.textContent = now.toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  }

  return {
    setStatus,
    getStatus,
    setStats,
    renderMessages,
    renderEvents,
    addEvent,
    clearEvents,
    updateMetricSelect,
    renderMetrics,
    setChartEmpty,
    showToast,
    setConfigError,
    setClock,
  };
}
