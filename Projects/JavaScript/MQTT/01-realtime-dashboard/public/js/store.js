/** Bounded in-memory message buffer, metric history and session statistics. */

export class MessageStore {
  constructor({ maxMessages = 200, maxHistoryPoints = 120 } = {}) {
    this.maxMessages = Math.max(1, Math.floor(maxMessages));
    this.maxHistoryPoints = Math.max(1, Math.floor(maxHistoryPoints));
    this.messages = [];
    this.series = new Map();
    this.received = 0;
    this.parseErrors = 0;
    this.firstAt = null;
    this.lastAt = null;
    this._seq = 0;
  }

  add(record = {}) {
    const timestamp = Number.isFinite(record.timestamp) ? record.timestamp : Date.now();
    const metrics = Array.isArray(record.metrics)
      ? record.metrics.filter((item) => item && typeof item.key === 'string' && Number.isFinite(item.value))
      : [];
    const entry = {
      id: ++this._seq,
      timestamp,
      topic: String(record.topic ?? ''),
      qos: Number.isInteger(record.qos) ? record.qos : 0,
      kind: record.kind === 'json' ? 'json' : 'text',
      text: String(record.text ?? ''),
      error: record.error ? String(record.error) : null,
      metrics,
    };

    this.messages.unshift(entry);
    if (this.messages.length > this.maxMessages) this.messages.pop();
    this.received += 1;
    if (entry.error) this.parseErrors += 1;
    if (this.firstAt === null) this.firstAt = timestamp;
    this.lastAt = timestamp;

    for (const metric of metrics) {
      if (!this.series.has(metric.key)) this.series.set(metric.key, []);
      const points = this.series.get(metric.key);
      points.push({ t: timestamp, value: metric.value });
      if (points.length > this.maxHistoryPoints) points.shift();
    }
    return entry;
  }

  getSeries(key) {
    return this.series.get(key) ?? [];
  }

  metricKeys() {
    return [...this.series.keys()].sort();
  }

  latestMetrics() {
    const latest = new Map();
    for (const entry of this.messages) {
      for (const metric of entry.metrics) {
        if (!latest.has(metric.key)) latest.set(metric.key, { value: metric.value, t: entry.timestamp });
      }
    }
    return latest;
  }

  filtered(topicFilter = '') {
    const needle = String(topicFilter).trim().toLowerCase();
    if (!needle) return this.messages;
    return this.messages.filter((entry) => entry.topic.toLowerCase().includes(needle));
  }

  stats() {
    const cutoff = Date.now() - 60000;
    const rate = this.messages.reduce((count, entry) => count + (entry.timestamp >= cutoff ? 1 : 0), 0);
    return {
      received: this.received,
      parseErrors: this.parseErrors,
      lastAt: this.lastAt,
      firstAt: this.firstAt,
      ratePerMinute: rate,
      stored: this.messages.length,
    };
  }

  clear() {
    this.messages = [];
    this.series.clear();
    this.received = 0;
    this.parseErrors = 0;
    this.firstAt = null;
    this.lastAt = null;
    this._seq = 0;
  }
}
