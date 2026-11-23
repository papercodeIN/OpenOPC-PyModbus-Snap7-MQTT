# Audit — MQTT Control Room (applications 01–03)

Date: 2026-11-23
Scope: `01-realtime-dashboard`, `02-mqtt-publisher`, `03-mqtt-subscriber`
Baseline before changes: `npm test` green in all three (33 / 21 / 24 tests)

## Verdict

The code quality was reasonable — validation, redaction, tests and docs were already better than typical demos — but the **operator experience was broken**, and two of the three projects had no service to put on a port at all:

1. `run.bat` never asked for a port; it only forwarded whatever argument it was given.
2. Error paths ended in `exit /b 1` with no `pause`, so double-clicking a failing launcher closed the window before the message could be read.
3. The publisher exits after a single publish by design, so even a *successful* run closed instantly — indistinguishable from a crash.
4. "The port on which we run the service" was undefined for 02/03: they had no HTTP surface, and a bare number meant the *broker* port.
5. Only the dashboard had a UI, and it could only speak MQTT over WebSockets — it could not use the normal TCP listener at all.
6. There was no shared theme layer: one 27 KB stylesheet mixed design tokens with dashboard content, and the other two projects had no visual identity.

All six are fixed, and the fixes are covered by tests or reproduced end to end below.

## Findings

### Critical

**C1. Launchers did not prompt for a service port.**
Original `run.bat` (a short stub, identical in all three) ended with `node server.js %*`. There was no `set /p`, no default, no validation. Double-clicking passed no arguments, so the default port was used silently — and for 02/03 a bare argument meant the broker port instead.

*Impact:* the documented workflow ("run.bat asks me which port") did not exist.
*Fix:* one launcher template in all three projects that asks for the port, shows the default and the URL it will serve, validates digits and the 1–65535 range, re-prompts on bad input, and warns when the port already has a listener. `run.bat 8090` keeps automation working.

**C2. Windows closed before errors were readable.**
Every failure path was `exit /b 1`; nothing paused. `npm install` failures were reduced to a single line after `>nul 2>&1`.

*Impact:* "some of them close immediately without doing anything" — exactly the reported symptom.
*Fix:* every terminal path (success, service exit, missing Node, old Node, missing npm, install failure) prints a diagnosis and `pause`s. Install output is now visible.

**C3. Publisher "success" also closed instantly.**
`run()` published one message, logged `publish run complete`, returned 0 and the window vanished. With `MQTT_QUIET=1` the startup banner was suppressed too.

*Impact:* a working one-shot publish looked like a crash; nothing told the user what had happened.
*Fix:* the publisher is now a web service; a publish is an explicit UI action with visible result, counters and history. The CLI still exits after one publish (correct for scripting) but the launcher no longer runs the CLI.

### High

**H1. No service surface in 02/03, so "the port of the service" was meaningless.**
There was no HTTP server, no page, no health endpoint. A numeric CLI argument (`run.bat 1884`) set `MQTT_PORT`, not a listening port.

*Fix:* both projects now run a local service (`server.js`) with a UI, JSON API and SSE. `--http-port` (or the launcher prompt) is the service port; the CLI keeps its old meaning and its old entry point (`index.js`).

**H2. The dashboard could not use MQTT over TCP.**
`public/js/mqtt-client.js` used `mqtt.connect(wsUrl)`, and the README correctly warned that 1883 cannot be used from a browser — but that left the TCP requirement unmet.

*Fix:* added `src/broker-bridge.js` + `src/api.js` + `src/event-hub.js` and a browser client (`public/js/server-client.js`), plus a transport switch in Configuration. TCP is the default; the WebSocket path is retained as an option and is unchanged apart from validation.

**H3. A failed MQTT handshake bricked the client object.**
In `02/src/publisher.js` and `03/src/subscriber.js`, `connect()` rejected on `error`/timeout without clearing `this.client`. Every later attempt threw `Already connected — disconnect before reconnecting` until the process restarted — fatal for a long-running service.

*Fix:* the failure path now clears the client, ends it and rejects; a regression test (`connect rejects on broker error and on timeout`, plus new service tests) covers retry after failure.

### Medium

**M1. Dashboard port-in-use errors were opaque.**
`server.on('error')` emitted a JSON log line and set `process.exitCode`; no human message, no explicit exit.

*Fix:* explicit `EADDRINUSE` / `EACCES` messages with a concrete next command (`run.bat 8081`), and `process.exit(1)` so the launcher can report it.

**M2. No CSP and no health endpoint.**
The static server sent four headers; there was no Content-Security-Policy and no way to check liveness.

*Fix:* a strict CSP (`default-src 'none'`, `script-src 'self'`, `connect-src 'self' ws: wss:`, `frame-ancestors 'none'`) on every response, plus `/healthz` in all three services.

**M3. Theme was not a layer.**
`01/public/css/style.css` was 27,124 bytes combining tokens, shell and dashboard content. 02/03 had no styling at all.

*Fix:* split into `theme.css` (22,691 bytes, byte-identical in all three) and per-project `dashboard.css` / `app.css`. `tools/check-theme.mjs` fails if the copies drift. `style.css` remains a 344-byte `@import` shim for old links.

**M4. `.env` was never bootstrapped.**
First runs silently used code defaults; `.env.example` was documentation only.

*Fix:* the launcher copies `.env.example` to `.env` when missing and says so.

### Low

**L1. Duplicated infrastructure across projects.** `config.js`, `logger.js` and the validation rules exist three times. This is deliberate — each folder stays standalone — but it is a drift risk. Only the theme is hash-checked; the JavaScript copies are not.

**L2. CLI passwords on the command line.** `--password` is visible in process lists and shell history. Docs say to prefer `.env`; the flag remains for scripting convenience. No change made.

**L3. No tests for the HTTP/API layer.** Coverage stopped at config, MQTT wrappers and the browser modules.

*Fix:* 65 new tests across the three projects (19 + 25 + 21) covering the bridge, services, API routes, SSE, host guard, CSP, connection state and timeouts.

**L4. Documentation described the old (WebSocket-only, no-service) design.** All three READMEs were rewritten; a suite README and this audit were added.

## Still worth doing (not in this change)

- **Authentication and TLS**: verify `mqtts` with a real CA chain and mutual TLS, and test broker ACLs. Only the code paths and unit tests exist today.
- **Persistence**: all three keep data in memory. A short SQLite or CSV log would make the subscriber useful for incident review.
- **Deployment**: no container or Windows service packaging; `manage-task.ps1` covers Task Scheduler only.
- **Observability**: `/healthz` exists, but there are no metrics or log rotation.
- **WebSocket path**: kept in the dashboard for brokers that expose a WS listener, but it was not exercised against a real WS endpoint in this environment.
- **Shared JavaScript package**: if the three projects ever need to evolve together, extract `config.js`/`logger.js` into a small workspace package instead of copying.

## What changed

| Area | Change |
|---|---|
| Launchers | `run.bat` rewritten in all three: port prompt with default, validation, port-in-use warning, Node 22+ check, npm check, visible install, `.env` bootstrap, actionable errors, `pause` on every exit |
| Publisher | New `server.js`, `src/app.js`, `src/service.js`, UI (`public/`), HTTP API, SSE, burst mode; CLI preserved |
| Subscriber | New `server.js`, `src/app.js`, `src/service.js`, UI, HTTP API, SSE, live history; CLI preserved; `setSubscriptions` added to the MQTT wrapper |
| Dashboard | TCP bridge (`src/broker-bridge.js`, `src/api.js`, `src/event-hub.js`), transport switch (`server-client.js`, updated `config.js`/`app.js`/`ui.js`), CSP, `/healthz`, friendly port errors, `--help` |
| Theme | `theme.css` (shared) + `dashboard.css` / `app.css` (content), `tools/check-theme.mjs` |
| Config | `HTTP_HOST`/`HTTP_PORT` for 02/03; `BROKER_HOST`/`BROKER_PORT`/`BROKER_TLS`/`DEFAULT_TRANSPORT` for 01; `.env.example` rewritten in all three |
| Tasks | `manage-task.ps1` now starts `server.js` with `--http-port`, unlimited run time |
| Tests | 01: 33 → 52, 02: 21 → 46, 03: 24 → 45 |
| Docs | Three READMEs rewritten, suite README, this audit |

## Round 2 — production hardening

The first pass fixed the operator experience. A second pass closed the gaps that would have hurt in unattended use:

| Finding | Impact | Fix |
|---|---|---|
| `connected` meant "a client object exists" | A dead broker still looked healthy; monitoring and the UI lied | The wrappers now track the real session (`connected`/`connecting`/`offline`/`closed`); state, UI and `/healthz` use it |
| Publisher did not reconnect by default | Any broker restart broke publishing until the process was restarted | `MQTT_RECONNECT_PERIOD` defaults to 5000 ms; the session survives and resubscribes |
| A publish on a dead socket could hang forever | HTTP requests and bursts stalled indefinitely | Publish is bounded by `MQTT_PUBLISH_TIMEOUT` (10 s) with a clear `ETIMEDOUT` error |
| Non-loopback bind was accepted silently | Anyone on the LAN could publish or read payloads | `ALLOW_REMOTE=true` is now required for a non-loopback `HOST`/`HTTP_HOST`; startup fails with an explanation otherwise |
| Uncaught errors left a half-dead process | Supervisor saw a running process with a broken service | `uncaughtException` / `unhandledRejection` are logged and exit 1; SIGBREAK handled |
| SSE writes ignored backpressure | A stalled tab could grow service memory | Message frames are skipped above 512 KB of buffered output; status frames still flow |
| Subscriber UI implied per-topic QoS | Chips showed QoS values the service ignored (one QoS applied to all) | Single "Subscription QoS (all filters)" selector; chips show only the filter |
| Health checks only proved the HTTP server was alive | A disconnected service looked ready | `/healthz` now includes `broker.connected`, `status`, `url` (and topic count) |
| Dashboard bridge stayed at `reconnecting` after a successful reconnect | The page showed a stale warning while data was flowing | A persistent connect handler restores `connected`, replays subscriptions and clears the stale error |
| Subscriber counters stayed at 0 while messages streamed in | The message list and rate updated, but RECEIVED / LAST (pills and cards) only refreshed on connect/disconnect frames | Message frames now carry `received` and `lastMessageAt`; the page updates those four fields per frame |

## Round 3 — configuration parity

| Finding | Impact | Fix |
|---|---|---|
| The three broker forms had different fields | Keep alive / connect timeout / reconnect period existed only in the dashboard and in `.env`; users could not tune them per connection elsewhere | All three now show **Broker host, Broker port, TLS, Client ID, Username, Password, Keep alive, Connect timeout, Reconnect period** in the same order with the same defaults, and the publisher/subscriber send them on connect |
| Payload handling was inconsistent (switch vs select, "plain text" vs "raw") | The JSON/raw choice was hard to find and meant different things by name | One **Payload handling** select with **JSON / Raw** in all three, applied to send / display / chart semantics |
| `.env` names differed (`BROKER_*`, `JSON_PARSING`, `MQTT_JSON_PARSING`) | Configuration could not be copied between apps | Shared `MQTT_*` names plus `MQTT_PAYLOAD_MODE`; the dashboard still accepts its legacy names |
| The shared `MQTT_PAYLOAD_MODE` overrode a per-message Raw choice | Selecting Raw in the publisher still serialized JSON | An explicit per-message / per-page setting now wins; regression tests cover it |
| Changing dashboard payload handling only took effect after reconnecting | Switching to Raw left previously parsed metrics in the chart | The mode applies immediately and clears the feed so parsed and raw data are never mixed |

## Verification

Commands were run from each project folder.

```
01-realtime-dashboard   npm test   →  52 pass, 0 fail
02-mqtt-publisher       npm test   →  46 pass, 0 fail
03-mqtt-subscriber      npm test   →  45 pass, 0 fail
node tools/check-theme.mjs         →  identical theme in 3 projects
npm audit --omit=dev (02, 03)      →  0 vulnerabilities
```

Launcher transcripts (piped input, real console window):

```
02: Port [8081]: 8094 → service on http://127.0.0.1:8094, /healthz → {"status":"ok","service":"mqtt-publisher"}
03: Port [8082]: 8095 → service on http://127.0.0.1:8095, /healthz → {"status":"ok","service":"mqtt-subscriber"}
01: Port [8080]: 8099 → service on http://127.0.0.1:8099, /healthz → {"status":"ok","service":"mqtt-realtime-dashboard"}
```

Live broker test (broker already listening on `127.0.0.1:1883`):

1. Publisher service connected over TCP: `{"connected":true,"broker":{"url":"mqtt://127.0.0.1:1883"}}`.
2. A message published from the publisher **page** appeared in `GET /api/history` of the subscriber service (`sensors/ui/test`, 34 bytes).
3. The same message reached the dashboard's TCP bridge: `received: 1`, feed row rendered, two numeric metric cards created from `{"temperature":26.4,"humidity":49}`.
4. Page state in all three tabs reported `TCP LIVE` and `CONNECTED` after reload (dashboard reattaches to the running bridge).

Broker-loss test (TCP proxy in front of the real broker, proxy killed and restarted):

1. Publisher connected through the proxy: `{"connected":true,"status":"connected"}`; `/healthz` agreed.
2. Proxy killed → `{"connected":false,"status":"offline","hasSession":true}` within seconds; the UI switches to `OFFLINE` / `TCP RETRY`.
3. Proxy restarted → status returned to `connected` without restarting the service; a QoS 1 publish to `prod/reconnect/check` succeeded.
4. Subscriber connected through the same proxy, received `prod/one`, lost the connection, reconnected, **resubscribed** and received `prod/two` (`received: 2`).
5. Dashboard bridge: same proxy cut → `offline`, then `connected` again and it received the next message (`received: 2`); the stale error is cleared on reconnect.

Configuration parity test:

1. Rendered pages for all three apps expose the same nine broker labels and a `cfg-payload-mode` control (asserted in each test suite).
2. Publisher connected with `keepalive 30 / timeout 8000 / reconnect 2000` and published the same text twice: Raw sent 8 bytes (`{"a": 1}`), JSON sent 7 bytes (`{"a":1}`), proving the mode really changes the wire payload.
3. Subscriber inspector showed pretty-printed JSON in JSON mode and the exact original `{"a": 1, "b": 2}` in Raw mode.
4. Dashboard produced 2 metric cards in JSON mode and 0 cards with the payload shown as `TEXT` in Raw mode; switching modes cleared the feed.

## Residual risks

- TLS, client certificates, broker authentication and ACLs were not tested against a real broker. The code paths (CA/cert/key, `rejectUnauthorized`, page input that cannot disable verification) are unit-tested only.
- The dashboard WebSocket transport was not exercised against a broker WS listener; its unit tests still pass but the live path is unverified.
- Message throughput was tested at low volume (single publishes, short bursts, three-message streams). No load, soak or multi-hour test was performed.
- Persistence is out of scope: the subscriber keeps the last 200 messages in memory only.
- `manage-task.ps1` was updated but not registered; Task Scheduler requires an interactive logon and was out of scope.
- `[OLD]/` was left untouched and is not part of the suite.
