/** Minimal Server-Sent Events hub: many browser tabs, one producer. */

export function createEventHub({ heartbeatMs = 15000 } = {}) {
  const clients = new Set();

  function write(res, event, data) {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  return {
    get size() {
      return clients.size;
    },

    /** Attach an HTTP response and keep it open. Returns a detach function. */
    add(req, res) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
      res.write(': connected\n\n');
      clients.add(res);

      const heartbeat = setInterval(() => {
        try {
          res.write(': ping\n\n');
        } catch {
          /* closed socket — cleaned up below */
        }
      }, heartbeatMs);
      heartbeat.unref?.();

      const detach = () => {
        clearInterval(heartbeat);
        clients.delete(res);
      };
      req.on('close', detach);
      res.on('close', detach);
      return detach;
    },

    broadcast(event, data) {
      const bulk = event === 'message' || event === 'published';
      for (const res of [...clients]) {
        // A slow tab must not grow the service's memory: drop bulk frames, keep status frames.
        if (bulk && res.writableLength > 512 * 1024) continue;
        try {
          write(res, event, data);
        } catch {
          clients.delete(res);
        }
      }
    },
  };
}
