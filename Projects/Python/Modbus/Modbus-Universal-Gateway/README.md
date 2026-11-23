# Modbus Universal Gateway

**Modbus TCP / RTU → MQTT + OPC UA + SQL + Modbus TCP bridge — bi-directional, all configured from a Web UI.**

One industrial gateway that reads data from any Modbus device (PLC, energy meter, sensor, VFD…) and
shares it with the systems your plant already uses — while letting those systems write values back,
safely. Replaces a pile of single-purpose converters with one process, one config, one web page.

![Web console](docs/web-console.png)

---

## Contents

1. [How it works](#how-it-works)
2. [Getting started](#getting-started)
3. [Try it without hardware](#try-it-without-hardware)
4. [Concepts in plain words](#concepts-in-plain-words)
5. [Configuration reference](#configuration-reference)
6. [MQTT topics](#mqtt-topics)
7. [REST API](#rest-api)
8. [Writing values to your device](#writing-values-to-your-device)
9. [The Web UI](#the-web-ui)
10. [Security](#security)
11. [Files & data storage](#files--data-storage)
12. [License](#license)
13. [Testing](#testing)
14. [Project layout](#project-layout)
15. [Troubleshooting](#troubleshooting)
16. [Roadmap](#roadmap)

---

## How it works

```
  Modbus device ──▶ POLLER (TCP or RTU/serial, batched) ──┬─▶ MQTT broker    (JSON + raw topics)
  (PLC / meter /                                         ├─▶ OPC UA server  (tags as variables)
   sensor / VFD)                                        ├─▶ SQLite         (history rows)
                                                        └─▶ Modbus TCP     (bridge server)

  WRITE PATH:  REST / MQTT / OPC UA  ──▶  gate + writability + validation  ──▶  device

  Web UI :8000  ──▶  configure everything (hot-reloaded)
```

- The **poller** reads your tags from the device on a fixed interval and keeps the latest value of each.
- Every **northbound** output (MQTT / OPC UA / SQL / bridge) is optional — turn on only what you need.
- **Writes** from any source pass through one safety funnel before touching your device.
- All settings live in `config.json`, but you never edit it by hand — the **Web UI** does it and
  hot-reloads the engine on Save.

---

## Getting started

### What you need

- Windows or Linux
- [Python 3.10+](https://www.python.org/downloads/) on PATH (3.13 tested) — on Windows, tick *"Add python.exe to PATH"* during install
- Your Modbus device's IP+port (TCP) or COM port + baud rate (RTU), and a register map (addresses, types)

### Step 1 — Install and start

Double-click **`start.bat`** (Windows). First run installs the dependencies automatically, then starts
the gateway and opens your browser at:

```
http://localhost:8000
```

<details>
<summary>Manual / Linux equivalent</summary>

```bash
pip install -r requirements.txt
python main.py            # add a path to run a different config: python main.py myconfig.json
```
</details>

### Step 2 — Connect your Modbus device

Open the **Modbus & Tags** tab:

1. **Mode** — pick *Modbus TCP* (network device) or *Modbus RTU / Serial* (RS-485 adapter).
2. Fill the connection fields:
   - TCP: **Host** (e.g. `192.168.1.10`), **Port** (`502` is the standard), **Timeout** (seconds).
   - RTU: **Serial port** (`COM3` / `/dev/ttyUSB0`), **Baudrate**, **Parity**, **Stop bits** — all must
     match the device's DIP switches / manual exactly.
3. Set **Poll Interval** — how often to read (1000 ms is a good start; the minimum is 100 ms).
4. Click **Save Source Config**, then press **Test Modbus** on the Dashboard. The MODBUS chip in the
   header turns green when connected.

> Note: web host/port changes need a restart; everything else applies immediately.

### Step 3 — Add tags

A **tag** is one value you care about (a temperature, a pump state, a counter). In **Modbus & Tags →
Tags**, click **+ Add Tag** and fill the row:

| Column | Meaning | Example |
|---|---|---|
| Name | Unique ID, no spaces or `/` (used in topics) | `temperature` |
| Address | Register/coil number from the device manual | `0` |
| Register Type | Where the value lives | `Holding register` |
| Data Type | How to decode it | `int16` |
| Slave | Device address on the bus (1–247) | `1` |
| Scale | Multiply raw value by this | `0.1` → raw `251` shows `25.1` |
| Offset | Add this after scaling | `-40` for sensor math |
| Deadband | Smallest change worth publishing | `0.5` |
| Unit | Display label only | `°C` |
| Writable | Allow writes to this tag | ☑ for setpoints |

Click **Save Tags** — hot-reloaded, no restart. Values appear on the Dashboard within a second.

> Don't know the address/type? Check the device manual's register map. Coil = on/off bit,
> Discrete input = read-only bit, Holding register = read/write number, Input register = read-only number.

### Step 4 — Turn on destinations (Northbound tab)

Each card is independent — enable only what you need, then **Save Northbound Config**:

- **MQTT** — broker IP, port (1883 standard), optional username/password, base topic (e.g. `plant1/line1`).
- **OPC UA Server** — endpoint (default `opc.tcp://0.0.0.0:4840/ModbusGateway/`) and namespace. Any OPC UA
  client can now browse `Objects/ModbusTags/<tag>`.
- **SQL Logger** — writes every change into SQLite (`data/gateway.db`).
- **Modbus TCP Bridge** — exposes your device as a Modbus TCP server on `bind_host:bind_port`, so any
  TCP software can talk to your RTU device (or share your TCP device) through the gateway.

### Step 5 — Enable writes (if needed)

By default **nothing can be written to your device**. To allow it: **System → Security →** switch on
**Master write gate** → Save. Then only tags flagged *Writable* accept writes, and every value is
validated first. See [Writing values](#writing-values-to-your-device).

### Step 6 — Watch it run

- **Dashboard**: live value cards with sparklines, event log (every connection, write, rejection, error).
- **Status chips** in the header: MODBUS / MQTT / OPC UA / SQL / BRIDGE / WRITE — green = healthy,
  gray = disabled, red = enabled but failing.

---

## Try it without hardware

A virtual device ships with the project — full demo in two commands:

```bat
python tools\demo_sim.py 15020
python main.py examples\demo_config.json
```

Open `http://localhost:8000`: four live tags with sparklines, MQTT publishing, SQL logging, and a
working write path (`setpoint`, `pump_status` are writable; the demo sim changes values every 2 s).
The demo config expects an MQTT broker on `localhost:1883` (e.g. Mosquitto) — disable MQTT in the UI
if you don't have one.

---

## Concepts in plain words

- **Polling** — the gateway asks the device "give me registers 0–5" every interval. Devices don't push;
  someone has to ask.
- **Batching** — neighboring tags are read in **one** bus transaction instead of one-per-tag. A row of
  10 adjacent registers costs the same bus time as 1 register. Control with *Batched Reads* and
  *Batch Max Gap* (how far apart tags may be and still be merged).
- **Scaling / offset** — devices store raw integers; you display engineering units. `raw × scale + offset`.
  Writes go the other way: `(value − offset) ÷ scale`. Example: register `251`, scale `0.1` → `25.1 °C`.
- **Deadband** — a temperature jittering between 25.12 and 25.14 shouldn't spam MQTT. With deadband
  `0.5`, only changes ≥ 0.5 are published (the current value is always shown in the UI).
- **Data types** — `bool` (1 bit), `int16`/`uint16` (1 register), `int32`/`uint32`/`float32` (2 registers).
- **Word order** — 32-bit values are two 16-bit registers, and vendors disagree on which comes first.
  Gateway default is big-endian (`ABCD`). If your `int32`/`float32` values look absurdly large or tiny,
  switch to *Word swap* (`CDAB`) — per tag or globally.
- **Slave ID** — the device's address on the shared RS-485 bus (1–247). TCP devices usually answer to `1`.
- **Hot reload** — saving config in the UI applies instantly. Only `web_host`/`web_port` need a restart.

---

## Configuration reference

`config.json` is created on first start and should be edited through the Web UI (the JSON is still
shown under **System → Configuration JSON** for power users). Defaults below are what a fresh
install gets.

### `modbus` — the source

| Field | Default | Meaning |
|---|---|---|
| `mode` | `tcp` | `tcp` or `rtu` |
| `tcp.host` / `tcp.port` / `tcp.timeout` | `127.0.0.1` / `502` / `3` | TCP device address, port, timeout (s) |
| `rtu.port` / `baudrate` / `parity` / `stopbits` / `bytesize` / `timeout` | `COM1` / `9600` / `N` / `1` / `8` / `1` | Serial settings — must match the device |
| `poll_interval_ms` | `1000` | Read cycle interval (min 100) |
| `retry_count` | `3` | Retries per read before the tag is marked failed this cycle |
| `batch_reads` | `true` | Merge adjacent tags into one bus transaction |
| `batch_gap` | `3` | Max register gap between tags that still get merged |
| `word_order` | `big` | 32-bit decoding: `big` = ABCD, `little` = CDAB (word swap) |
| `tags` | 2 demo tags | Array of tag objects (see tag table in Getting Started) |

### `north.mqtt` — MQTT output

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Turn MQTT on/off |
| `broker` / `port` | `127.0.0.1` / `1883` | Broker address |
| `username` / `password` | empty | Broker credentials (optional) |
| `client_id` | `modbus-gateway` | MQTT client id |
| `random_id_suffix` | `true` | Adds a random suffix — prevents kick-loops if you accidentally run two instances |
| `base_topic` | `modbus` | Everything publishes under this |
| `qos` | `1` | 0 = fire-and-forget, 1 = confirmed, 2 = exactly-once |
| `retain` | `true` | Broker keeps the last value for new subscribers |
| `publish_on_change` | `true` | Publish only when something changed (full snapshot); `false` = every cycle |

### `north.opcua` — OPC UA server

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Turn the OPC UA server on/off |
| `endpoint` | `opc.tcp://0.0.0.0:4840/ModbusGateway/` | Listen address |
| `namespace` | `ModbusGateway` | Namespace + server name |

### `north.sql` — history logging

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Turn SQL logging on/off |
| `driver` | `sqlite` | SQLite only for now (MySQL: roadmap) |
| `sqlite_path` | `data/gateway.db` | Database file |
| `table` | `modbus_data` | Table name (plain identifier) |
| `log_on_change` | `true` | Insert a row only when a value changes |

### `north.modbus_tcp_bridge` — TCP server in front of your device

| Field | Default | Meaning |
|---|---|---|
| `enabled` | `false` | Turn the bridge on/off |
| `bind_host` / `bind_port` | `0.0.0.0` / `5020` | Where the bridge listens |

Works in **both** modes: RTU devices become TCP-accessible, and a TCP device gets a second access
point. All bridge traffic shares the gateway's bus lock, so it can never collide with polling.

### `security` — safety switches

| Field | Default | Meaning |
|---|---|---|
| `write_enabled` | `false` | **Master write gate.** `false` = nothing can be written, from anywhere |
| `auth_username` / `auth_password` | empty | Optional HTTP basic auth for UI + API. Empty = no auth |

### `system` — gateway itself

| Field | Default | Meaning |
|---|---|---|
| `web_host` / `web_port` | `0.0.0.0` / `8000` | Web UI binding (restart to apply) |
| `log_level` | `info` | `debug` / `info` / `warning` / `error` |
| `log_file` | `data/gateway.log` | Rotating file log (1 MB × 5). Empty = console only |
| `auto_open_browser` | `true` | Open the UI on startup |

---

## MQTT topics

With `base_topic = plant1`:

| Topic | Payload | Notes |
|---|---|---|
| `plant1/values` | `{"temperature": 25.1, "pump_status": true, "setpoint": 123456}` | **Full** JSON snapshot of every tag — never partial |
| `plant1/temperature` | `25.1` | Raw value as plain text, published on change |
| `plant1/pump_status` | `true` | Booleans as `true` / `false` |
| `plant1/status` | `online` / `offline` | Birth on connect, Last Will on crash — subscribers instantly know if the gateway dies |
| `plant1/write/pump_status` | `1` or `{"value": 1}` | → write to device |
| `plant1/cmd/write` | `{"tag": "pump_status", "value": 1}` | → write to device (JSON form) |

Quick test with Mosquitto clients:

```bash
mosquitto_sub -h localhost -t "plant1/#" -v
mosquitto_pub -h localhost -t "plant1/write/pump_status" -m 1
```

## REST API

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | liveness probe (never auth-protected) |
| `GET /api/status` | runtime state, counters (polls, errors, writes, drops), connection states |
| `GET /api/config` / `PUT /api/config` | read / patch the whole config (validated, hot-reloaded) |
| `GET /api/tags` / `PUT /api/tags` | read / replace the tag list |
| `GET /api/values` | current values + last-update timestamp per tag |
| `GET /api/events?limit=100` | recent event log |
| `POST /api/write` | write a value (see below) |
| `POST /api/test-connection` | test the southbound connection |
| `GET /api/sql/recent?limit=50` | last logged rows |

Examples:

```bash
curl http://localhost:8000/api/values
curl -X POST http://localhost:8000/api/write \
     -H "Content-Type: application/json" \
     -d "{\"tag\": \"pump_status\", \"value\": 1}"
```

Write error codes: `403` = gate off or tag not writable · `400` = unknown tag or out-of-range value ·
`502` = device returned an error.

## Writing values to your device

Every write — Web UI, REST, MQTT, or OPC UA client — passes the same three checks, in order:

1. **Master gate** — `security.write_enabled` must be on (403 otherwise).
2. **Tag writability** — the tag must have `writable: true` (403 otherwise).
3. **Validation** — the value must fit the tag's data type and range, e.g. `int16` rejects `40000`
   (max 32767), `bool` accepts only `0/1/true/false/on/off` (400 otherwise). The scaled value is
   converted back to raw registers (`(value − offset) ÷ scale`) before transmission.

Read-only types (`input_register`, `discrete_input`) are never writable, no exceptions.
Every accepted and rejected write is recorded in the event log with its source.

---

## The Web UI

| Tab | What you do there |
|---|---|
| **Dashboard** | Live cards (value, unit, sparkline, age) with a **WRITE** button on writable tags; quick-write bar; **Test Modbus**; recent SQL rows; the event log |
| **Modbus & Tags** | Source connection (TCP/RTU), polling and batching settings, word order; full tag editor — add, edit inline, two-click delete, Save |
| **Northbound** | MQTT / OPC UA / SQL / Bridge cards with enable switches and all their settings |
| **System** | Write gate, web authentication, runtime settings (host/port/log), the raw JSON config, and a live status panel |

Header chips show each subsystem's health at a glance; polling pauses while the tab is hidden and
resumes when you come back.

## Security

- **Write gate off by default** — a fresh install cannot modify your device even if a tag is writable.
- **Optional basic auth** — set username/password under System → Security; applies to UI + all API
  routes immediately (except `/api/health`).
- **Validation everywhere** — MQTT and OPC UA writes can't bypass the rules REST enforces.
- Runs on your LAN by design; put it behind a firewall/VPN rather than exposing it to the internet.

## Files & data storage

| Path | What it is |
|---|---|
| `config.json` | All settings (auto-created, auto-repaired to defaults if corrupted) |
| `data/gateway.db` | SQLite history (WAL mode, indexed by tag + time). Table: `id, ts, tag, value, raw_value` |
| `data/gateway.log` | Rotating log file (5 × 1 MB) |
| `license.key` | Your license (optional in demo mode) |

## License

Place `license.key` in the project root after purchase — a JSON file with `{"valid": true, "customer": "..."}`.
V1 is Type A: 1 license = 1 machine, trust-based, copyable. Without a key the gateway runs in **demo
mode** (fully functional) — `DEMO_MODE` in `src/core/license.py`.

## Testing

```bash
pip install -r requirements.txt -r requirements-dev.txt
python -m pytest tests            # 49 unit tests
python tools/e2e_check.py         # 28-check end-to-end: virtual device + real gateway + MQTT + bridge
```

The e2e run needs a local MQTT broker on 1883 (e.g. Mosquitto); everything else is self-contained.

## Project layout

```
start.bat                  one-click start (auto-installs deps on first run)
main.py                    entry point (web UI + engine)
install_requirements.bat / .ps1
config.json                created/edited via Web UI only
license.key                place after purchase (demo mode without it)
src/core/                  engine, config manager, tag model, license
src/south/                 Modbus TCP/RTU client (batched, word-order aware)
src/north/                 mqtt_bridge, opcua_server, sql_logger, modbus_bridge
web/                       FastAPI app + single-file UI
tools/e2e_check.py         28-check end-to-end verification
tools/demo_sim.py          virtual Modbus TCP device for demos
examples/demo_config.json  ready-made demo config (pairs with demo_sim.py)
tests/                     49 unit tests
docs/web-console.png       UI screenshot
```

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| MODBUS chip red | Wrong IP/port, device offline, RTU wiring/baud mismatch → press **Test Modbus**, check the event log |
| Values frozen, errors rising | Device dropped off the bus — the gateway retries with backoff and recovers by itself; check wiring |
| MQTT chip red | Broker down, wrong address/credentials, firewall on 1883 |
| OPC UA client can't connect | Endpoint bind conflict on 4840, or client used the wrong security policy (server runs No Security) |
| Writes rejected (403) | Write gate off or tag not `writable` — the event log names the exact reason |
| Write rejected (400) | Value out of range for the data type (e.g. 40000 into int16) |
| `int32`/`float32` values look absurd | Wrong word order — flip ABCD ↔ CDAB in Modbus & Tags |
| Bridge port busy | Another process owns `bind_port` — change it in Northbound |
| Config got messed up | Stop, fix or delete `config.json` (missing keys are refilled from defaults on start) |
| Gateway won't start | Read the console/`data/gateway.log`; a bad license key or blocked port is the usual cause |

## Roadmap

- MySQL/PostgreSQL logging
- TLS for MQTT and the web UI
- Redundant southbound device failover
- CSV export + tag import wizard
