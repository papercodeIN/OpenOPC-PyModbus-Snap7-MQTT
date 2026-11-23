/** JSON API for the dashboard's server-side MQTT/TCP bridge. */

import { BrokerInputError } from './broker-bridge.js';

const MAX_BODY_BYTES = 256 * 1024;

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const type = String(req.headers['content-type'] ?? '');
  if (!type.toLowerCase().startsWith('application/json')) {
    throw new HttpError(415, 'Expected Content-Type: application/json.');
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new HttpError(413, 'Request body is too large.');
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('body must be a JSON object');
    }
    return parsed;
  } catch (error) {
    throw new HttpError(400, `Invalid JSON body: ${error.message}`);
  }
}

/** Defaults taken from the validated server configuration (.env + environment). */
export function bridgeDefaults(config) {
  return {
    host: config.brokerHost,
    port: config.brokerPort,
    tls: config.brokerTls,
    topics: config.topics.map((filter) => ({ filter, qos: config.qos })),
    keepalive: config.keepalive,
    connectTimeout: config.connectTimeout,
    reconnectPeriod: config.reconnectPeriod,
  };
}

/** Route /api/* requests. Returns true when the request was handled. */
export async function handleApi(req, res, pathname, { bridge, hub, config, logger }) {
  if (!pathname.startsWith('/api/')) return false;

  if (pathname === '/api/state' && (req.method === 'GET' || req.method === 'HEAD')) {
    sendJson(res, 200, bridge ? bridge.getState() : { state: 'disconnected', connected: false, transport: 'tcp' });
    return true;
  }

  if (pathname === '/api/stream' && req.method === 'GET') {
    hub.add(req, res);
    const state = bridge ? bridge.getState() : { state: 'disconnected', connected: false };
    res.write(`event: status\ndata: ${JSON.stringify({ ...state, detail: '' })}\n\n`);
    return true;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return true;
  }

  try {
    if (pathname === '/api/broker/connect') {
      if (!bridge) throw new HttpError(503, 'The TCP bridge is not available in this process.');
      const body = await readJson(req);
      const state = await bridge.connect(body, bridgeDefaults(config));
      sendJson(res, 200, state);
      return true;
    }

    if (pathname === '/api/broker/subscribe') {
      if (!bridge) throw new HttpError(503, 'The TCP bridge is not available in this process.');
      const body = await readJson(req);
      const state = await bridge.setSubscriptions(Array.isArray(body.topics) ? body.topics : []);
      sendJson(res, 200, state);
      return true;
    }

    if (pathname === '/api/broker/disconnect') {
      if (!bridge) throw new HttpError(503, 'The TCP bridge is not available in this process.');
      const state = await bridge.disconnect();
      sendJson(res, 200, state);
      return true;
    }

    sendJson(res, 404, { error: 'Not found' });
    return true;
  } catch (error) {
    if (error instanceof HttpError) {
      sendJson(res, error.status, { error: error.message });
      return true;
    }
    if (error instanceof BrokerInputError) {
      sendJson(res, 400, { error: error.message });
      return true;
    }
    logger?.error('api request failed', { path: pathname, error: error.message });
    sendJson(res, 502, { error: error.message });
    return true;
  }
}
