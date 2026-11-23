/**
 * Publisher service: holds one MQTT TCP connection and publishes on request.
 *
 * The browser drives it over local HTTP; this module owns validation, state and
 * the optional bounded burst. It never writes credentials anywhere.
 */

import { loadConfig, ConfigError } from './config.js';
import { MqttPublisher, sanitizeError } from './publisher.js';

export class ServiceError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
  }
}

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Map browser input onto the MQTT_* variables the config layer already validates. */
function overridesFrom(input = {}, { payload = false } = {}) {
  const text = (value, max) => String(value ?? '').slice(0, max);
  const env = {};
  if (input.host !== undefined) env.MQTT_HOST = text(input.host, 255).trim();
  if (input.port !== undefined) env.MQTT_PORT = String(input.port).trim();
  if (input.clientId !== undefined) env.MQTT_CLIENT_ID = text(input.clientId, 128).trim();
  if (input.username !== undefined) env.MQTT_USERNAME = text(input.username, 256);
  if (input.password !== undefined) env.MQTT_PASSWORD = text(input.password, 256);
  if (input.tls !== undefined) {
    env.MQTT_USE_TLS = input.tls ? 'true' : 'false';
    if (!input.tls) env.MQTT_TLS_INSECURE = 'false';
  }
  if (input.keepalive !== undefined) env.MQTT_KEEPALIVE = String(input.keepalive);
  if (input.connectTimeout !== undefined) env.MQTT_CONNECT_TIMEOUT = String(input.connectTimeout);
  if (input.reconnectPeriod !== undefined) env.MQTT_RECONNECT_PERIOD = String(input.reconnectPeriod);
  if (payload) {
    if (input.topic !== undefined) env.MQTT_TOPIC = String(input.topic);
    if (input.qos !== undefined) env.MQTT_QOS = String(input.qos);
    if (input.retain !== undefined) env.MQTT_RETAIN = input.retain ? 'true' : 'false';
    if (input.payload !== undefined) env.MQTT_PAYLOAD = String(input.payload);
    if (input.format !== undefined) env.MQTT_PAYLOAD_FORMAT = String(input.format);
    if (input.count !== undefined) env.MQTT_MAX_MESSAGES = String(input.count);
    if (input.intervalMs !== undefined) env.MQTT_INTERVAL_MS = String(input.intervalMs);
  }
  return env;
}

export class PublisherService {
  constructor({ env = process.env, createPublisher, logger = silentLogger, now = Date.now } = {}) {
    this.env = env;
    this.logger = logger;
    this.now = now;
    this.createPublisher =
      createPublisher ??
      (() =>
        new MqttPublisher({
          logger: this.logger,
          onEvent: (level, message) => this._log(level === 'success' ? 'success' : level, message),
          onStatus: (status) => {
            if (status === 'connected') this.lastError = null;
            this._log('info', `Broker connection: ${status}`);
            this._changed();
          },
        }));

    this.listeners = new Set();
    this.publisher = null;
    this.config = null;
    this.broker = null;
    this.published = 0;
    this.failed = 0;
    this.lastPublishAt = null;
    this.connectedAt = null;
    this.lastError = null;
    this.job = null;
  }

  on(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(event) {
    for (const listener of [...this.listeners]) {
      try {
        listener(event);
      } catch {
        /* an observer must never break publishing */
      }
    }
  }

  _log(level, message) {
    this._emit({ kind: 'log', level, message, at: this.now() });
  }

  _changed() {
    this._emit({ kind: 'state', state: this.state() });
  }

  state() {
    const status = this.publisher?.status ?? 'disconnected';
    return {
      connected: Boolean(this.publisher?.isConnected?.()),
      status,
      hasSession: Boolean(this.publisher),
      transport: 'tcp',
      broker: this.broker
        ? {
            url: `${this.broker.tls ? 'mqtts' : 'mqtt'}://${this.broker.host}:${this.broker.port}`,
            host: this.broker.host,
            port: this.broker.port,
            tls: this.broker.tls,
          }
        : null,
      clientId: this.config?.clientId || null,
      published: this.published,
      failed: this.failed,
      lastPublishAt: this.lastPublishAt,
      connectedAt: this.connectedAt,
      lastError: this.lastError,
      job: this.job
        ? { running: this.job.running, sent: this.job.sent, total: this.job.total, cancelled: this.job.cancelled }
        : null,
    };
  }

  _config(input, options) {
    try {
      return loadConfig({ ...this.env, ...overridesFrom(input, options) });
    } catch (error) {
      if (error instanceof ConfigError) throw new ServiceError(400, error.message);
      throw error;
    }
  }

  async connect(input = {}) {
    if (this.publisher) {
      throw new ServiceError(409, 'Already connected — disconnect before connecting again.');
    }
    const config = this._config(input, { payload: false });
    const publisher = this.createPublisher();
    try {
      await publisher.connect(config);
    } catch (error) {
      try {
        await publisher.end?.();
      } catch {
        /* already closed */
      }
      this.lastError = sanitizeError(error);
      this._log('error', `Connection failed: ${this.lastError}`);
      this._changed();
      throw new ServiceError(502, this.lastError);
    }

    this.publisher = publisher;
    this.config = config;
    this.broker = { host: config.host, port: config.port, tls: config.useTls };
    this.connectedAt = this.now();
    this.lastError = null;
    this._log('success', `TCP connection established to ${this.broker.host}:${this.broker.port}`);
    this._changed();
    return this.state();
  }

  async publish(input = {}) {
    if (!this.publisher) throw new ServiceError(409, 'Not connected to a broker — connect first.');
    const config = this._config(input, { payload: true });
    return this._publishWith(config);
  }

  async _publishWith(config) {
    if (!this.publisher) throw new ServiceError(409, 'Not connected to a broker — connect first.');
    try {
      await this.publisher.publish(config.topic, config.payloadValue, {
        qos: config.qos,
        retain: config.retain,
        format: config.payloadFormat,
        timeoutMs: config.publishTimeout,
      });
    } catch (error) {
      this.failed += 1;
      this.lastError = sanitizeError(error);
      this._log('error', `Publish failed: ${this.lastError}`);
      this._changed();
      throw new ServiceError(502, this.lastError);
    }

    this.published += 1;
    this.lastPublishAt = this.now();
    const bytes = Buffer.byteLength(
      config.payloadFormat === 'json' ? JSON.stringify(config.payloadValue) : String(config.payloadValue),
    );
    this._log('published', `Published to ${config.topic} · ${bytes} bytes · QoS ${config.qos}${config.retain ? ' · retained' : ''}`);
    const record = { topic: config.topic, qos: config.qos, retain: config.retain, bytes, at: this.lastPublishAt };
    this._emit({ kind: 'published', record });
    this._changed();
    return record;
  }

  startBurst(input = {}) {
    if (!this.publisher) throw new ServiceError(409, 'Not connected to a broker — connect first.');
    if (this.job?.running) throw new ServiceError(409, 'A burst is already running.');

    const config = this._config({ ...input, loop: true }, { payload: true });
    const job = {
      running: true,
      cancelled: false,
      sent: 0,
      total: config.maxMessages,
      startedAt: this.now(),
      finishedAt: null,
    };
    this.job = job;
    this._log('info', `Burst started: ${job.total} message(s) every ${config.intervalMs} ms`);
    this._runBurst(job, config);
    return this.state();
  }

  async _runBurst(job, config) {
    try {
      for (let index = 0; index < job.total; index += 1) {
        if (job.cancelled) break;
        if (index > 0) await sleep(config.intervalMs);
        if (job.cancelled) break;
        try {
          await this._publishWith(config);
        } catch {
          /* _publishWith already recorded the failure; stop the burst */
          break;
        }
        job.sent += 1;
      }
    } finally {
      job.running = false;
      job.finishedAt = this.now();
      this._log(job.cancelled ? 'warn' : 'info', `Burst finished: ${job.sent}/${job.total} published`);
      this._changed();
    }
  }

  stopBurst() {
    if (!this.job?.running) return this.state();
    this.job.cancelled = true;
    this._log('warn', 'Burst stop requested');
    return this.state();
  }

  async disconnect() {
    const publisher = this.publisher;
    if (this.job?.running) this.job.cancelled = true;
    this.publisher = null;
    this.config = null;
    if (publisher) {
      await publisher.end().catch(() => {});
      this._log('info', 'Disconnected from broker');
    }
    this.broker = null;
    this._changed();
    return this.state();
  }
}
