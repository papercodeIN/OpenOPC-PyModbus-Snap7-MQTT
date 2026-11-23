# BACnet <-> MQTT Bridge

A bidirectional gateway between a BACnet/IP network and an MQTT broker, with a
web console for discovery, mapping, live values and writes.

- **BACnet -> MQTT**: every mapped object is read on a scan interval (or pushed
  by COV subscriptions) and published as a raw value or a small JSON object.
- **MQTT -> BACnet**: publish to a command topic and the bridge writes
  `presentValue` on that object, then answers on an ack topic.
- **Web console**: Who-Is discovery, point mapping, live table, command
  composer, activity log, and all settings - no config file editing needed.
- **v2.0 hardening**: optional admin login, broker-outage buffering, rotating
  log file, `/healthz` `/readyz` `/api/metrics` endpoints, packaging, and
  Windows service / systemd / Docker deployment paths.

```
 BACnet/IP devices  ──read──▶  bridge  ──publish──▶  MQTT broker
       ▲                         │                        │
       └─────────write───────────┴────────command─────────┘
```

![The web console with a live device: discovery, mapping, live values and commands](docs/web-console-live.png)

## Capabilities (v2.0)

| Capability | Status |
|---|---|
| Who-Is discovery (incl. cross-port raw probe) | ✅ |
| ReadPropertyMultiple polling, 25 points per request | ✅ |
| COV subscriptions with polling fallback (opt-in) | ✅ |
| MQTT -> BACnet writes with priority 1-16 and ack topics | ✅ |
| Broker-outage buffer (bounded, drains on reconnect) | ✅ |
| Optional admin login on the console | ✅ |
| mTLS client certificates, TLS, env-var secrets | ✅ |
| `/healthz`, `/readyz`, Prometheus `/api/metrics` | ✅ |
| Rotating log file | ✅ |
| Windows (start.bat / scheduled task), systemd, Docker | ✅ |
| BBMD / foreign device registration | ❌ (reachable by address; BAC0 supports BBMD) |
| BACnet/SC (Secure Connect) | ❌ |
| Multi-user authorisation on the console | ❌ (single admin account) |

## Quick start

```powershell
start.bat                      # creates .venv, installs, opens http://127.0.0.1:8000
```

or without the script:

```powershell
python -m pip install -r requirements.txt
python run.py                 # opens http://127.0.0.1:8000
```

1. Press **Start** (the bridge also auto-starts when the console loads).
2. Press **Who-Is** in the left rail, then **Add** the device that answered.
   Routed devices that cannot answer a broadcast can be added by address
   (`192.168.1.50:47808` + instance).
3. Subscribe to `bacnet/#` with any MQTT client to watch the values.

The console stores everything in `config.json` next to `run.py`
(override with the `BACNET_MQTT_CONFIG` environment variable).

## Topic contract

With the default prefix `bacnet` and a device instance `1001`:

| Topic | Direction | Payload |
|---|---|---|
| `bacnet/1001/<point>` | out | JSON object, or the raw value when `payload = raw` |
| `bacnet/1001/<point>/set` | in | `24.5`, `active`, `2` or `{"value": 24.5, "priority": 8}` |
| `bacnet/1001/<point>/ack` | out | `{"ok": true, "value": 24.5, "priority": 8, ...}` |
| `bacnet/1001/status` | out | retained `{"status": "online", "points": 5, ...}` |
| `bacnet/bridge/status` | out | retained online/offline (last will) |

`<point>` is a slug of the BACnet object name (`Zone Temp` -> `zone_temp`),
made unique per device and editable from the mapping.

JSON value payload:

```json
{"device": 1001, "point": "Zone Temp", "object": "analog-input:0",
 "value": 21.5, "units": "degrees-celsius", "quality": "good", "ts": 1760000000}
```

## Write safety

Writes are refused unless all of these are true:

- `mapping.write_enabled` is on (Settings -> Mapping);
- the object is commandable (`analog/binary/multi-state` output or value);
- the point is mapped and enabled;
- the value fits the object type (number, `active`/`inactive`, state number);
- the priority is 1-16 (default from settings).

Every attempt is logged with its result, and every command gets an ack message.
A rejected write never reaches the BACnet network.

## Security

- **Admin login (optional, off by default).** Set a password in
  Settings -> *Console access* and tick *Require login*. Mutating endpoints
  (writes, settings, device changes, config import/export) then need a
  session from `POST /api/login` (`username: admin`); reading values stays
  open so dashboards keep working. Sessions live in memory - restarting the
  console signs everyone out, and changing the password revokes all sessions.
  Five failed logins lock the login endpoint for a minute. For headless
  installs: `python tools/set_admin_password.py`.
- **Secrets are never echoed.** The API blanks the broker password and the
  password hash; both fields in the dialog are write-only (blank = keep).
- **`BACNET_MQTT_PASSWORD`** environment variable overrides the stored broker
  password - keep credentials out of `config.json` on servers and containers.
- **TLS and mTLS**: enable TLS with a CA file; `client certificate` +
  `client key` turn on mutual TLS. The console itself is plain HTTP - keep it
  on `127.0.0.1` and put a TLS reverse proxy in front for remote access.
- The config API no longer echoes secrets (the sibling discovery console once
  allowed login-by-hash because it did).

## Behaviour worth knowing

- **Discovery across ports**: BACnet broadcasts a Who-Is to the port the client
  is bound to, so a gateway on 47908 would never hear a device listening on the
  standard 47808. The console therefore sends a second, raw Who-Is to 47808 and
  merges the I-Am answers. That is what makes discovery work when another BACnet
  tool on the same PC already owns 47808 (a simulator, Yabe, another BAC0 app).
- **Reads**: the bridge opens each device with `poll=0` and calls
  `ReadPropertyMultiple` itself once per scan. One read per batch of 25 points;
  automatic fallback to single reads if the device refuses RPM. A
  `read_timeout` (0 = BAC0's own timeout) bounds a silent device so it cannot
  stretch a scan cycle indefinitely.
- **COV subscriptions (opt-in)**: with *Subscribe COV* enabled, devices that
  support it push value changes the moment they happen; the poll cycle keeps
  running as fallback and resync. Devices that refuse a subscription stay on
  polling and are retried after a backoff.
- **Parallel polling**: every enabled device is polled together, not one after
  another. A slow or offline device cannot stretch the scan cycle past
  `scan_interval` for the rest of the network.
- **Broker-outage buffer**: value updates that cannot be published are queued
  in memory (`mqtt.queue_size`, default 1000, oldest dropped on overflow) and
  flushed oldest-first when the broker answers again. Acks and status topics
  are not buffered - they are meaningless once stale. Set QoS 1 for
  at-least-once delivery of the buffer.
- **Watchdog**: an unexpected bug in the poll loop is logged and recovered; a
  dead poll task is restarted automatically (`watchdog_restarts` counter).
- **Publish on change**: values are published when the text representation
  changes. `republish_seconds` (default 60) forces a refresh even when nothing
  moved, so a subscriber that reconnects does not wait forever.
- **Plain decimal payloads**: raw values are published as plain decimals -
  never `1.23457e+06`. Large analogs keep their digits.
- **Retain**: on by default, so the last value is available to new subscribers.
- **Reconnects**: paho retries the broker automatically; on every (re)connect
  the bridge re-subscribes, restores the retained per-device statuses and
  flushes the offline buffer.
- **Stale values**: if a scan fails, the point is marked `quality: bad` and the
  device goes offline in the UI.
- **Config saves are atomic** and keep the previous version as
  `config.json.bak` for manual recovery.

## Observability

| Endpoint | What it is for |
|---|---|
| `GET /healthz` | liveness - the process answers (supervisors, Docker healthcheck) |
| `GET /readyz` | readiness - 503 until the config is valid, BACnet is bound and the broker is connected |
| `GET /api/metrics` | Prometheus text format: polls, publishes, writes, rejects, failures, queue depth, watchdog restarts, uptime |

File logging: set a path in Settings -> *Logging* (e.g. `logs/bridge.log`)
with level, max size and backup count. Without it, logs go to the console
only. Run under systemd/journald and journald collects stdout.

## Configuration

`config.json` sections:

| Section | What it controls |
|---|---|
| `bacnet` | bind address/port, client instance and name, scan interval, Who-Is timeout, read timeout, COV |
| `mqtt` | broker, credentials, base topic, QoS, retain, keepalive, TLS, mTLS, command suffix, offline queue size |
| `mapping` | payload style, publish-on-change, units, write switch, priority, republish |
| `auth` | console login switch and the stored password hash (managed by the UI) |
| `log` | rotating log file, level, size, backups |
| `devices` | mapped devices and their points (managed by the UI) |

`config.example.json` shows the shipped defaults. The MQTT password is stored
in plain text in `config.json` (use `BACNET_MQTT_PASSWORD` to avoid it) - keep
the file private, use TLS, and put the broker behind ACLs on an untrusted
network.

## Deployment

Pick one; all three run the same app.

**Windows (desktop / workshop PC)** - `start.bat` creates the `.venv` and
launches the console. For unattended operation, register the scheduled task
from an elevated PowerShell (auto-start at boot, restarts on crash):

```powershell
powershell -ExecutionPolicy Bypass -File deploy\windows\install-task.ps1
```

(NSSM can wrap it as a true Windows service instead, if you prefer.)

**Linux (server / gateway box)** - build a venv, then use the unit file:

```bash
python3 -m venv .venv && .venv/bin/pip install -e .
sudo cp deploy/linux/bacnet-mqtt.service /etc/systemd/system/   # adjust paths
sudo systemctl daemon-reload && sudo systemctl enable --now bacnet-mqtt
```

**Docker (Linux host)** - BACnet broadcast needs host networking, which works
on Linux hosts only (on Windows/Mac, run the bridge natively instead):

```bash
docker compose up -d --build
```

`config.json` and `logs/` live in the `bridge-data` volume; pass
`BACNET_MQTT_PASSWORD` via the environment.

### Production checklist

- Keep `web_host` on `127.0.0.1`; expose the console only through a TLS
  reverse proxy with its own authentication.
- Enable console login before binding anything but loopback.
- Set broker TLS and ACLs; prefer QoS 1 so the outage buffer delivers.
- Pin the BACnet bind address explicitly when the PC has more than one
  network adapter - "auto" can pick an unplugged (APIPA) adapter and devices
  then answer from an unreachable address.
- Back up `config.json` (the `.bak` copy covers the previous save only).
- Point Prometheus at `/api/metrics` and alert on `reads_failed`,
  `mqtt_queued` growth, and `/readyz` going 503.

## Command line

```
python run.py --host 0.0.0.0 --port 8000 --no-open --log-level info
```

### Running on a different port (8001, 8002, ...)

The console listens on `127.0.0.1:8000` by default. Three ways to change it:

**1. Command line - one-off, takes effect immediately:**

```powershell
python run.py --port 8001          # or 8002, 9000, any free port
python run.py --host 0.0.0.0 --port 8001 --no-open   # reachable from the network
```

**2. Settings dialog - persistent:** open the console, open *Settings*,
change **Web port**, and apply. The value is saved to `config.json` and used
from the next start (the running page stays on its current port until then).

**3. `config.json` - persistent:** edit the file next to `run.py`:

```json
"web_host": "127.0.0.1",
"web_port": 8001
```

Notes: valid ports are 1-65535, but stay at **1024 or higher** to avoid
needing admin rights. If the port is already taken, the start fails with an
"address already in use" error - pick another port. The MQTT and BACnet ports
are separate settings and are not affected.

## Testing

```powershell
python tests/run_tests.py          # 132 tests, offline (fakes only)
python -m pytest -q                # same suite via pytest
python -m ruff check bacnet_mqtt tests tools
```

Live checks, when a broker is available on `127.0.0.1:1883`:

```powershell
python tests/smoke.py              # spawns the device simulator, proves the full loop
```

The smoke test starts the sibling **BACnet Device Simulator**, waits for the
bridge to publish `bacnet/1101/zone_temp`, then issues a write command and
expects the ack - printing `SMOKE OK`. A demo device for manual console tests:

```powershell
python tools/demo_device.py                 # 127.0.0.1:47809, instance 1001
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `the UDP port is already taken` | another BACnet tool uses 47808 (BAC0, a simulator, another bridge). Set a different port in Settings, e.g. 47908. Discovery still reaches 47808 through the raw probe. |
| Who-Is finds nothing | wrong interface, a routed network (add by address), or the device is not listening at all. On Windows check it owns a socket: `Get-NetUDPEndpoint -LocalPort 47808`. A simulator that was started while 47808 was taken has no socket and must be restarted. |
| devices answer from `169.254.x.x` or reads hang | the "auto" bind picked an unplugged/APIPA adapter. Pin the bind address in Settings (Interface dropdown). |
| a loopback test device cannot be opened | the bridge is bound to a LAN address and the device listens on `127.0.0.1` - Windows does not route that reliably. Start the test device on `0.0.0.0` and add it by the LAN address (`192.168.1.11:47810`). |
| a device answers but cannot be opened | its BACnet port is not 47808; add it by address with the real port (`192.168.1.11:47809`). |
| `mqtt: down` | broker not running, wrong host/port, or credentials rejected. The rest of the console keeps working. |
| values stop during a broker outage | they are buffered (`queue` tile) and flushed on reconnect; if `dropped_overflow` grows, raise `queue_size` or the scan interval. |
| login rejects a correct password | five failures lock login for 60 s - wait, or restart the console (sessions and the lockout are in-memory). |
| writes are refused | writes disabled, read-only object type, or a value that does not fit the type - the ack says which. |

## Layout

```
run.py                     launcher (anchors sys.path)
start.bat                  Windows entry point (creates .venv)
pyproject.toml             packaging, console script (bacnet-mqtt)
bacnet_mqtt/
  config.py                dataclasses, topic mapping, JSON persistence
  auth.py                  password hash, sessions, login throttling
  bacnet_side.py           BAC0 client: bind, discover, read, write, COV backend
  mqtt_side.py             paho client: publish, offline queue, last will
  cov.py                   COV subscriptions: probe, renewals, fallback
  engine.py                poll loop, change detection, command handling
  web.py                   FastAPI routes, login, metrics, static files
  static/                  index.html, style.css, app.js
tests/                     config, engine, auth, reliability, COV, HTTP tests + smoke
tools/demo_device.py       minimal BACnet device for testing
tools/set_admin_password.py  headless console password setter
deploy/                    systemd unit, Windows task installer
```

## Recent improvements (November 2026, v2.0)

- **Console login** - optional admin password (hash only), session tokens,
  write-only secret fields, login throttling; mutating API endpoints guarded.
- **Broker-outage buffer** - value updates are queued while the broker is down
  and flushed on reconnect; queue depth is visible in the UI and metrics.
- **COV subscriptions** - devices push changes when they support it; polling
  stays as the fallback and resync (opt-in in Settings).
- **Watchdog + lifecycle lock** - a crashed poll task restarts itself; engine
  start/stop is serialised; a `read_timeout` bounds silent devices.
- **`/healthz`, `/readyz`, `/api/metrics`** - liveness, readiness and
  Prometheus metrics from the bridge's own counters.
- **Rotating log file** - optional file logging with size and backup limits.
- **Secrets handling** - the API never echoes the broker password or password
  hash; `BACNET_MQTT_PASSWORD` env override; config saves keep a `.bak`.
- **Packaging & deployment** - `pyproject.toml` with a `bacnet-mqtt` console
  script, self-provisioning `start.bat`, scheduled-task installer, systemd
  unit, Dockerfile + compose, GitHub Actions CI (pytest + ruff, Linux/Windows).
- **Smoke test** - `tests/smoke.py` proves the full live loop against the
  sibling device simulator.
- Test suite grew from 78 to 132 tests; all green.

## Notes and limits

- One BACnet client binds one interface. Routed devices are reachable by
  address; BBMD is not configured (BAC0 supports it via `bacnet.bbmdAddress`).
- Subscriptions are `base/+/+/set`: every mapped point of every device. The
  broker's topic ACLs are the place to restrict who may write.
- Writing to real equipment can change physical outputs. Keep `write_enabled`
  off until you have checked the mapping on the site.
- The offline buffer is memory-only: a bridge restart during an outage drops
  the buffer (values refresh on the next scan once the broker is back).
