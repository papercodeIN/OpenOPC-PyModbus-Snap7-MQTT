/** MQTT-over-WebSocket client wrapper with status, reconnect and subscription handling. */

export function sanitizeError(error) {
  let message = error && error.message ? error.message : String(error);
  message = message.replace(/([a-z][a-z0-9+.-]*:\/\/)[^/@\s]+@/gi, '$1***@');
  message = message.replace(/[\r\n]+/g, ' ').trim();
  return message.slice(0, 300);
}

function randomSuffix() {
  const bytes = new Uint8Array(4);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, i) => { bytes[i] = Math.floor(Math.random() * 256); });
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export class MqttDashboardClient {
  constructor({ createClient, onStatus, onMessage, onEvent } = {}) {
    this.createClient =
      createClient ??
      ((url, options) => {
        const library = globalThis.mqtt;
        if (!library || typeof library.connect !== 'function') {
          throw new Error('MQTT browser bundle is unavailable — reload the page.');
        }
        return library.connect(url, options);
      });
    this.onStatus = onStatus ?? (() => {});
    this.onMessage = onMessage ?? (() => {});
    this.onEvent = onEvent ?? (() => {});

    this.client = null;
    this.state = 'disconnected';
    this.subscriptions = [];
    this.subscribed = [];
    this._lastDetail = '';
  }

  _emit(kind, payload) {
    try {
      if (kind === 'status') this.onStatus(payload);
      else if (kind === 'message') this.onMessage(payload);
      else this.onEvent(payload[0], payload[1]);
    } catch {
      /* UI callbacks must never break the MQTT event loop. */
    }
  }

  _setState(state, detail = '') {
    if (this.state === state && this._lastDetail === detail) return;
    this.state = state;
    this._lastDetail = detail;
    this._emit('status', { state, detail });
  }

  isConnected() {
    return this.state === 'connected';
  }

  connect(config = {}) {
    if (this.client) this.disconnect({ silent: true });
    const url = String(config.brokerWsUrl ?? '');
    if (!/^wss?:\/\//i.test(url)) throw new Error('Broker URL must use ws:// or wss://.');

    const options = {
      clientId: String(config.clientId || '') || `${config.clientIdPrefix || 'mqtt-dash-'}${randomSuffix()}`,
      keepalive: config.keepalive,
      reconnectPeriod: config.reconnectPeriod,
      connectTimeout: config.connectTimeout,
      clean: true,
      protocolVersion: 4,
    };
    if (config.username) options.username = config.username;
    if (config.password) options.password = config.password;

    this.subscriptions = Array.isArray(config.topics)
      ? config.topics.map((item) => ({ filter: String(item.filter), qos: Number(item.qos) || 0 }))
      : [];
    this.subscribed = [];
    this._setState('connecting', url);

    try {
      this.client = this.createClient(url, options);
    } catch (error) {
      this._setState('disconnected', 'Client creation failed');
      this._emit('event', ['error', `Could not create MQTT client: ${sanitizeError(error)}`]);
      throw error;
    }

    const client = this.client;
    client.on('connect', () => {
      this._setState('connected', 'Connected — subscribing');
      this._emit('event', ['success', 'Connected to broker']);
      this._subscribe();
    });
    client.on('reconnect', () => {
      this._setState('reconnecting', 'Attempting reconnect');
      this._emit('event', ['warn', 'Connection lost — reconnecting…']);
    });
    client.on('offline', () => {
      if (this.client !== client) return;
      this._setState('offline', 'Broker unreachable');
      this._emit('event', ['warn', 'Client offline']);
    });
    client.on('close', () => {
      if (this.client !== client) return;
      this._setState('offline', 'Connection closed');
      this._emit('event', ['warn', 'Connection closed']);
    });
    client.on('end', () => {
      if (this.client !== client) return;
      this.subscribed = [];
      this._setState('disconnected', 'Connection ended');
      this._emit('event', ['info', 'Connection ended']);
    });
    client.on('error', (error) => {
      if (this.client !== client) return;
      this._emit('event', ['error', `MQTT error: ${sanitizeError(error)}`]);
    });
    client.on('message', (topic, payload, packet) => {
      if (this.client !== client) return;
      this._emit('message', { topic, payload, qos: packet && packet.qos ? packet.qos : 0 });
    });
    return client;
  }

  _subscribe() {
    const client = this.client;
    if (!client || this.state !== 'connected') return;
    if (this.subscriptions.length === 0) {
      this._setState('connected', 'No subscriptions');
      this._emit('event', ['warn', 'No topic filters configured — add one in Configuration.']);
      return;
    }
    const topics = {};
    for (const item of this.subscriptions) topics[item.filter] = { qos: item.qos };
    try {
      client.subscribe(topics, (error) => {
        if (this.client !== client) return;
        if (error) {
          this._emit('event', ['error', `Subscription failed: ${sanitizeError(error)}`]);
          this._setState('connected', 'Subscription failed');
          return;
        }
        this.subscribed = this.subscriptions.map((item) => ({ ...item }));
        this._emit('event', ['success', `Subscribed to ${this.subscribed.length} topic filter(s)`]);
        this._setState('connected', 'Subscribed');
      });
    } catch (error) {
      this._emit('event', ['error', `Subscription failed: ${sanitizeError(error)}`]);
    }
  }

  setSubscriptions(topics) {
    this.subscriptions = Array.isArray(topics)
      ? topics.map((item) => ({ filter: String(item.filter), qos: Number(item.qos) || 0 }))
      : [];
    const client = this.client;
    if (!client || this.state !== 'connected') return;
    const wanted = new Set(this.subscriptions.map((item) => item.filter));
    const removed = this.subscribed.map((item) => item.filter).filter((filter) => !wanted.has(filter));
    if (removed.length) {
      try {
        client.unsubscribe(removed, () => {});
      } catch (error) {
        this._emit('event', ['error', `Unsubscribe failed: ${sanitizeError(error)}`]);
      }
    }
    this._subscribe();
  }

  disconnect({ silent = false } = {}) {
    const client = this.client;
    this.client = null;
    this.subscribed = [];
    if (client) {
      try {
        client.removeAllListeners?.();
        client.end(true);
      } catch {
        /* ignore shutdown errors */
      }
    }
    this._setState('disconnected', 'Disconnected');
    if (!silent) this._emit('event', ['info', 'Disconnected from broker']);
  }
}
