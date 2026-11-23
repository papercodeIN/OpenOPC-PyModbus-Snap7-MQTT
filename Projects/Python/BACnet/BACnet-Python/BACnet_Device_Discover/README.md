# BACnet Device Discover

A BACnet/IP discovery console that runs in the browser. Send a Who-Is, see every
device that answers, read its object list and present values, and open any object
to inspect every property it exposes — no YABE install, no command line per read.

![The discovery console](docs/console-live.png)

**Read/Write capability enabled.** The console supports writing property values (such as `presentValue`) and commanding priority arrays (slots 1–16) across BACnet devices, via both the Python API and the Web UI.

## What it does

- **Discover** with one Who-Is: local broadcast, global broadcast, or a unicast
  `host:port`; limit the device instance range; listen for a chosen timeout.
- **Find devices that do not answer broadcasts** by adding them directly:
  address plus optional instance, on any UDP port.
- **Keep the table useful**: remove a single device with **×**, or drop everything
  that missed the last scan with **clear stale**.
- **Read points**: the device's `object-list`, `present-value`, units, multistate
  state text, the four status-flag bits, and whether `present-value` is
  commandable (PRI) or read-only (RO).
- **Inspect and Write / Command**: every readable property of an object, the 16 command
  priority slots, free-form property reads, and property writes / priority slot commanding (including relinquishing priority).
- **Auto-refresh** values on a timer, with an honest timestamp: a failed read
  keeps the old values and says so instead of pretending they are fresh.
- **See what happened**: Who-Is, I-Am, reads, writes and failures in an Activity log.
- **Export the open device's points** as CSV or JSON — id, name, description,
  value, units, status flags and access, ready for a spreadsheet.
- **Run anywhere**: one Python process, a local web page, no build step.

## Capabilities & Feature Availability

| Feature | Available | Description |
|---|---|---|
| **Device Discovery** (Who-Is) | ✅ | Scan subnet, global, or unicast endpoints |
| **Manual Device Addition** | ✅ | Connect directly by IP address and optional instance |
| **Read Values & Objects** | ✅ | Live read of object lists, present values, status flags, units |
| **Write Values & Properties** | ✅ | Write properties and command priority slots (1–16) / relinquish |
| **Live COV Updates** | ✅ | Push notifications on value changes via SubscribeCOV |
| **Live Web Updates** (SSE) | ✅ | Devices, values and COV changes stream to the page in real time |
| **Property Inspection** | ✅ | Inspect every property of a device or object |
| **Data Export** | ✅ | Export device points as CSV or JSON |
| **SQL Trend Logging** | ✅ | Point reads are stored in a local SQLite history (`bacnet_history.db`); toggle `sql_logging_enabled` in config.json |
| **Alarm Detection** | ✅ | In-alarm / fault status flags are recorded in the alarms table with severity |
| **Optional Login (writes & settings)** | ✅ | Off by default; token sessions via `/api/login`, see "Authentication" |
| **REST API & Docs** | ✅ | Complete JSON API; interactive OpenAPI docs at `/api/docs` |

## Getting started

### What you need

- **Python 3.11 or newer** on Windows, macOS or Linux.
- A BACnet/IP network, or the sibling **BACnet_Device_Simulator** on the same
  machine.
- Two free UDP/TCP ports: the web page (`8001`) and the BACnet client (`47808`).

### Install

```powershell
git clone https://github.com/fusion-automate/BACnet-Python.git
cd BACnet-Python\BACnet_Device_Discover

python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

On macOS or Linux, activate with `source .venv/bin/activate` and use the same
`pip` / `python` commands.

### Run

```powershell
python -m bacnet_discover
```

The page opens in your browser; `--no-open` keeps it closed for a server.

```
22:09:32 INFO    config: D:\...\BACnet_Device_Discover\config.json
22:09:32 INFO    open http://127.0.0.1:8001
22:09:33 INFO    BACnet client 990001 listening on 192.168.1.11/24 udp/47808
```

#### Run on a specific port

The web page defaults to port `8001` (the sibling simulator uses `8000`). To
run the console on a different port, pass `--port`:

```powershell
python -m bacnet_discover --port 9000
```

The page is then served at `http://127.0.0.1:9000` — always use the URL printed
at startup. `--port` overrides the `web_port` saved in `config.json` for that
run; to change the default permanently, set it in **Settings** (or edit
`web_port` in `config.json`) and restart. Any free port works; if you run both
this console and the simulator on the same machine, give them different ports.

The bind address works the same way with `--host`:

```powershell
python -m bacnet_discover --port 9000 --host 0.0.0.0   # serve on the LAN — enable the login first!
```

The first run writes `config.json` with the first LAN interface it finds and the
standard BACnet/IP port. Both are editable in **Settings** without touching the
file.

### First scan

1. Press **Who-Is** (header or sidebar). Local broadcast is the normal choice.
   Every device that answers appears in the left rail.
2. Pick a device. The console reads its object list and present values. The
   Points tab shows one row per object; the header shows vendor, model, protocol
   and system status.
3. Click a point. The inspector opens with every property the object exposes,
   its 16 priority slots, and a property reader.
4. Devices that never answer a broadcast, or that use another UDP port, can be
   added with **Add device by address…** — `192.168.1.50` or
   `192.168.1.50:47809`, with the instance left empty (unicast Who-Is) or filled
   in (direct read).
5. Remove a device with the **×** on its card; **clear stale** removes everything
   that did not answer the last scan.

Values refresh every 15 seconds by default (Settings → Auto-refresh) and on
**Refresh values**. **Reload points** re-reads the object list when a device has
added or removed objects.

### Try it without hardware

Run the sibling **BACnet_Device_Simulator**:

```powershell
cd ..\BACnet_Device_Simulator
python -m bacnet_sim          # web UI on http://127.0.0.1:8000
```

Open its page, press **Start**, then add `<lan-ip>:47808` in the discovery
console — for example `192.168.1.11:47808`. If the console itself is bound to
loopback (Settings → Interface), use `127.0.0.1:47808` instead. The headless
simulator publishes on `127.0.0.1:47809`, so it is reachable only from a
loopback-bound console; add `127.0.0.1:47809` in that case.

## The page

| Area | What it does |
|---|---|
| **Header** | Client state (READY / SCANNING / READING / OFFLINE), **Who-Is**, **Settings** |
| **Metrics** | Bind address and port, client instance, devices, points, last scan, request count |
| **Device rail** | Cards with name, instance, address, vendor, model, object count; **×** to remove; filter; Who-Is options; add-by-address |
| **Points** | Type and instance, name, description, value, units, flags, access |
| **Device** | Identity block, objects per type, every property of the device object |
| **Activity** | Requests, discoveries and failures with a timestamp |
| **Inspector** | Every readable property of a point, priority slots, free-form property read |

### Who-Is options

| Option | Sends | Use it when |
|---|---|---|
| **Local broadcast** | Who-Is to the subnet broadcast and `255.255.255.255` | The normal case; devices on this LAN |
| **Global broadcast** | The same datagram with DNET `0xFFFF` | Devices behind BACnet routers, if they forward global broadcasts |
| **Unicast address** | Who-Is to one `host` or `host:port` | You know the address, or the device uses a non-standard port |

**Low/High limit** restricts the instance range, **Timeout** is how long the
console listens for I-Am replies, and **Reset table** forgets previously
discovered devices first.

### Points: value, flags and access

The console reads the device's `object-list`, then the common properties of each
object in `ReadPropertyMultiple` batches of 32. A property a vendor does not
implement comes back as a per-property error and is left out — one missing
optional property never hides the rest of the object.

- **Value** — `present-value`, two decimals for analog points; binary points show
  `active`/`inactive`; multistate points show their `state-text`.
- **Flags** — the four `status-flags` bits: In alarm, Fault, Overridden, Out of
  service. Dim letters mean the bit is clear.
- **Access** — read from the live object:
  - **PRI** — the object has a `priority-array`, so `present-value` is
    commandable. A client can write a value at priority 1–16, or NULL to release
    a slot. The effective value is the highest non-null slot, otherwise
    `relinquish-default`.
  - **RO** — no `priority-array`; `present-value` is read-only (Analog Inputs,
    Binary Inputs, Network Ports). Other properties such as `description` may
    still be writable.

`PRI` does not mean the point is overridden right now — only that it *can* be
commanded. The inspector's priority grid shows which slot, if any, is driving it.

### Change-of-value (COV)

Besides polling, the console subscribes to the open device with `SubscribeCOV`
(one subscription per readable analog/binary/multistate point). The device then
*pushes* a notification the moment a value or status flag changes, so the page
updates within about a second instead of waiting for the auto-refresh. The
toolbar stamp shows `COV live (n pt, m updates)` and the device header gets a
green **COV live** chip.

- Polling keeps running as the backup: it resyncs the values, covers points the
  device refuses subscriptions for, and re-subscribes after a device restart.
- Devices that answer SubscribeCOV with an error are marked *not supported* and
  stay purely on polling.
- The client stays read-only either way — a COV subscription changes how values
  arrive, never what is stored on the device.

### The inspector

Click any row. The drawer reads a wide property set — identity, value, units,
status flags, COV increment, limits, priority array, relinquish default, state
text and the rest — and lists what the object actually exposes. Empty slots are
shown as `P1 … P16`; a written priority shows its value.

**Read a property** takes a BACnet property name (`presentValue`, `units`,
`priorityArray`, `propertyList`, …) and an optional array index, and shows the
decoded value next to the raw Python representation. It is the escape hatch for
anything the fixed property set does not cover.

**Write property / Command** allows writing values to any property (such as `presentValue`) with optional priority (1–16). **Relinquish priority** allows releasing priority slots back to the device's default or lower priority.

## Settings

Settings live in `config.json` next to the project and are edited in the
**Settings** dialog. Saving restarts the BACnet client; the device table is kept
unless the bind address or BACnet port changed.

| Field | Default | Meaning |
|---|---|---|
| Interface / bind address | first LAN interface | Local address and prefix BAC0 binds (`192.168.1.11/24`) |
| BACnet port | `47808` | Local UDP port this client answers on — `47809` when the simulator already holds `47808` |
| Target port | `47808` | UDP port used by broadcast Who-Is |
| Client instance | `990001` | Device instance this console answers as |
| Client name | `BACnetDiscover` | Object name of the local device |
| Who-Is timeout | `2.0` s | How long a scan listens for I-Am |
| Auto-refresh | `15` s | Present-value read interval for the open device |
| COV (config.json only) | `true` / `60` | Change-of-value subscriptions: `cov_enabled`, `cov_lifetime` (device-side lifetime in seconds) |
| Require login | `false` | `auth_enabled`: ask for a session before writes, settings and device-table changes |
| Web address / port | `127.0.0.1` / `8001` | Where the page is served; the port needs a restart |

Command line:

| Option | Default | Meaning |
|---|---|---|
| `--host` | `127.0.0.1` | Address to serve the page on |
| `--port` | `8001` | HTTP port |
| `--log-level` | `info` | `debug` adds BAC0's internal logs |
| `--open` / `--no-open` | open | Open the page in the default browser |

### Authentication

Login is **off by default**. Turn it on with the *Require login* checkbox in
Settings (or `"auth_enabled": true` in `config.json`) when the page is served
beyond loopback. With it on, every write, settings change and device-table
edit needs a session first:

* **Sign in** — `POST /api/login` with `{"username": "admin", "password": ...}`
  returns a token; the page shows a **Log in** button and keeps the token for
  the browser tab. **Log out** revokes it.
* **Transport** — send the token as an `X-Session-Token` header (what the page
  does) or as `Authorization: Bearer <token>`.
* **Password** — the default account is `admin` / `admin`. The password is
  stored only as its SHA-256 hash in `admin_password_hash`; the hash is never
  served by the API and cannot be changed through it. Change the password by
  writing a new hash into `config.json`:

  ```powershell
  python -c "import hashlib; print(hashlib.sha256(b'YourNewPassword').hexdigest())"
  ```
* **Sessions are in memory**, so restarting the console signs everyone out and
  the page asks again on the next write. Reads, scans and exports stay open
  even with login enabled.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Header says **OFFLINE** | The BACnet UDP port could not be bound | Another BACnet tool holds it. Change **BACnet port** in Settings (e.g. `47809`) and save |
| No devices after Who-Is | Wrong interface, firewall, or no device on this subnet | Check the bind address in Settings; allow UDP `47808`; try **Unicast address** to a known device |
| Device found but opening fails with `no-response` | Another BACnet application shares the same `IP:port` on this host | The card is marked **PORT CLASH**; move one side to another port (see below) |
| Points load, then values stop and the toolbar says `refresh failing` | The read is failing (device busy, another app took the address, network) | The old values are kept; check the Activity log and the device address. `last good` is the last complete read |
| Simulator is running but discovery cannot read it | Simulator and console both on `47808` on this machine | Set the console's BACnet port to `47809`, or the simulator's device port to `47809` |
| Page does not open / port already in use | Web port `8001` taken | Run `python -m bacnet_discover --port 8002` |
| `Add device` times out | Wrong address, port or instance; device offline | Use `host:port`, check the instance, and try a unicast Who-Is with the instance empty |

### The simulator on this machine

A BACnet client is a device too: it binds a UDP port. If the simulator's device
and the console both use `47808` on the same host, Windows delivers the read to
the console's own socket and the simulator never sees it. The scan still finds
the device (its I-Am is a broadcast reply), but opening it fails with
`no-response`, and the card is marked **PORT CLASH**.

Give one side another port:

- keep the simulator on `47808` and set the console's **BACnet port** to `47809`
  in Settings, or
- keep the console on `47808` and change the simulator's port in its Device tab.

## Requirements and network notes

- **Python 3.11+** with `BAC0`, `bacpypes3`, `fastapi`, `uvicorn`, `psutil`
  (`pip install -r requirements.txt`).
- The page binds to loopback by default. Reads and scans are open to anyone
  who can reach the port; enable the login (see "Authentication") to protect
  writes and settings when serving on the LAN.
- UDP `47808` must be free on the chosen interface. The console reports the bind
  failure instead of hiding it.
- Reading from another machine works if broadcast Who-Is can reach the devices;
  allow UDP `47808` through Windows Firewall on both ends.
- **No BBMD / foreign-device support.** Devices on another subnet answer only if
  a router forwards the global broadcast; otherwise add their address directly.
- Points are read with `ReadPropertyMultiple`. A rejected batch is retried one
  object per request; a device that rejects the service entirely can be
  identified but not browsed point by point.
- **Read/Write support.** Supports `WriteProperty` and priority array slot commanding / relinquishing.

## Project layout

```
bacnet_discover/
  config.py            settings, interface detection, config.json
  whois.py             Who-Is / I-Am over its own UDP socket
  values.py            pure value formatting: labels, units, JSON-safe values
  reader.py            BacnetReader: the serialized BAC0 read calls
  cov.py               CovManager: SubscribeCOV and notification delivery
  logger.py            TrendLogger: SQLite trend history and alarms
  auth.py              optional admin login and session tokens
  client.py            DiscoveryConsole: lifecycle, device table, point reads
  web.py               FastAPI app factory, REST API, SSE stream
  static/              index.html, app.js, style.css (no build step)
bacnet_device_discover_01092025.py   the original one-file script
tests/smoke.py         end-to-end check against a running device
tests/test_*.py        offline pytest suite (codec, config, API)
docs/console-live.png  the screenshot above
config.json            your settings (created on first run, not in git)
```

The HTTP API is documented at `/api/docs`:

| Route | Purpose |
|---|---|
| `GET /api/meta` | Version, interfaces, labels, current settings |
| `GET /api/state` | The whole console state, also pushed at `GET /api/stream` (SSE) |
| `POST /api/scan` | Start a scan: `target`, `address`, `low`, `high`, `timeout`, `reset` |
| `POST /api/device/add` | Add by `address`, with optional `device_id` |
| `POST /api/device/remove` | Forget one device (`device_id`) |
| `POST /api/devices/clear-stale` | Forget every device not seen in the last scan |
| `POST /api/select` | Select (`device_id`) or clear (`null`) the open device |
| `POST /api/device/open` | Read the object list and points |
| `POST /api/device/refresh` | Re-read present values |
| `GET /api/inspect?device_id=&object=` | Property set of one object |
| `POST /api/read` | One property: `device_id`, `object`, `property`, `index` |
| `GET /api/export?format=csv\|json` | Download the open device's points |
| `GET /api/log` | Every activity-log entry (debug) |
| `PUT /api/settings` | Validate, save and reconnect |

## Testing

Offline, no device needed:

```powershell
pip install -r requirements-dev.txt
python -m pytest tests -q
python -m ruff check bacnet_discover tests
```

The offline suite covers the hand-rolled Who-Is codec against datagrams built
from the encoding rules, settings validation and persistence, the value
formatters, and every HTTP route against a console that never touches the
network or the real `config.json`.

With a device running, the end-to-end smoke test:

```powershell
python -m bacnet_sim                     # in BACnet_Device_Simulator
python -m tests.smoke 192.168.1.11:47808 # in this project
```

The smoke test starts a client on port 47831, scans the address, identifies the
device, reads its object list, inspects one object and reads a property. It
prints `SMOKE OK` or fails on the first broken step. Use `127.0.0.1:47809` for
the headless simulator.

## Changelog

Read this before changing the code — it explains why things are the way they are.

### 2026-11-18 — audit pass: optional login wired in

- **Authentication is now real.** `auth.py` existed but nothing called it; the
  README still said "no login". `POST /api/login` checks the admin password
  against the stored SHA-256 hash and returns an in-memory session token; with
  `auth_enabled` on, writes, settings changes and device-table edits require it
  (`X-Session-Token` or `Authorization: Bearer`). The page gained a **Log in**
  button, a sign-in dialog and a *Require login* checkbox in Settings.
- **The password hash never leaves the server.** `/api/meta` used to serve the
  full settings dict including `admin_password_hash`, and the API accepted it
  back — with the hash, anyone could log in by sending the hash as the
  password. The hash is now stripped from every API response and dropped from
  settings saves; it is changed by editing `config.json` only.
- **Defaults unified.** `config.py` owns one `DEFAULT_ADMIN_PASSWORD_HASH`
  (SHA-256 of `admin`) used by both the dataclass and `from_dict`; the
  conflicting `admin123` default in `auth.py` is gone.
- **Cleanup.** The duplicated writable-object list in `client.py` is one
  `WRITABLE_TYPES` constant and the points table builds each row with a single
  `object_id()` call; `logger.py` no longer swallows database failures
  silently (debug log instead); `generate_diagram.py` has no bare `except:`.

### 2026-11-18 — change-of-value subscriptions

- **Open devices now push value changes.** Opening a device subscribes every
  readable analog/binary/multistate point with `SubscribeCOV`
  (`bacnet_discover/cov.py`, new `CovManager`); notifications update the rows
  in place and the page re-renders them via the existing SSE stream. Polling
  still runs every auto-refresh as the resync, so nothing depends on the
  device honouring the subscription.
- **Refusal is per device and silent.** One probe subscription decides: a
  device that answers with an error is marked "COV not supported" and stays on
  polling; a device that answers but stops renewing gets re-subscribed by the
  refresh timer after a 60 s backoff.
- **Settings grew `cov_enabled` (default `true`) and `cov_lifetime` (default
  `60`, seconds).** They are config.json-only for now — no fields in the
  Settings dialog.
- The simulator on this machine (BAC0) accepts COV on analog points only: its
  library attaches the analog criteria to binary/multistate objects, which
  have no `covIncrement` to compare against, so those points keep polling.

### 2026-11-17 — hardening pass

- **Python 3.11 is now the floor.** The scan socket reads with
  `loop.sock_recvfrom()`, which only exists since 3.11 — the README claimed
  3.10 worked. `python -m bacnet_discover` now stops with a clear message
  instead of an `AttributeError` in the middle of a scan.
- **A bad scan request is a 400, not silence.** `/api/scan` answered
  `ok: True` for a unicast scan with an empty address; the only trace was a
  line in the activity log. The route validates the address, and
  `start_scan` validates synchronously before the background task exists.
- **`config.json` is written atomically.** Settings go to a temp file that is
  renamed over the old one, so a crash mid-save cannot leave a torn file
  behind. The write also happens off the event loop.
- **The interface scan is cached for 10 s.** `resolved_ip()` walked psutil on
  every call, and the SSE loop reaches it once per connected browser every
  1.5 s — one lookup per 10 s now, whatever the browser count.
- **The point read has a ceiling.** A device that accepts the connection but
  never answers could leave `points_loading` set forever and stall the
  auto-refresh timer; the batch phase is bounded (`POINT_READ_TIMEOUT`) and
  reports the timeout on the device card.
- **add_device judges its own attempt.** A leftover error from a previous
  scan no longer fails a fresh add; a reply from the client's own UDP socket
  is refused with the port-clash explanation; and `apply_settings` rolls back
  to the previous settings when the restart fails, instead of leaving the
  console offline on settings that are not running.
- **`client.py` is split.** Pure value formatting lives in `values.py`, the
  serialized read calls in `reader.py` (`BacnetReader` owns the lock and the
  read counter), and `web.py` is an app factory (`create_app`) — config
  access moved out of import time, which is what makes the HTTP routes
  testable. The device-instance cap is one constant (`MAX_DEVICE_INSTANCE`,
  0..4194303) everywhere; it was 4194302 on some paths.
- **92 offline tests.** `pip install -r requirements-dev.txt`,
  `python -m pytest tests -q`. The Who-Is codec is checked against datagrams
  built from the encoding rules, including the loopback collect loop with a
  fake device; settings, formatters and every HTTP route run against a
  console that never starts BAC0 and never touches the real `config.json`.
- **Points export.** The Points toolbar gained **export csv** / **export
  json**, served by `GET /api/export` for the open device: identity, value,
  units, status flags and access per point, with a device-info block in the
  JSON form.
- **Two wire-level fixes in the I-Am parser.** The NPDU hop count sits after
  the destination *and* source specifiers (Clause 6.2.2) — a router-originated
  I-Am with both was misparsed. And on Windows, the ICMP port-unreachable
  from a unicast Who-Is to a dead port arrives as `ECONNRESET` on the next
  receive; it is drained and the scan keeps listening instead of ending on
  the first missing device.

### 2026-11-16 — first release

- **Browser console** (`bacnet_discover/`): FastAPI + uvicorn on the same
  asyncio loop as BAC0, vanilla JS front end, no build step. Scan, device rail,
  points table, device tab, activity log, point inspector, connection settings.
- **Discovery uses its own socket.** bacpypes3 (`0.0.110`) does not put a
  Who-Is on the wire for `LocalBroadcast()`, and `who_is(address=<broadcast>)`
  matches I-Am replies against the broadcast address, so every reply is
  filtered out. `whois.py` encodes the unconfirmed service directly and reads
  I-Am replies from a socket bound to the chosen interface. It also makes
  non-standard target ports possible.
- **The console ignores its own I-Am.** The client is a BACnet device, so a
  broadcast Who-Is reaches it; finding yourself in the device list is noise.
- **Per-property errors are data.** A wide `ReadPropertyMultiple` returns
  `ErrorType` values for optional properties a vendor does not implement.
  Those objects still read fine, and the inspector reports how many properties
  were not exposed instead of failing the request.
- **Commandability comes from the object.** `PRI`/`RO` is decided by the
  presence of a `priority-array`, not by the object type: an analog value
  without the array is reported `RO` even though the type allows commandability.
- **Batch reads with a fallback.** Objects are read 32 per request; if a
  device rejects a batch, that batch is retried one object at a time and the
  failure is logged.
- **Settings survive a save.** The device table is only cleared when the bind
  address or BACnet port changes, because those are the only settings that
  invalidate discovered addresses.
- **The local client is a real BACnet device**, with its own instance and
  object name, so reads to devices on the same machine work and the traffic
  looks normal to a BMS.
- **Add and remove devices.** **Add device by address** sends a unicast Who-Is
  or reads a given instance directly, for devices that never answer a
  broadcast or live on another port. A per-card **×** forgets one device;
  **clear stale** drops everything missing from the last scan. Removing the open
  device closes its points and the inspector.
- **Same-host port clashes are named.** A device that answers from the
  client's own `address:port` is flagged **PORT CLASH** with the setting to
  change, instead of failing later with `no-response`.
- **A failed refresh no longer looks successful.** The values-on-screen
  timestamp only moves after a complete read. If the read fails, the points
  toolbar says `refresh failing: <error> - last good HH:MM:SS`, the error is
  logged once, and recovery is logged when it clears. This is what makes a
  shadowed device address visible instead of a silently frozen table.
- **A documentation screenshot** is generated from the running console
  (`docs/console-live.png`); the README is written as an operator guide, not a code
  tour.
- **The original script is kept** (`bacnet_device_discover_01092025.py`) as the
  one-file baseline: it starts BAC0, broadcasts a Who-Is and prints the device
  list.
- `config.json` is written on first run and git-ignored; `bacnet_discover` has
  no other local state.

## Known gaps

- **No BBMD / foreign-device registration**, so routed networks depend on a
  router forwarding the global broadcast.
- **One open device at a time.** Values auto-refresh only for the selected
  device; switching devices re-reads the object list.
- **No HTTPS**, and the password hash is unsalted SHA-256; bind the page to
  loopback, keep the login enabled on the LAN, or put a proxy in front of it.
- **The offline tests cannot see a real device.** `tests/test_*.py` cover the
  codec, config and HTTP surface offline; `tests/smoke.py` remains the check
  that a live device answers the way the tests assume.
- **BAC0 internals**: `quiet_bac0()` reaches into `BAC0.core.utils.notes`, and
  `BacnetReader` reaches `this_application.app`, neither a public API.
  Re-check both after a BAC0 upgrade.
