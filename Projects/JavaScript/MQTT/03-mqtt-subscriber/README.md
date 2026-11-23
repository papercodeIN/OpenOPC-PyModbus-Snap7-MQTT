# Application 3 — MQTT Subscriber

Streams MQTT messages into a browser UI. A small local Node.js service holds one **MQTT subscription over TCP** (the normal 1883 listener — no broker WebSocket support required) and pushes every message to the page over Server-Sent Events. Multiple tabs share the same stream. The original headless CLI is still included.

The UI uses the shared **MQTT Control Room** theme, with content specific to subscribing: a live stream table, a message inspector, topic-filter management and an activity log.

## Requirements

- Node.js 22+ LTS (tested with Node v24.20.0) and npm 10+
- An MQTT 3.1.1 broker reachable over TCP (1883, or 8883 with TLS)

## Quick start (Windows)

Double-click **`run.bat`**:

```
  ==============================================================
    MQTT CONTROL ROOM  /  03  MQTT SUBSCRIBER
  ==============================================================
  [ok] Node.js 24.20.0 detected.
  [ok] Created .env from .env.example - edit it for broker defaults.
  [ok] Dependencies present.

  Which port should this service use?
  The page will be served at http://127.0.0.1:PORT  -  press Enter for 8082.

  Port [8082]:
```

The launcher verifies Node.js 22+, bootstraps `.env`, installs dependencies when missing, validates the port, warns if it is already in use, opens the page, and never closes before showing an error.

Other entry points:

```powershell
npm install
npm start                      # http://127.0.0.1:8082
node server.js --help          # options: --http-port, --host, --log-level
npm test
npm run start:cli -- --help    # headless console subscriber
```

`run.bat 8083` skips the prompt. `manage-task.ps1` registers `MQTT-Subscriber-Production` with `-Port <service-port>`.

## Using the UI

1. **Connection** — broker host/port (default `127.0.0.1:1883`), TLS, client ID, username/password, **Keep alive, Connect timeout, Reconnect period**, Subscription QoS, **Payload handling (JSON or Raw)** and the initial topic filters → **Connect**.
2. **Live Stream** — every message appears newest-first with time, topic, QoS, size and a payload preview. Click a row to inspect it. The local topic filter narrows the view without touching the subscription; **Pause** freezes rendering (new messages are still counted) and **Clear** empties the view.
3. **Inspector** — full payload; valid JSON is pretty-printed when parsing is enabled, otherwise the raw text is shown. Copy takes the raw payload.
4. **Topics** — add or remove filters while connected; changes are applied immediately (removed filters are unsubscribed). One Subscription QoS applies to all filters, matching the CLI.
5. **Activity** — connection changes, subscription updates and errors for the service session.

The service keeps the last 200 messages, so reloading the page restores the recent stream.

## Configuration (`.env`)

Copy `.env.example` to `.env`. Invalid values abort startup with an actionable message. `.env` is git-ignored.

| Variable | Default | Meaning |
|---|---|---|
| `HTTP_HOST`, `HTTP_PORT` | `127.0.0.1`, `8082` | Browser UI/API bind address and port |
| `ALLOW_REMOTE` | `false` | Required `true` before `HTTP_HOST` may be a non-loopback address |
| `MQTT_HOST`, `MQTT_PORT` | `127.0.0.1`, `1883` | Broker TCP endpoint |
| `MQTT_CLIENT_ID` | *(auto)* | Client ID; blank generates `mqtt-sub-xxxxxxxx` |
| `MQTT_USERNAME`, `MQTT_PASSWORD` | *(empty)* | Optional credentials |
| `MQTT_TOPICS` | `sensors/#` | Comma-separated filters (`#` and `+` allowed, 50 max) |
| `MQTT_QOS` | `0` | Subscription QoS, applied to every filter |
| `MQTT_USE_TLS` | `false` | Use `mqtts` (usually 8883) |
| `MQTT_CA_FILE`, `MQTT_CERT_FILE`, `MQTT_KEY_FILE` | *(empty)* | TLS material; cert and key must be supplied together |
| `MQTT_TLS_INSECURE` | `false` | Disable certificate validation (explicit, insecure) |
| `MQTT_KEEPALIVE`, `MQTT_CONNECT_TIMEOUT`, `MQTT_RECONNECT_PERIOD` | `60`, `15000`, `5000` | Client timing |
| `MQTT_PAYLOAD_MODE` | `json` | `json` (parse + pretty-print) or `raw` (exactly as received) in the inspector |
| `MQTT_MAX_PAYLOAD_CHARS` | `512` | Display truncation for the CLI formatter |
| `MQTT_LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |

Environment variables override `.env`; `--http-port`, `--host` and `--log-level` override both.

Credentials entered in the page are held by the local service in memory for the connection only. They are never written to disk or logged. The service binds to `127.0.0.1` by default and rejects non-loopback `Host` headers.

## HTTP API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Subscriber UI |
| `GET` | `/api/config` | `{httpPort, defaults}` — no credentials |
| `GET` | `/api/state` | Connection state, topics, counters |
| `GET` | `/api/history` | Last 200 messages and recent log lines |
| `POST` | `/api/connect` | `{host, port, tls, username, password, clientId, topics, qos}` |
| `POST` | `/api/subscribe` | `{topics, qos}` — replace filters while connected |
| `POST` | `/api/disconnect` | Close the connection |
| `GET` | `/api/events` | SSE: `state`, `log`, `message` |
| `GET` | `/healthz` | `{status, service, uptimeSeconds}` |

Message frames carry both `text` and `payloadBase64`, so non-UTF-8 payloads are not corrupted in transit.

## Production notes

- **Reconnect.** The service retries every `MQTT_RECONNECT_PERIOD` ms (default 5 s) and resubscribes automatically; the UI and `/healthz` distinguish `connected`, `connecting`, `offline` and `closed`.
- **Buffering.** The last 200 messages are kept in memory so a page reload does not lose the recent stream. Slow browser tabs are skipped for message frames instead of growing process memory.
- **Health.** `GET /healthz` returns `{status, service, uptimeSeconds, broker:{connected,status,url,topics}}` — poll `broker.connected` for readiness.
- **Exposure.** The UI and live stream bind to loopback. A non-loopback `HTTP_HOST` is refused unless `ALLOW_REMOTE=true`, because the stream exposes every subscribed payload.
- **Process supervision.** `manage-task.ps1` registers a Task Scheduler entry with no execution limit; the process handles SIGINT/SIGTERM/SIGBREAK, logs uncaught exceptions and exits non-zero so the supervisor restarts it.
- **Dependencies.** `npm audit --omit=dev` reports 0 vulnerabilities; `mqtt` is pinned exactly.

## Headless CLI

```powershell
node index.js --help
node index.js 1884 --topic sensors/# --qos 1
node index.js --host 127.0.0.1 --port 1883 --topic 'a/+/c'
```

A bare number is the **broker port** for the CLI (the web service uses `--http-port`). Press Ctrl+C to disconnect gracefully.

## Theme

- `public/css/theme.css` — MQTT Control Room design system, a byte-identical copy in each project; this app loads only its own file.
- `public/css/app.css` — subscriber content: stream table, inspector, selection state.

## Project structure

```
03-mqtt-subscriber/
  run.bat                     interactive launcher (asks for the port)
  server.js                   web service entry point
  index.js                    headless CLI entry point
  src/app.js                  static files, API routes, SSE
  src/service.js              connection + subscription orchestration
  src/subscriber.js           MQTT client wrapper (subscribe, resubscribe, reconnect)
  src/config.js               validation (.env, CLI, page input)
  src/formatter.js            console formatting for the CLI
  src/logger.js               JSON-lines logger with redaction
  src/event-hub.js            SSE fan-out
  src/open-browser.js         opens the page after listen
  public/index.html           subscriber UI
  public/css/theme.css        shared theme
  public/css/app.css          subscriber-specific styles
  public/js/app.js            UI logic
  test/*.test.js              node:test suites
```

## Tests

```powershell
npm test
```

42 tests, all passing:

- Config validation and topic-filter grammar (wildcards, duplicates, limits)
- MQTT wrapper: connect/subscribe, reconnect events, message forwarding, failed-handshake recovery
- Service: connect validation, message encoding, subscription updates, disconnect
- HTTP API: history, connect/subscribe, status codes, SSE, host guard
- CLI formatter behavior (JSON, plain text, truncation)

## Not verified

- A live TLS (`mqtts`) connection with a real certificate chain was not performed.
- Broker authentication/ACLs and QoS 2 delivery were not exercised end to end.
- Very high message rates and multi-hour stability were not tested.
- Messages are in memory only (last 200); there is no persistence or replay across service restarts.
