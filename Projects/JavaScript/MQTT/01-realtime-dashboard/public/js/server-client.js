/**
 * MQTT over TCP from the browser's point of view.
 *
 * The browser cannot open a TCP socket, so this thin client drives the local
 * server's bridge: POST /api/broker/* for actions and Server-Sent Events for the
 * message stream. It exposes the same surface as MqttDashboardClient so the UI
 * does not care which transport is in use.
 */

function base64ToBytes(text) {
  const binary = atob(text);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export class ServerMqttClient {
  constructor({ fetchImpl, EventSourceImpl, onStatus, onMessage, onEvent } = {}) {
    this.fetchImpl = fetchImpl ?? ((...args) => fetch(...args));
    this.EventSourceImpl = EventSourceImpl ?? globalThis.EventSource;
    this.onStatus = onStatus ?? (() => {});
    this.onMessage = onMessage ?? (() => {});
    this.onEvent = onEvent ?? (() => {});
    this.source = null;
    this.state = 'disconnected';
    this.subscriptions = [];
    this._lastDetail = '';
  }

  _emit(kind, payload) {
    try {
      if (kind === 'status') this.onStatus(payload);
      else if (kind === 'message') this.onMessage(payload);
      else this.onEvent(payload[0], payload[1]);
    } catch {
      /* UI callbacks must never break the stream */
    }
  }

  _setState(state, detail = '') {
    if (this.state === state && this._lastDetail === detail) return;
    this.state = state;
    this._lastDetail = detail;
    this._emit('status', { state, detail, transport: 'tcp' });
  }

  isConnected() {
    return this.state === 'connected';
  }

  async _post(path, body) {
    const response = await this.fetchImpl(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    });
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      /* empty body */
    }
    if (!response.ok) throw new Error(payload.error ?? `Request failed with HTTP ${response.status}`);
    return payload;
  }

  _openStream() {
    this._closeStream();
    if (!this.EventSourceImpl) {
      this._setState('offline', 'EventSource is not supported by this browser');
      return;
    }
    const source = new this.EventSourceImpl('/api/stream');
    this.source = source;

    source.addEventListener('message', (event) => {
      if (this.source !== source) return;
      try {
        const data = JSON.parse(event.data);
        this._emit('message', {
          topic: data.topic,
          qos: data.qos,
          payload: data.payloadBase64 ? base64ToBytes(data.payloadBase64) : new Uint8Array(),
        });
      } catch {
        this._emit('event', ['warn', 'Ignored a malformed stream frame.']);
      }
    });

    source.addEventListener('status', (event) => {
      if (this.source !== source) return;
      try {
        const data = JSON.parse(event.data);
        this._setState(data.state ?? 'offline', data.detail ?? '');
      } catch {
        /* ignore malformed status frames */
      }
    });

    source.addEventListener('event', (event) => {
      if (this.source !== source) return;
      try {
        const data = JSON.parse(event.data);
        this._emit('event', [data.level ?? 'info', data.message ?? '']);
      } catch {
        /* ignore malformed event frames */
      }
    });

    source.onerror = () => {
      if (this.source !== source) return;
      this._setState('offline', 'Event stream lost — retrying');
    };
  }

  _closeStream() {
    if (!this.source) return;
    try {
      this.source.close();
    } catch {
      /* ignore */
    }
    this.source = null;
  }

  async connect(config = {}) {
    this.state = 'disconnected';
    this._setState('connecting', `${config.brokerHost}:${config.brokerPort}`);
    try {
      await this._post('/api/broker/connect', {
        host: config.brokerHost,
        port: config.brokerPort,
        tls: Boolean(config.useTls),
        username: config.username,
        password: config.password,
        clientId: config.clientId,
        topics: Array.isArray(config.topics) ? config.topics : [],
        keepalive: config.keepalive,
        reconnectPeriod: config.reconnectPeriod,
        connectTimeout: config.connectTimeout,
      });
    } catch (error) {
      this._setState('disconnected', error.message);
      this._emit('event', ['error', `TCP connection failed: ${error.message}`]);
      throw error;
    }
    this._openStream();
    this._setState('connected', 'TCP');
    return this;
  }

  /** Reattach after a page reload while the server-side bridge is still connected. */
  resume(state = {}) {
    this._openStream();
    this._setState(state.state ?? 'connected', state.detail ?? 'TCP');
  }

  async setSubscriptions(topics) {
    this.subscriptions = Array.isArray(topics) ? topics.map((item) => ({ ...item })) : [];
    if (this.state !== 'connected') return;
    try {
      await this._post('/api/broker/subscribe', {
        topics: this.subscriptions.map((item) => ({ filter: item.filter, qos: Number(item.qos) || 0 })),
      });
    } catch (error) {
      this._emit('event', ['error', `Subscription update failed: ${error.message}`]);
    }
  }

  async disconnect() {
    this._closeStream();
    try {
      await this._post('/api/broker/disconnect');
    } catch (error) {
      this._emit('event', ['warn', `Disconnect request failed: ${error.message}`]);
    }
    this._setState('disconnected', 'Disconnected');
    this._emit('event', ['info', 'Disconnected from broker']);
  }

  /** Page unload: stop listening but leave the broker connection for other tabs. */
  dispose() {
    this._closeStream();
  }
}
