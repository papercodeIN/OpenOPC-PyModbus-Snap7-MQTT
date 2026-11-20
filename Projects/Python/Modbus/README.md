# Modbus Control Room

A single, locally hosted industrial web application that puts a **Modbus TCP
server** and a **Modbus TCP client on separate pages**, with SQLite and CSV data
loggers — the same control-room pattern used by the MQTT and IEC-104 projects.

| Capability | What it does |
|---|---|
| **Modbus TCP Server** | A real pymodbus TCP listener with a built-in process simulator (coils, discrete inputs, holding registers, input registers). Start/stop it, tune the simulation, and edit or add data points live. |
| **Modbus TCP Client** | Connect to any Modbus TCP device (the local server by default), read any of the four data areas, write a single coil/register, and run an automatic polling loop. |
| **Modbus Data Logger** | "Locks" every client operation and manual server write into a local **SQLite** database and/or a **CSV** file, with a filterable browser and CSV export. CSV files rotate automatically at local midnight. |

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

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

**Fastest demo:** open the **Simulator** page and click **Start server** (port
5020), then open the **Client** page and click **Connect** (already pointing at
`127.0.0.1:5020`), then **Read**. The client reads the server's live holding
registers and every operation is logged.

---

## Web UI sections

1. **Overview** – live counters, the operation feed and a system event log,
   updated in real time through `/ws`.
2. **Simulator** – the Modbus TCP server page: start/stop the listener, tune
   simulator speed/variation and manage the data-store point table (set, add,
   delete).
3. **Client** – the Modbus TCP client page: connection, reads (FC01–FC04),
   writes (FC05/FC06), auto-polling and a client activity log.
4. **Data Logger** – ON/OFF "lock" switches for SQLite and CSV, editable file
   paths, row/size counters, the daily CSV archive and a searchable record
   browser.
5. **About** – the company behind the Control Room.

---

### "Lock the data"

In the Data Logger section, **SQLite** and **CSV** are independent locks. When
a lock is ON, each captured operation (client read/write or manual server write)
is immediately appended to that store. Turn a lock OFF to stop writing without
losing already stored data. Click **Apply settings** after changing switches or
paths. Changing a path creates a new file and leaves the previous one untouched.

### Daily CSV rotation

The configured CSV path is a **base name** (default `modbus_log.csv`). The active
file is date-stamped, e.g. `modbus_log_2026-11-20.csv`. A new file is generated
automatically **every day at 00:00 local system time** by a background timer,
and also lazily on the first record of a new day. The app creates the current
day's file at startup, so a CSV exists even if no traffic arrives. All daily
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
   ├─ modbus_client.py         # pymodbus TCP client facade
   ├─ modbus_manager.py        # orchestration + capture pipeline
   ├─ templates/               # base.html, index.html
   └─ static/                  # style.css, app.js
```

**Design notes**

- The server listens on a dedicated asyncio loop in its own daemon thread;
  FastAPI keeps its own loop. The client is a normal synchronous pymodbus
  client, so reads/writes never block the web event loop.
- Modbus addresses in the UI are **0-based** (`zero_mode=True`), matching the
  address shown by the client and the simulator point table.
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
