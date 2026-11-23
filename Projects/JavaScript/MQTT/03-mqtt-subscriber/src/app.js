/** HTTP layer: static UI, JSON API, Server-Sent Events and the TCP subscriber service. */

import fs from 'node:fs/promises';
import path from 'node:path';

import { publicConfig } from './config.js';
import { ServiceError } from './service.js';
import { createEventHub } from './event-hub.js';

const MAX_BODY_BYTES = 512 * 1024;

const MIME = Object.freeze({
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
});

const SECURITY_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
});

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sendJson(res, status, body) {
  res.writeHead(status, { ...SECURITY_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const type = String(req.headers['content-type'] ?? '').toLowerCase();
  if (!type.startsWith('application/json')) throw new HttpError(415, 'Expected Content-Type: application/json.');
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
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('body must be a JSON object');
    return parsed;
  } catch (error) {
    throw new HttpError(400, `Invalid JSON body: ${error.message}`);
  }
}

const LOOPBACK = new Set(['127.0.0.1', 'localhost', '::1', '[::1]']);

function hostAllowed(req, config) {
  if (!LOOPBACK.has(config.httpHost)) return true;
  const header = String(req.headers.host ?? '').toLowerCase();
  return LOOPBACK.has(header.replace(/:\d+$/, ''));
}

export function createApp({ service, config, appDir = process.cwd(), logger }) {
  const publicDir = path.resolve(appDir, 'public');
  const hub = createEventHub();
  const history = { logs: [], messages: [] };

  service.on((event) => {
    if (event.kind === 'log') {
      history.logs.push({ level: event.level, message: event.message, at: event.at });
      if (history.logs.length > 200) history.logs.shift();
    }
    if (event.kind === 'message') {
      history.messages.unshift(event.message);
      if (history.messages.length > 200) history.messages.pop();
    }
    hub.broadcast(event.kind, event);
  });

  async function serveFile(req, res, filePath) {
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, {
        ...SECURITY_HEADERS,
        'Content-Type': MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
        'Content-Length': data.length,
        'Cache-Control': 'no-store',
      });
      res.end(req.method === 'HEAD' ? undefined : data);
    } catch (error) {
      if (['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) sendJson(res, 404, { error: 'Not found' });
      else {
        logger?.error('static file failed', { path: filePath, error: error.message });
        sendJson(res, 500, { error: 'Internal server error' });
      }
    }
  }

  async function handleApi(req, res, pathname) {
    if (pathname === '/api/state' && req.method === 'GET') {
      sendJson(res, 200, service.state());
      return true;
    }
    if (pathname === '/api/config' && req.method === 'GET') {
      sendJson(res, 200, { httpPort: config.httpPort, defaults: publicConfig(config).defaults });
      return true;
    }
    if (pathname === '/api/history' && req.method === 'GET') {
      sendJson(res, 200, history);
      return true;
    }
    if (pathname === '/api/events' && req.method === 'GET') {
      hub.add(req, res);
      res.write(`event: state\ndata: ${JSON.stringify(service.state())}\n\n`);
      return true;
    }
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return true;
    }

    const body = await readJson(req);
    switch (pathname) {
      case '/api/connect':
        sendJson(res, 200, await service.connect(body));
        return true;
      case '/api/disconnect':
        sendJson(res, 200, await service.disconnect());
        return true;
      case '/api/subscribe':
        sendJson(res, 200, await service.updateSubscriptions(body));
        return true;
      default:
        sendJson(res, 404, { error: 'Not found' });
        return true;
    }
  }

  return async function handler(req, res) {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    } catch {
      sendJson(res, 400, { error: 'Malformed URL' });
      return;
    }
    if (pathname.includes('\0')) {
      sendJson(res, 400, { error: 'Malformed URL' });
      return;
    }
    if (!hostAllowed(req, config)) {
      sendJson(res, 403, { error: 'Forbidden host' });
      return;
    }

    try {
      if (pathname.startsWith('/api/')) {
        await handleApi(req, res, pathname);
        return;
      }
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { ...SECURITY_HEADERS, Allow: 'GET, HEAD' });
        res.end();
        return;
      }
      if (pathname === '/healthz') {
        const state = service.state();
        sendJson(res, 200, {
          status: 'ok',
          service: 'mqtt-subscriber',
          uptimeSeconds: Math.round(process.uptime()),
          broker: {
            connected: state.connected,
            status: state.status,
            url: state.broker?.url ?? null,
            topics: state.topics?.length ?? 0,
          },
        });
        return;
      }

      const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const filePath = path.resolve(publicDir, relative);
      const check = path.relative(publicDir, filePath);
      if (check.startsWith('..') || path.isAbsolute(check)) {
        sendJson(res, 403, { error: 'Forbidden' });
        return;
      }
      await serveFile(req, res, filePath);
    } catch (error) {
      if (res.headersSent) {
        res.end();
        return;
      }
      if (error instanceof HttpError) sendJson(res, error.status, { error: error.message });
      else if (error instanceof ServiceError) sendJson(res, error.status, { error: error.message });
      else {
        logger?.error('request failed', { path: pathname, error: error.message });
        sendJson(res, 500, { error: 'Internal server error' });
      }
    }
  };
}
