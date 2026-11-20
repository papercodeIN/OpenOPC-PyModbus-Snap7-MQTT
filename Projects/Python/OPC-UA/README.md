# OPC UA Control Room

A single, locally hosted industrial web application that combines an **OPC UA
simulation server**, an **OPC UA client** and an **OPC data logger** for SQLite and
CSV — the same control-room pattern used by the MQTT, Modbus and IEC-104
projects.

| Capability | What it does |
|---|---|
| **OPC UA Server** | A real [asyncua](https://github.com/FreeOpcUa/opcua-asyncio) OPC UA server that exposes a **variable line** of simulated tags in its own namespace. Configure the endpoint, namespace, prefix, security policy/mode, user authentication and simulation behaviour; edit or add variables live. |
| **OPC UA Client** | Connect to any OPC UA endpoint (the local OPC UA server by default), subscribe to data changes or poll nodes, browse the address space, and read/write node values. |
| **OPC Data Logger** | "Locks" every captured data change and manual write into a local **SQLite** database and/or a **CSV** file, with a filterable browser and CSV export. CSV files rotate automatically at local midnight. |

> Existing notebooks and examples in `Projects/Python/OPC-UA/` were left in
> place; this Control Room adds its own `opcua_web_app/`, `run.py`, `data/`,
> `tests/` and documentation alongside them.

---

## Quick start

```powershell
cd Projects\Python\OPC-UA
pip install -r requirements.txt     # skip if already installed
python run.py                       # or double-click run.bat (it asks for a port: 1-65535)
```

Then open **http://127.0.0.1:8000** in a browser.

The server binds to `127.0.0.1` by default. The web application itself has no
login; keep it local and do not bind it to `0.0.0.0` or expose it to a network.
The OPC UA protocol layer supports optional username/password authentication
(see below). Changing `PORT` is supported for local use, but do not override
`HOST` to make the service remotely reachable.

Interactive API documentation is available at `http://127.0.0.1:8000/docs`.

**New to OPC UA?** Open the **Learn** tab inside the app: it explains the
protocol with every concept mapped to the app's own pages, plus a guided
10-minute first session, a glossary and troubleshooting.

**Fastest demo:** on the **OPC UA Server** page click **Start server**
(`opc.tcp://127.0.0.1:4840`). On the **OPC UA Client** page click **Connect**
(the URL already points at the local server) and then **Read node**. With
*Subscription* mode selected, changes made on the server page are pushed to the
client and logged automatically.

---

## Web UI sections

1. **Overview** – live counters, the value feed and a system event log, updated
   in real time through `/ws`.
2. **Learn** – an in-app OPC UA protocol guide: core concepts mapped to the
   app's own pages, a 10-minute guided first session, the security model,
   subscription vs polling, a glossary and troubleshooting.
3. **OPC UA Server** – endpoint configuration (bind address, port, prefix,
   namespace URI, endpoint name, security policy/mode, user authentication and
   certificate paths), simulator speed/variation, the variable table with
   manual write and delete, and an add-variable form.
4. **OPC UA Client** – session settings (URL, security, optional username /
   password with masked persistence), subscription vs polling mode, address
   space browsing, read/write operations and a **point monitor** table showing
   the latest client-received value for every configured point.
5. **Data Logger** – ON/OFF "lock" switches for SQLite and CSV, editable file
   paths, point selection (log all points or only the chosen ones), row/size
   counters, the daily CSV archive and a searchable record browser.
6. **About** – the company behind the Control Room.

---

### "Lock the data"

In the Data Logger section, **SQLite** and **CSV** are independent locks. When
a lock is ON, each captured value change is immediately appended to that store.
Turn a lock OFF to stop writing without losing already stored data. Click
**Apply settings** after changing switches or paths. Changing a path creates a
new file and leaves the previous one untouched.

The **Points to log** selector in the same panel restricts persistence to
chosen points: switch **All points** off and tick the tags you need. Filtered
points still appear in the live feed and the client point monitor — they are
simply not written to SQLite or CSV. The selection applies to new records
only; stored data is never touched.

### Daily CSV rotation

The configured CSV path is a **base name** (default `opcua_log.csv`). The active
file is date-stamped, e.g. `opcua_log_2026-11-20.csv`. A new file is generated
automatically **every day at 00:00 local system time** by a background timer,
and also lazily on the first record of a new day. All daily files are listed in
the **CSV Archive** section and can be downloaded or individually deleted there
(the active day's file is protected).

---

## Architecture

```
OPC-UA/
├─ run.py                      # launcher (uvicorn)
├─ run.bat                     # Windows launcher (asks for the port, 1-65535)
├─ requirements.txt
├─ tests/                      # pytest suite (API + protocol + storage)
├─ data/                       # created at runtime (git-ignored)
│  ├─ settings.json            # saved server/client/logger settings
│  ├─ variables.json           # Variable definitions
│  ├─ opcua.db                 # SQLite store (default)
│  ├─ opcua_log_YYYY-MM-DD.csv # daily CSV store (local midnight rollover)
│  └─ app.log                  # rotating service log (5 MB × 3 backups)
└─ opcua_web_app/
   ├─ main.py                  # FastAPI routes, WebSocket, templates
   ├─ config.py                # default settings + JSON persistence
   ├─ models.py                # validated request models (Pydantic)
   ├─ database.py              # SQLiteStore with retention
   ├─ csv_logger.py            # append-only CsvLogger with daily rotation
   ├─ variable_model.py        # Simulated variables + random-walk simulator
   ├─ opcua_server.py          # threaded asyncua server
   ├─ opcua_client.py          # threaded asyncua client + subscription handler
   ├─ manager.py               # orchestration + capture pipeline
   ├─ templates/               # base.html, index.html
   └─ static/                  # style.css, app.js
```

**Design notes**

- The OPC UA server and client each own a private asyncio loop in a daemon
  thread; FastAPI keeps its own loop. Web requests never block on protocol I/O.
- Nodes use deterministic string node ids such as
  `ns=2;s=OPCUA.Temperature`, so the client can address them directly.
- Client data-change notifications (or poll reads) are marshalled through a
  callback into the same SQLite/CSV capture pipeline used by the other Control
  Rooms.
- Passwords are **not** persisted unless *Remember password* is checked; the UI
  shows a masked placeholder for stored passwords.
- Secure policies/modes are selectable. Message security needs a server
  certificate/private key and a matching client certificate/key; the default
  `None` configuration needs no certificates.
- **User authentication** is selected on the server page: *Anonymous* (open
  access), *Username & Password* (anonymous sessions are rejected) or *Username
  & Password or Anonymous* (both accepted). The configured user name/password is
  entered in the form; clients (including this app's own client page) send it
  when connecting. The password is stored only as a salted PBKDF2-SHA256 hash
  in `settings.json` — the plaintext is never persisted or returned by the API.
- New variables added while the server is running must be exposed by restarting
  the OPC UA server (the UI warns about this).

---

## REST API (selected)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Server/client states, simulator and counters |
| GET | `/api/config` | Current settings (password masked) |
| GET | `/api/variables` | Variable definitions |
| POST | `/api/server/start` / `stop` | Start/stop the OPC UA server |
| POST | `/api/client/connect` / `disconnect` | Client session |
| POST | `/api/client/read` | Read a node |
| POST | `/api/client/write` | Write a node (typed value) |
| POST | `/api/client/browse` | Browse the server address space |
| POST | `/api/variables`, `PUT/DELETE /api/variables/{name}` | Variable CRUD |
| POST | `/api/variables/{name}/set?value=` | Manual write into a server node |
| POST | `/api/logger/settings` | Apply SQLite/CSV locks and paths |
| GET | `/api/logger/records` | Browse stored records (filters + paging) |
| DELETE | `/api/logger/records` | Clear SQLite records |
| GET | `/api/logger/export.csv` | Download stored records as CSV |
| GET | `/api/logger/csv/files` | List daily CSV files and next rollover |
| GET | `/api/logger/csv/{name}` | Download a specific daily CSV file |
| DELETE | `/api/logger/csv/{name}` | Delete an archived CSV (active protected) |
| WS | `/ws` | Live record/status/event/variable stream |

---

## Testing

The project ships with a pytest suite covering the REST API, a real asyncua
server↔client round trip (including subscription notifications), SQLite
retention and CSV rotation:

```powershell
$env:PYTHONPATH = "."
python -m pytest tests -q
```

Static checks:

```powershell
python -m ruff check opcua_web_app run.py tests
python -m compileall -q opcua_web_app run.py
node --check opcua_web_app/static/js/app.js
```

Service events and errors are written to `data/app.log` (rotating, 5 MB × 3
backups) and echoed to the console.

---

## Notes

- Requires Python 3.10+ and `asyncua` 1.0+.
- Port 4840 is the standard OPC UA TCP port and does not require administrator
  privileges.
- Supported write datatypes: Float, Double, Int32, UInt16, Boolean and String.
- Only the loopback interface is used by default; do not expose this local tool
  directly to an untrusted network.
