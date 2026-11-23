# Application 1 — Real-Time MQTT Dashboard

Browser dashboard for live MQTT telemetry. It runs as a small local web service with **two transports**:

| Transport | How it works | Broker requirement |
|---|---|---|
| **TCP** (default) | This local Node.js service opens a normal MQTT/TCP connection (usually port 1883) and streams messages to the page over Server-Sent Events. | Any MQTT 3.1.1 broker. No WebSocket listener needed. |
| **WebSocket** (optional) | The page connects directly to the broker with `mqtt.min.js` over `ws://` / `wss://`. | The broker must expose a WebSocket listener (e.g. Mosquitto `protocol websockets`). |

The TCP path exists because browsers cannot open raw TCP sockets. It is the recommended default: it works with a stock broker, keeps credentials out of page storage, and behaves like every other MQTT client on the network.

The visual design is the shared **MQTT Control Room** theme used by the other two applications in this suite.

## Requirements

- Node.js 22+ LTS (developed and tested with Node v24.20.0) and npm 10+
- An MQTT broker reachable over TCP (1883), or a WebSocket listener (9001) if you choose that transport
- A modern browser with ES modules, `EventSource` and Canvas

## Quick start (Windows)

Double-click **`run.bat`**. It asks which port the dashboard should listen on, then starts the service and opens the page:

```
  ==============================================================
    MQTT CONTROL ROOM  /  01  REAL-TIME DASHBOARD
  ==============================================================
  [ok] Node.js 24.20.0 detected.
  [ok] Dependencies present.

  Which port should this service use?
  The page will be served at http://127.0.0.1:PORT  -  press Enter for 8080.

  Port [8080]: 8081
```

The launcher checks Node.js (22+), creates `.env` from `.env.example` on first run, installs dependencies if `node_modules` is missing, rejects non-numeric and out-of-range ports, warns when the port is already in use, and always pauses before closing so errors stay readable.

You can also pass the port directly (`run.bat 8081`) or start the server yourself:

```powershell
npm install
Copy-Item .env.example .env        # optional: edit broker defaults
npm start                          # http://127.0.0.1:8080
node server.js --help              # all options
npm test                           # built-in node:test suite
```

`manage-task.ps1` registers the Task Scheduler task `MQTT-Dashboard-Production` for the current interactive user (no credentials stored): `powershell -ExecutionPolicy Bypass -File .\manage-task.ps1 -Action Register -Port 8081`.

## Using the dashboard

Open the page and press **Connect**.

- **TCP** — enter the broker host and port (defaults `127.0.0.1:1883`), optional username/password, topic filters and QoS, then Connect. The local service holds the connection; the page receives a live SSE stream. Reloading the page reattaches to the running connection.
- **WebSocket** — enter the `ws://` / `wss://` URL instead. This path never touches the local service's broker connection.

Both transports share the same message feed, chart, metric cards and event log, so switching is a matter of changing the transport field.

Tabs: **Live View** (stat cards, time-series chart, message feed), **Configuration** (transport, broker, topics, parsing), **Event Log**, **About** (runtime facts and verification status).

Numeric fields in valid JSON payloads become chartable metrics (nested paths such as `nested.temperature` are supported). Plain text and malformed JSON are still shown with a `TEXT`/`ERROR` badge and are never dropped.

### Local simulation

Enable **Simulate sample data locally** in Configuration and press Connect. Synthetic JSON payloads are generated inside the browser only — no network connection, nothing published. Useful for checking the UI without a broker.

## Configuration

### Server (`.env`)

Copy `.env.example` to `.env`. All values are validated at startup; an invalid value aborts with an actionable message. `.env` is git-ignored.

| Variable | Default | Meaning |
|---|---|---|
| `HOST`, `PORT` | `127.0.0.1`, `8080` | Local web service bind address and port |
| `ALLOW_REMOTE` | `false` | Required `true` before `HOST` may be a non-loopback address |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` (JSON lines on stdout) |
| `DEFAULT_TRANSPORT` | `tcp` | `tcp` or `websocket` — pre-selected in the page |
| `MQTT_HOST`, `MQTT_PORT` | `127.0.0.1`, `1883` | Broker TCP endpoint (legacy `BROKER_HOST` / `BROKER_PORT` also work) |
| `MQTT_USE_TLS` | `false` | Use `mqtts` (usually 8883) (legacy `BROKER_TLS`) |
| `MQTT_PAYLOAD_MODE` | `json` | `json` (parse + chart metrics) or `raw` (text only) in the page |
| `BROKER_WS_URL` | `ws://127.0.0.1:9001/mqtt` | WebSocket default; `ws://` or `wss://` without credentials (alias `MQTT_WS_URL`) |
| `MQTT_TOPICS` | `sensors/#` | Comma-separated topic filters pre-filled in the page (legacy `DEFAULT_TOPICS`) |
| `MQTT_QOS` | `0` | Default subscription QoS (legacy `DEFAULT_QOS`) |
| `MQTT_KEEPALIVE`, `MQTT_CONNECT_TIMEOUT`, `MQTT_RECONNECT_PERIOD` | `60`, `15000`, `5000` | Client timing (s, ms, ms) |
| `MAX_MESSAGES`, `MAX_HISTORY_POINTS` | `200`, `120` | Feed and chart history limits |
| `MQTT_CLIENT_ID_PREFIX` | `mqtt-dash-` | Prefix for auto-generated client IDs (legacy `CLIENT_ID_PREFIX`) |

Environment variables override `.env`. Command-line flags override both: `--port`, `--host`, `--log-level`.

The broker form is the same as in the publisher and subscriber: **Broker host, Broker port, TLS, Client ID, Username, Password, Keep alive, Connect timeout, Reconnect period, QoS**, plus the dashboard-only transport selector and WebSocket URL.

### Page

All connection settings are editable in the page and validated before connecting: host/port or WebSocket URL, client ID (blank = auto), optional username/password, keep alive, reconnect period, connect timeout, QoS, up to 50 topic filters and **Payload handling (JSON or Raw)**. Non-secret settings persist in `localStorage`; **the password is never saved**. Changing Payload handling applies immediately and clears the feed so parsed and raw messages are never mixed.

In TCP mode the username and password are posted to this local service over loopback and held in memory for the lifetime of the connection. They are never written to disk and never logged. The service binds to `127.0.0.1` by default and rejects requests whose `Host` header is not loopback (DNS-rebinding guard).

## HTTP API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Dashboard page |
| `GET` | `/config` | Browser-safe default configuration |
| `GET` | `/api/state` | Current TCP bridge state |
| `POST` | `/api/broker/connect` | `{host, port, tls, username, password, clientId, topics, qos, keepalive, connectTimeout}` |
| `POST` | `/api/broker/subscribe` | `{topics}` — replace the active filters |
| `POST` | `/api/broker/disconnect` | Close the bridge connection |
| `GET` | `/api/stream` | Server-Sent Events: `status`, `message`, `event` |
| `GET` | `/healthz` | `{status, service, bridge}` |
| `GET` | `/vendor/mqtt.min.js` | Pinned MQTT browser bundle (WebSocket mode only) |

Example (PowerShell 5.1):

```powershell
$body = '{"host":"127.0.0.1","port":1883,"topics":[{"filter":"sensors/#","qos":0}]}'
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8080/api/broker/connect `
  -ContentType 'application/json' -Body $body
```

## Production notes

- **Transport.** TCP is handled by the local service, so a stock broker works. The bridge reconnects automatically at `RECONNECT_PERIOD` and reports `connected` / `connecting` / `offline` / `disconnected` to the page and `/healthz`.
- **Health.** `GET /healthz` returns `{status, service, uptimeSeconds, bridge}` — `bridge` is the bridge state (`connected`, `offline`, …).
- **Exposure.** The page and bridge API bind to loopback. A non-loopback `HOST` is refused unless `ALLOW_REMOTE=true`; the API can change subscriptions and receives broker credentials, so do not expose it casually.
- **Process supervision.** `manage-task.ps1` registers a Task Scheduler entry; the process handles SIGINT/SIGTERM/SIGBREAK, logs uncaught exceptions and exits non-zero so a supervisor can restart it.
- **Dependencies.** `npm audit --omit=dev` reports 0 vulnerabilities; `mqtt` is pinned exactly.

## Theme

The stylesheet is split into two layers:

- `public/css/theme.css` — the MQTT Control Room design system (tokens, shell, panels, tables, forms, toasts). **A byte-identical copy ships in each of the three projects**; this app loads only its own copy and has no dependency on the others.
- `public/css/dashboard.css` — this project's content (chart, metric cards, payload badges, about layout).

`public/css/style.css` remains as a deprecated `@import` shim for old links.

## Project structure

```
01-realtime-dashboard/
  run.bat                     interactive launcher (asks for the port)
  server.js                   web service entry point
  src/config.js               .env parsing/validation + browser-safe defaults
  src/logger.js               JSON-lines logger with redaction
  src/static-server.js        static files, /config, /healthz, API dispatch
  src/api.js                  TCP bridge API + SSE endpoint
  src/broker-bridge.js        MQTT-over-TCP bridge (server side)
  src/event-hub.js            SSE fan-out
  src/open-browser.js         opens the page after listen (MQTT_OPEN=1)
  public/index.html           dashboard markup
  public/css/theme.css        shared theme (identical in all projects)
  public/css/dashboard.css    dashboard-specific styles
  public/js/config.js         browser validation/persistence, transport switch
  public/js/mqtt-client.js    WebSocket client
  public/js/server-client.js  TCP bridge client (fetch + EventSource)
  public/js/payload.js        JSON parsing + numeric metric extraction
  public/js/store.js          bounded message buffer/statistics
  public/js/charts.js         dependency-free canvas chart
  public/js/ui.js             DOM rendering (untrusted values via textContent)
  public/js/app.js            wiring
  broker/mosquitto.conf.example
  test/*.test.js              node:test suites
```

## Tests

```powershell
npm test
```

50 tests, all passing:

- Server config validation, `.env` parsing, browser-safe projection
- Static server: MIME, 404/405, path traversal, CSP, `/healthz`, HEAD
- TCP bridge: input validation, connect/subscribe, base64 messages, failed-handshake recovery, disconnect
- Bridge API: JSON content-type enforcement, malformed bodies, 502 on broker failure, SSE initial frame
- Payload parsing, message store, chart data limits

## Not verified

- A live TLS (`mqtts` / `wss`) connection against a real certificate chain was not performed.
- Broker authentication, ACLs and QoS 2 exactly-once delivery were not exercised end to end.
- High message rates, long-running stability and mobile devices were not tested.
- The WebSocket transport path was not exercised against a broker WS listener in this environment (TCP was verified end to end).
- Messages are kept in memory only: no persistence, no replay, no publishing from this application.
