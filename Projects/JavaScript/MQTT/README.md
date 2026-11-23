# MQTT Control Room — three applications, one theme

> **Notice:** The projects inside this folder are **not actively updated or monitored** against issues. If you encounter any issues or have questions, please provide the details in the repository [Issues](../../../../issues) section. This project is provided under the **MIT License**, so anyone is free to use it and develop anything based on it.

Three standalone Node.js applications that talk to an MQTT broker and share a single visual language:

| # | Application | Purpose | Default service port | MQTT transport | Its own content |
|---|---|---|---|---|---|
| 01 | `01-realtime-dashboard` | Live telemetry: stat cards, time-series chart, message feed | 8080 | **TCP** (default) or WebSocket (optional) | Charts, metric cards, event log |
| 02 | `02-mqtt-publisher` | Compose and publish messages, bounded bursts, delivery history | 8081 | **TCP** | Composer, burst progress, outbound history |
| 03 | `03-mqtt-subscriber` | Live message stream with inspector and topic management | 8082 | **TCP** | Stream table, payload inspector, subscriptions |

Each folder is self-contained: its own `package.json`, `node_modules`, `run.bat`, tests and README. Nothing is imported across projects, so any one of them can be copied elsewhere and still works.

## Run them

```powershell
cd 01-realtime-dashboard ; .\run.bat     # asks for the port, default 8080
cd 02-mqtt-publisher     ; .\run.bat     # asks for the port, default 8081
cd 03-mqtt-subscriber    ; .\run.bat     # asks for the port, default 8082
```

The launcher checks Node.js 22+, creates `.env` from `.env.example` on first run, installs dependencies if needed, validates the port, opens the page and never closes before an error is readable. `run.bat 8090` skips the prompt; `node server.js --help` lists the flags.

## Why TCP first

Browsers cannot open raw TCP sockets, so each application runs a small local web service that owns the MQTT connection over TCP (port 1883, or 8883 with TLS) and streams events to the page. That works with a stock broker — no `protocol websockets` listener, no extra port. The dashboard additionally keeps a direct browser-WebSocket mode for brokers that expose one; the publisher and subscriber use TCP only, because a browser cannot publish or subscribe to port 1883 by itself.

```
                         +---------------------+
  browser  <--HTTP/SSE--> |  local Node service | <--MQTT/TCP 1883--> broker
                         +---------------------+
```

All services bind to `127.0.0.1` by default, reject non-loopback `Host` headers, and keep broker credentials in memory only.

## One theme, different content

The theme is a real layer, not a copy-paste convention:

- `public/css/theme.css` — design tokens, shell, topbar, sidebar, panels, tables, forms, logs, toasts. **Byte-identical in all three projects.**
- `public/css/dashboard.css` / `public/css/app.css` — only that project's content styles.

Verify the copies never drift:

```powershell
node tools\check-theme.mjs
```

```
Shared theme layer (theme.css)
  01 real-time dashboard   1a40f0b260b58986…   22691 B  identical
  02 mqtt publisher        1a40f0b260b58986…   22691 B  identical
  03 mqtt subscriber       1a40f0b260b58986…   22691 B  identical
[ok] Same theme everywhere, different content per project.
```

## Production readiness

All three services are built to run unattended and to tell the truth about their state:

- **Reconnect.** Publisher and subscriber retry the broker connection every 5 s (configurable), resubscribe automatically, and expose `connected` / `connecting` / `offline` / `closed`. The dashboard bridge does the same.
- **No hung operations.** Publisher publishes time out after 10 s instead of waiting forever on a dead socket.
- **Health checks.** `/healthz` reports the broker state, not just process liveness: `{status, service, uptimeSeconds, broker:{connected,status,url}}`.
- **Binding guard.** The UI/API refuses a non-loopback bind unless `ALLOW_REMOTE=true`; credentials stay in memory and are never logged or persisted.
- **Supervision.** SIGINT/SIGTERM/SIGBREAK shut down gracefully; uncaught errors are logged and exit non-zero so Task Scheduler or another supervisor can restart.
- **Backpressure.** Slow browser tabs drop message frames rather than growing service memory.
- **Dependencies.** `npm audit --omit=dev`: 0 vulnerabilities; `mqtt` pinned to 5.16.1.

## One configuration model

All three applications expose the same broker connection fields, in the same order and with the same defaults:

| Field | Default | Notes |
|---|---|---|
| Broker host | `127.0.0.1` | |
| Broker port | `1883` | `8883` with TLS |
| TLS | off | `mqtts`; certificate verification is always on |
| Client ID | auto | blank generates an id |
| Username / Password | empty | memory only, never written or logged |
| Keep alive | `60` s | |
| Connect timeout | `15000` ms | |
| Reconnect period | `5000` ms | `0` disables automatic recovery |

The dashboard adds a **Transport** selector (TCP through the service, or WebSocket from the browser) and a WebSocket URL; the publisher and subscriber are TCP-only because their connections live in Node.js. Subscription QoS is shown by the dashboard and subscriber; the publisher sets publish QoS per message.

Environment names are shared as well: `MQTT_HOST`, `MQTT_PORT`, `MQTT_USE_TLS`, `MQTT_KEEPALIVE`, `MQTT_CONNECT_TIMEOUT`, `MQTT_RECONNECT_PERIOD`, `MQTT_PAYLOAD_MODE` (plus `MQTT_TOPICS` / `MQTT_QOS` for the subscribers). The dashboard still accepts its legacy `BROKER_*` / `DEFAULT_*` names.

### JSON or Raw everywhere

Every application has the same **Payload handling** choice:

| Application | JSON | Raw |
|---|---|---|
| Publisher | validate and serialize before sending | send the bytes exactly as typed |
| Subscriber | parse and pretty-print in the inspector | show exactly what arrived |
| Dashboard | parse numeric fields into metric cards and charts | show every payload as text, no metrics |

The choice is stored as `MQTT_PAYLOAD_MODE=json|raw`; a per-message or per-page choice overrides the `.env` default.

## Go-live checklist

1. **TLS** — set `MQTT_USE_TLS=true` (or `BROKER_TLS=true` for the dashboard), point `MQTT_CA_FILE` at the broker CA, and add `MQTT_CERT_FILE` + `MQTT_KEY_FILE` for mutual TLS. Certificate verification is on by default and the page cannot disable it.
2. **Least privilege** — create a broker account per application: publish-only on the publisher's topics, subscribe-only on the subscriber/dashboard filters. Put credentials in `.env` (git-ignored) or enter them in the page; they are never written to disk or logs.
3. **Network** — keep `HOST`/`HTTP_HOST` on `127.0.0.1`. If the UI must be reachable remotely, put it behind an authenticated reverse proxy and only then set `ALLOW_REMOTE=true`.
4. **Supervision** — run through `manage-task.ps1` (or another supervisor). A crash exits non-zero; the supervisor restarts it. The broker session reconnects on its own.
5. **Monitoring** — poll `/healthz` every 30–60 s and alert when `broker.connected` is false. The JSON log stream carries every connection change and failure.
6. **Limits** — publisher payloads are capped at 64 KiB, bursts at 100 messages, subscriber history at 200 messages in memory. Size the broker and the host accordingly.

## Verification at a glance

| Check | Result |
|---|---|
| `npm test` in 01 / 02 / 03 | 52 / 46 / 45 passing |
| Launchers (prompt, `.env` bootstrap, chosen port, `/healthz`) | verified on ports 8094–8099 |
| Live TCP publish → broker → subscriber | verified against a real broker on 127.0.0.1:1883 |
| Broker loss and return (TCP proxy cut) | publisher: `offline` → automatic `connected` → QoS 1 publish OK; subscriber: resubscribed and received the next message |
| Dashboard TCP bridge → chart metrics | verified in the browser (JSON payload produced metric cards) |
| Theme hash check | identical |

The audit that produced these changes is in [`AUDIT.md`](AUDIT.md).

## Layout

```
MQTT/
  01-realtime-dashboard/     dashboard service + UI + tests
  02-mqtt-publisher/         publisher service + UI + CLI + tests
  03-mqtt-subscriber/        subscriber service + UI + CLI + tests
  tools/check-theme.mjs      verifies the shared theme layer
  AUDIT.md                   findings, fixes and verification evidence
  [OLD]/                     pre-refactor scripts, kept for reference only
```
