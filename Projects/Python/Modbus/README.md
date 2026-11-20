# Modbus Control Room

A single, locally hosted industrial web application that puts a **Modbus TCP
server**, a **Modbus TCP client** and a **Modbus RTU client** on separate pages,
with SQLite and CSV data loggers and a built-in Learn course — the same
control-room pattern used by the MQTT and IEC-104 projects.

| Capability | What it does |
|---|---|
| **Modbus TCP Server** | A real pymodbus TCP listener with a built-in process simulator (coils, discrete inputs, holding registers, input registers). Start/stop it, tune the simulation, and edit or add data points live. |
| **Modbus TCP Client** | Connect to any Modbus TCP device (the local server by default), read any of the four data areas, write a single coil/register, run an automatic polling loop, and watch coils/registers in a live monitoring table. |
| **Modbus RTU Client** | The same read/write/poll/monitor tools over serial (RS-485/232): COM port picker with detected ports, baud rate, parity, stop bits and slave Unit ID. Runs alongside the TCP client. |
| **Modbus Data Logger** | "Locks" every client operation and manual server write into a local **SQLite** database and/or a **CSV** file, with a filterable browser and CSV export. CSV files rotate automatically at local midnight. |
| **Learn page** | A beginner course built into the app — data model, function codes, addressing, five guided exercises on the live simulator, and troubleshooting with exception codes. |

> The folder was previously an empty placeholder (`.gitkeep`); no existing
> files were removed or overwritten.

---

## Quick start

```powershell
cd Projects\Python\Modbus
pip install -r requirements.txt     # skip if already installed
python run.py                       # or double-click run.bat (it asks for a port: 1-65535)
```

Then open **http://127.0.0.1:8000** in a browser.

The server binds to `127.0.0.1` by default. The application has no authentication;
keep it local and do not bind it to `0.0.0.0` or expose it to a network. Changing
`PORT` is supported for local use, but do not override `HOST` to make the service
remotely reachable.

The app starts completely **idle**: the server is stopped, the TCP and RTU
clients are offline, and both data locks (SQLite/CSV) are OFF — nothing runs and
nothing is recorded until you switch it on, so you can safely point the client
tools at your own devices and enable only what you need.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

**Fastest demo:** open the **Simulator** page and click **Start server** (port
5020), then open the **Client** page and click **Connect** (already pointing at
`127.0.0.1:5020`), then **Read**. The client reads the server's live holding
registers and every operation is logged.

---

## Learn Modbus in 15 minutes

The app's built-in **Learn** page teaches this course with "try it" buttons.
The short version:

**Modbus TCP is a master/slave protocol.** One **client (master)** asks, one
**server (slave)** answers. A request names a **data area**, a **starting
address**, a **count** and a **Unit ID**; the answer is either values or a
one-byte **exception code**.

### The four data areas

| Data area | Stores | Read | Write | PLC-style name |
|---|---|---|---|---|
| Coils | 1-bit outputs (ON/OFF) | FC01 | FC05 | 0xxxx |
| Discrete inputs | 1-bit inputs | FC02 | read-only | 1xxxx |
| Holding registers | 16-bit values | FC03 | FC06 | 4xxxx |
| Input registers | 16-bit measurements | FC04 | read-only | 3xxxx |

Coils and holding registers are the PLC's writable memory; discrete inputs and
input registers are read-only field measurements. A coil is one bit; a register
is 16 bits.

### Addressing — the classic trap

This app uses **0-based protocol addresses**, like pymodbus and most tools. PLC
software often shows 1-based "4xxxx" names instead: holding register `40001` is
protocol address `0`, `40010` is address `9`. Rule of thumb:
`protocol address = PLC number − 40001`. The **Unit ID** selects the device
behind the connection — `1` for this simulator; it matters most when a gateway
routes to several slaves.

### Five exercises

1. **Start the simulator** — Simulator page → **Start server**, watch the DATA
   STORE drift while simulation is on.
2. **Read registers** — Client page → **Connect** (defaults to the local
   server) → **Read** holding registers from address 0.
3. **Write a coil** — WRITE SINGLE VALUE → Coil, address 0, value 1 → **Write**,
   then see it flip in the simulator's data store.
4. **Watch it live** — add holding register 0 and coil 0 to **LIVE MONITORING**
   and watch the values update automatically.
5. **Capture the data** — turn on the SQLite/CSV locks in the **Data Logger**,
   run a few operations, then browse the records and **Export CSV**.

### When it misbehaves

| Symptom | Usual cause |
|---|---|
| Connection refused | server not started / wrong port |
| Timeout | wrong host or firewall (use `127.0.0.1` locally) |
| Exception 02 — illegal data address | that address does not exist on the device |
| Exception 01 — illegal function | the device does not support that code on that area |
| Off-by-one values | 0-based vs 1-based addressing (see above) |

Modbus exception codes: `01` illegal function · `02` illegal data address ·
`03` illegal data value · `04` device failure.

---

## Modbus RTU (serial) client

The Client page works over **Modbus TCP** and **Modbus RTU** alike — pick the
transport at the top of the connection form and Read, Write, Polling and Live
Monitoring all follow the selection. Both links can stay connected at the same
time (e.g. a TCP gateway and a serial device in one session).

| Setting | Meaning |
|---|---|
| Serial port | COM port of your adapter — detected ports appear as suggestions |
| Baud rate | Line speed; 9600 and 19200 are the most common defaults |
| Parity | None / Even / Odd — must match the slave (Even is the Modbus spec default) |
| Stop bits | 1 or 2 — must match the slave (the spec pairs parity *None* with 2 stop bits) |
| Unit ID | The slave address on the shared cable (1–247) |

**No serial hardware?** Practise anyway: a USB-to-RS485 adapter, or a virtual
null-modem pair such as [com0com](https://sourceforge.net/projects/com0com/)
on Windows, creates local COM ports you can talk to. Serial support needs
`pyserial`, which ships in `requirements.txt`.

---

## Ready for the classroom

This app is a self-contained training station: every student runs it locally,
no hardware or licence is needed, and the built-in **Learn** page carries the
theory plus a glossary. A proven 60-minute session:

| Minutes | Topic | Where |
|---|---|---|
| 0–10 | Modbus big picture: client/server, the four data areas | Learn page, Steps 1–2 |
| 10–20 | Function codes and addressing (the 40001 trap) | Learn page, Steps 3–4 |
| 20–30 | Exercises 1–2: start the simulator, read holding registers | Simulator + Client |
| 30–40 | Exercises 3–4: write a coil, watch values in Live Monitoring | Client |
| 40–50 | Exercise 5: data locks, record browser, CSV export | Data Logger |
| 50–60 | Troubleshooting, exception codes, questions | Learn page, Step 6 |

Classroom notes:

- Every student works on `127.0.0.1`, so any number of students can train at
  the same time without interference. If a port is taken, `run.bat` asks for a
  free one at startup.
- The simulator ships with a realistic process model (pump, valves, tank level,
  temperatures) so demos look like a real plant from the first minute.
- For an RTU lesson, hand out one USB-to-RS485 adapter per group or use a
  virtual COM pair (com0com) to demonstrate without hardware.
- For developer audiences, the REST API at `/docs` is the natural next step —
  the same operations as the UI, fired as HTTP requests.

---

## Web UI sections

1. **Overview** – live counters, the operation feed and a system event log,
   updated in real time through `/ws`.
2. **Simulator** – the Modbus TCP server page: start/stop the listener, tune
   simulator speed/variation and manage the data-store point table (set, add,
   delete).
3. **Client** – the Modbus client page (TCP **and** RTU serial transports):
   connection, reads (FC01–FC04), writes (FC05/FC06), auto-polling, a live
   monitoring table for watched coils/registers (refreshed automatically, not
   written to the logger) and a client activity log.
4. **Data Logger** – ON/OFF "lock" switches for SQLite and CSV, editable file
   paths, row/size counters, the daily CSV archive and a searchable record
   browser.
5. **Learn** – the built-in beginner course: Modbus basics, the data model,
   function codes, addressing, five guided exercises and troubleshooting.
6. **About** – the company behind the Control Room.

---

### "Lock the data"

In the Data Logger section, **SQLite** and **CSV** are independent locks. When
a lock is ON, each captured operation (client read/write or manual server write)
is immediately appended to that store. Turn a lock OFF to stop writing without
losing already stored data. Click **Apply settings** after changing switches or
paths. Changing a path creates a new file and leaves the previous one untouched.

### Daily CSV rotation

The configured CSV path is a **base name** (default `modbus_log.csv`). The active
file is date-stamped, e.g. `modbus_log_2026-11-20.csv`. While the CSV lock is
ON, a new file is generated automatically **every day at 00:00 local system
time** by a background timer, and also lazily on the first record of a new day;
the current day's file is created as soon as the lock is applied. While the lock
is OFF, no CSV file is created or written. All daily
files are listed in the **CSV Archive** section and can be downloaded or
individually deleted there (the active day's file is protected).

---

## Architecture

```
Modbus/
├─ run.py                      # launcher (uvicorn)
├─ run.bat                     # Windows launcher (asks for the port, 1-65535)
├─ requirements.txt
├─ screenshots/                # optional UI captures (see its README)
├─ tests/                      # pytest suite (API + protocol + storage)
├─ data/                       # created at runtime (git-ignored)
│  ├─ settings.json            # saved server/client/logger settings
│  ├─ points.json              # simulator data points
│  ├─ modbus.db                # SQLite store (default)
│  ├─ modbus_log_YYYY-MM-DD.csv# daily CSV store (local midnight rollover)
│  └─ app.log                  # rotating service log (5 MB × 3 backups)
└─ modbus_app/
   ├─ main.py                  # FastAPI routes, WebSocket, templates
   ├─ config.py                # default settings + JSON persistence
   ├─ models.py                # validated request models (Pydantic)
   ├─ database.py              # SQLiteStore with retention
   ├─ csv_logger.py            # append-only CsvLogger with daily rotation
   ├─ modbus_simulator.py      # process model + pymodbus datastore
   ├─ modbus_server.py         # threaded Modbus TCP listener
   ├─ modbus_client.py         # pymodbus TCP & RTU (serial) client facades
   ├─ modbus_manager.py        # orchestration + capture pipeline
   ├─ templates/               # base.html, index.html
   └─ static/                  # style.css, app.js
```

**Design notes**

- The server listens on a dedicated asyncio loop in its own daemon thread;
  FastAPI keeps its own loop. The client is a normal synchronous pymodbus
  client, so reads/writes never block the web event loop.
- Modbus addresses in the UI are **0-based** (`zero_mode=True`), matching the
  address shown by the client and the simulator point table. The simulator's
  data-store table and the client's live-monitor table also show the industrial
  PLC-style address (00001 / 10001 / 30001 / 40001 style) beside each protocol
  address.
- Data-point values sync into the pymodbus datastore, so the client always
  reads what the simulator or UI last wrote.
- Events from the protocol threads are marshalled onto the asyncio loop and
  broadcast to every connected browser via `/ws`.
- Paths are local; the only network traffic is to the configured Modbus device.

---

## REST API (selected)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Server/client states, simulator and counters |
| GET | `/api/config` | Current settings |
| GET | `/api/points` | Simulator data points (optional `?area=`) |
| POST | `/api/server/start` / `stop` | Start/stop the Modbus TCP listener |
| POST | `/api/client/connect` / `disconnect` | Client connection |
| POST | `/api/client/read` | Read coils / inputs / registers |
| POST | `/api/client/write` | Write a coil or holding register |
| POST | `/api/client/poll/start` / `stop` | Automatic polling |
| POST | `/api/client/monitor` | Batched live-monitor read (not logged) |
| GET | `/api/serial/ports` | COM ports detected on this PC (for RTU) |
| POST | `/api/points`, `PUT/DELETE /api/points/{area}/{address}` | Data-point CRUD |
| POST | `/api/points/{area}/{address}/set?value=` | Manual write into the datastore |
| POST | `/api/logger/settings` | Apply SQLite/CSV locks and paths |
| GET | `/api/logger/records` | Browse stored records (filters + paging) |
| DELETE | `/api/logger/records` | Clear SQLite records |
| GET | `/api/logger/export.csv` | Download stored records as CSV |
| GET | `/api/logger/csv/files` | List daily CSV files and next rollover |
| GET | `/api/logger/csv/{name}` | Download a specific daily CSV file |
| DELETE | `/api/logger/csv/{name}` | Delete an archived CSV (active protected) |
| WS | `/ws` | Live record/status/event/point stream |

---

## Testing

The project ships with a pytest suite covering the REST API, a real
server↔client round trip, SQLite retention and CSV rotation:

```powershell
$env:PYTHONPATH = "."
python -m pytest tests -q
```

Static checks:

```powershell
python -m ruff check modbus_app run.py
python -m compileall -q modbus_app run.py
node --check modbus_app/static/js/app.js
```

Service events and errors are written to `data/app.log` (rotating, 5 MB × 3
backups) and echoed to the console.

---

## Notes

- Requires Python 3.10+ and `pymodbus` 3.6+.
- Port 5020 is used by default so no administrator privileges are needed;
  change it to 502 in the UI if you specifically need the standard Modbus port.
- Only coils and holding registers are writable from the client, matching
  standard Modbus function codes FC05 and FC06.
