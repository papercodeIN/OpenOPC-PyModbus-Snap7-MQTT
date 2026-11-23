/** Small, dependency-free static file server plus the server-side TCP bridge API. */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

import { publicConfig } from './config.js';
import { handleApi } from './api.js';

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

const COMMON_HEADERS = Object.freeze({
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Frame-Options': 'DENY',
  'Cache-Control': 'no-store',
  // Local-only page: no remote or inline scripts, WebSockets to the broker only.
  'Content-Security-Policy': [
    "default-src 'none'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' ws: wss:",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join('; '),
});

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    ...COMMON_HEADERS,
    'Content-Type': 'application/json; charset=utf-8',
    ...headers,
  });
  res.end(res.req?.method === 'HEAD' ? undefined : body);
}

export function createStaticServer({ config, logger, appDir = process.cwd(), bridge = null, hub = null }) {
  const publicDir = path.resolve(appDir, 'public');
  const bundlePath = path.resolve(appDir, 'node_modules', 'mqtt', 'dist', 'mqtt.min.js');

  async function serveFile(req, res, filePath) {
    try {
      const data = await fs.readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        ...COMMON_HEADERS,
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Content-Length': data.length,
      });
      res.end(req.method === 'HEAD' ? undefined : data);
      logger?.debug('served file', { path: path.relative(publicDir, filePath) || 'index.html' });
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'EISDIR' || error.code === 'ENOTDIR') {
        send(res, 404, JSON.stringify({ error: 'Not found' }));
      } else {
        logger?.error('file read failed', { path: filePath, error: error.message });
        send(res, 500, JSON.stringify({ error: 'Internal server error' }));
      }
    }
  }

  return http.createServer(async (req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
    } catch {
      send(res, 400, JSON.stringify({ error: 'Malformed URL' }));
      return;
    }

    if (pathname.includes('\0')) {
      send(res, 400, JSON.stringify({ error: 'Malformed URL' }));
      return;
    }

    try {
      if (await handleApi(req, res, pathname, { bridge, hub, config, logger })) return;

      if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.writeHead(405, { ...COMMON_HEADERS, Allow: 'GET, HEAD' });
        res.end();
        return;
      }

      if (pathname === '/config') {
        send(res, 200, JSON.stringify(publicConfig(config)));
        return;
      }

      if (pathname === '/healthz') {
        send(res, 200, JSON.stringify({
          status: 'ok',
          service: 'mqtt-realtime-dashboard',
          uptimeSeconds: Math.round(process.uptime()),
          bridge: bridge ? bridge.getState().state : 'unavailable',
        }));
        return;
      }

      if (pathname === '/vendor/mqtt.min.js') {
        serveFile(req, res, bundlePath).catch((error) => logger?.error('bundle read failed', { error: error.message }));
        return;
      }

      const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
      const filePath = path.resolve(publicDir, relative);
      const relCheck = path.relative(publicDir, filePath);
      if (relCheck.startsWith('..') || path.isAbsolute(relCheck)) {
        logger?.warn('blocked path traversal attempt', { path: pathname });
        send(res, 403, JSON.stringify({ error: 'Forbidden' }));
        return;
      }

      serveFile(req, res, filePath).catch((error) => logger?.error('file read failed', { error: error.message }));
    } catch (error) {
      logger?.error('request failed', { path: pathname, error: error.message });
      if (!res.headersSent) send(res, 500, JSON.stringify({ error: 'Internal server error' }));
      else res.end();
    }
  });
}
