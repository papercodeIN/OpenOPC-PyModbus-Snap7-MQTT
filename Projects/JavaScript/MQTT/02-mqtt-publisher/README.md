# Application 2 — MQTT Publisher

Publishes MQTT messages from a browser UI. A small local Node.js service owns one **MQTT connection over TCP** (the normal 1883 listener — no broker WebSocket support required), and the page drives it over loopback HTTP. The original headless CLI is still included.

The UI uses the shared **MQTT Control Room** theme, with content specific to publishing: a composer, delivery log, bounded burst mode and sent-message history.

## Requirements

- Node.js 22+ LTS (tested with Node v24.20.0) and npm 10+
- An MQTT 3.1.1 broker reachable over TCP (1883, or 8883 with TLS)

## Quick start (Windows)

Double-click **`run.bat`**:

```
  ==============================================================
    MQTT CONTROL ROOM  /  02  MQTT PUBLISHER
  ==============================================================
  [ok] Node.js 24.20.0 detected.
  [ok] Created .env from .env.example - edit it for broker defaults.
  [ok] Dependencies present.

  Which port should this service use?
  The page will be served at http://127.0.0.1:PORT  -  press Enter for 8081.

  Port [8081]:
```

The launcher verifies Node.js 22+, bootstraps `.env`, installs dependencies when missing, validates the port, warns if it is already in use, opens the page, and never closes before showing an error.

Other entry points:

```powershell
npm install
npm start                      # http://127.0.0.1:8081
node server.js --help          # options: --http-port, --host, --log-level
npm test
npm run start:cli -- --help    # headless publisher
```

`run.bat 8082` skips the prompt. `manage-task.ps1` registers `MQTT-Publisher-Production` with `-Port <service-port>`.

## Using the UI

1. **Connection** — broker host/port (default `127.0.0.1:1883`), TLS, client ID, username/password, **Keep alive, Connect timeout, Reconnect period** → **Connect**. The service keeps the TCP connection; the page shows its state live.
2. **Compose** — topic, QoS, **Payload handling (JSON or Raw)**, payload, retain flag → **Publish once**. JSON is validated and serialized; Raw is sent byte-for-byte. Every publish is recorded in the delivery log and the sent-message table.
3. **Burst** — publish the same message N times with a fixed interval (1–100 messages, 1000–60000 ms). Progress is shown and the burst can be stopped at any time; it also stops if a publish fails or the connection is closed.
4. **Activity** — every connection change, publish and validation error for the service session.

Defaults for topic, QoS, retain and payload come from `.env` and are pre-filled in the composer.

## Configuration (`.env`)

Copy `.env.example` to `.env`. Invalid values abort startup with an actionable message. `.env` is git-ignored.

| Variable | Default | Meaning |
|---|---|---|
| `HTTP_HOST`, `HTTP_PORT` | `127.0.0.1`, `8081` | Browser UI/API bind address and port |
| `ALLOW_REMOTE` | `false` | Required `true` before `HTTP_HOST` may be a non-loopback address |
| `MQTT_HOST`, `MQTT_PORT` | `127.0.0.1`, `1883` | Broker TCP endpoint |
| `MQTT_CLIENT_ID` | *(auto)* | Client ID; blank generates `mqtt-pub-xxxxxxxx` |
| `MQTT_USERNAME`, `MQTT_PASSWORD` | *(empty)* | Optional credentials (prefer `.env` over CLI flags) |
| `MQTT_TOPIC` | `demo/publisher` | Composer default topic (no wildcards) |
| `MQTT_QOS`, `MQTT_RETAIN` | `0`, `false` | Composer defaults |
| `MQTT_PAYLOAD_MODE`, `MQTT_PAYLOAD` | `json`, `{"temperature":24.5}` | Composer defaults; `json` is validated and serialized, `raw` is sent as typed |
| `MQTT_KEEPALIVE`, `MQTT_CONNECT_TIMEOUT`, `MQTT_RECONNECT_PERIOD` | `60`, `15000`, `5000` | Client timing; reconnect 0 disables automatic recovery |
| `MQTT_PUBLISH_TIMEOUT` | `10000` | A publish that is not acknowledged in this window fails instead of hanging |
| `MQTT_USE_TLS` | `false` | Use `mqtts` (usually 8883) |
| `MQTT_CA_FILE`, `MQTT_CERT_FILE`, `MQTT_KEY_FILE` | *(empty)* | TLS material; cert and key must be supplied together |
| `MQTT_TLS_INSECURE` | `false` | Disable certificate validation (explicit, insecure) |
| `MQTT_INTERVAL_MS`, `MQTT_MAX_MESSAGES` | `2000`, `10` | Burst defaults |
| `MQTT_LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |

Environment variables override `.env`; `--http-port`, `--host` and `--log-level` override both.

Credentials entered in the page are sent to this local service and held in memory for the connection only. They are never written to disk or logged. The service binds to `127.0.0.1` by default and rejects non-loopback `Host` headers.

## HTTP API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/` | Publisher UI |
| `GET` | `/api/config` | `{httpPort, defaults}` — no credentials |
| `GET` | `/api/state` | Connection state, counters, burst job |
| `GET` | `/api/history` | Recent log lines and published records (page reload) |
| `POST` | `/api/connect` | `{host, port, tls, username, password, clientId}` |
| `POST` | `/api/disconnect` | Close the connection |
| `POST` | `/api/publish` | `{topic, qos, retain, format, payload}` |
| `POST` | `/api/burst` | Same fields plus `{count, intervalMs}` → `202` |
| `POST` | `/api/burst/stop` | Cancel the running burst |
| `GET` | `/api/events` | SSE: `state`, `log`, `published` |
| `GET` | `/healthz` | `{status, service, uptimeSeconds}` |

## Production notes

- **Reconnect.** The service keeps its session and retries every `MQTT_RECONNECT_PERIOD` ms (default 5 s). State reports `connected`, `connecting`, `offline` or `closed`; the UI and `/healthz` show the truth instead of assuming the process is online.
- **Publish timeout.** A publish that is never acknowledged (dead socket, broker stall, unfulfillable QoS) fails after `MQTT_PUBLISH_TIMEOUT` ms instead of hanging the request.
- **Health.** `GET /healthz` returns `{status, service, uptimeSeconds, broker:{connected,status,url}}` — poll `broker.connected` for readiness.
- **Exposure.** The UI and API bind to loopback. A non-loopback `HTTP_HOST` is refused unless `ALLOW_REMOTE=true`, because anyone who can reach the API can publish to your broker.
- **Process supervision.** `manage-task.ps1` registers a Task Scheduler entry with no execution limit; the process handles SIGINT/SIGTERM/SIGBREAK, logs uncaught exceptions and exits non-zero so the supervisor restarts it.
- **Dependencies.** `npm audit --omit=dev` reports 0 vulnerabilities; `mqtt` is pinned exactly.

## Headless CLI

The CLI publishes exactly one message by default and exits — it never starts a web service.

```powershell
node index.js --help
node index.js 1884 --topic sensors/lab/temperature --json-payload '{"t":21.5}'
node index.js --loop --count 5 --interval 2000 --host 127.0.0.1 --port 1883
```

A bare number is the **broker port** for the CLI (the web service uses `--http-port`). Precedence: defaults < `.env` < environment variables < CLI options.

## Theme

- `public/css/theme.css` — MQTT Control Room design system, a byte-identical copy in each project; this app loads only its own file.
- `public/css/app.css` — publisher content: composer, payload metadata, burst progress, sent table.

## Project structure

```
02-mqtt-publisher/
  run.bat                     interactive launcher (asks for the port)
  server.js                   web service entry point
  index.js                    headless CLI entry point
  src/app.js                  static files, API routes, SSE
  src/service.js              connection + publish + burst orchestration
  src/publisher.js            MQTT client wrapper
  src/config.js               validation (.env, CLI, page input)
  src/logger.js               JSON-lines logger with redaction
  src/event-hub.js            SSE fan-out
  src/open-browser.js         opens the page after listen
  public/index.html           publisher UI
  public/css/theme.css        shared theme
  public/css/app.css          publisher-specific styles
  public/js/app.js            UI logic
  test/*.test.js              node:test suites
```

## Tests

```powershell
npm test
```

43 tests, all passing:

- Config validation (ports, topics, payload, TLS files, CLI overrides, redaction)
- MQTT wrapper: options, JSON serialization, QoS/retain, failed-handshake recovery
- Service: connect/publish validation, 409/502 paths, burst bounds and cancellation
- HTTP API: config projection, publish, burst, content-type enforcement, SSE, CSP, host guard
- CLI argument parsing and single-shot/loop behavior

## Not verified

- A live TLS (`mqtts`) connection with a real certificate chain was not performed.
- Broker authentication/ACLs and QoS 2 delivery were not exercised end to end.
- Long-running bursts above a few messages and high publish rates were not stress-tested.
- Retained-message behavior was not verified against a broker with persistence enabled.
