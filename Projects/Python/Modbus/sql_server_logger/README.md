# Modbus SQL Server Logger

A self-contained FastAPI application for monitoring multiple Modbus TCP/RTU devices and optionally writing samples to Microsoft SQL Server. Local SQLite stores only administrator/device/tag/destination metadata; SQL Server is the time-series sample destination. The app includes a dark Modbus Control Room UI, first-run admin setup, a live monitor, device/tag management and destination configuration.

## Requirements

- Python 3.10 or newer.
- A Microsoft SQL Server database created in advance; the configured account needs create/alter/index and insert/select permissions for the sample tables.
- **Microsoft ODBC Driver for SQL Server**, installed at the OS level, separate from Python packages. The default driver is `ODBC Driver 18 for SQL Server`; set `ODBC_DRIVER`/the ODBC driver UI field to the exact installed name if using another version.
- `pyodbc` is a Python dependency installed from `requirements.txt`. Depending on platform, pyodbc may require compiler/ODBC development packages. Runtime still requires the Microsoft ODBC system driver.
- RTU polling additionally requires a serial adapter/port and OS permissions.

The connection string uses `Encrypt=yes;TrustServerCertificate=yes`: data transport is encrypted, but the SQL Server certificate is not validated. Do not mistake this for certificate verification; choose a verified TLS configuration for deployments with that requirement.

## Setup and run

Copy `.env.example` to `.env`, adjust configuration, and run `run.bat` on Windows or `./run.sh` on Linux/macOS/Git Bash (make it executable once if necessary). The launcher creates `.venv`, installs listed dependencies, loads `.env`, and starts the UI. Open <http://127.0.0.1:8080>, set up the sole local administrator, add devices/tags, test the destination, then enable writing. A database must already exist. Destination writing starts disabled.

## Configuration and local security

The environment file lists `APP_HOST` (loopback by default), `APP_PORT`, `APP_DATA_DIR`, optional `APP_SECRET` (minimum 32 bytes), `COOKIE_SECURE`, `POLL_INTERVAL`, `DESTINATION_ENABLED`, `DB_HOST`, `DB_PORT` (1433), `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_CONNECT_TIMEOUT`, `ODBC_DRIVER`, and `TABLE_LAYOUT`. The UI can change destination configuration, layout, and the ODBC driver name. It redacts passwords from API responses, but stores them unencrypted in the local SQLite settings file; keep `.env`, `data/`, and backups private. Keep the server on loopback; no HTTPS server is built in. Set `COOKIE_SECURE=1` only when actually serving through HTTPS.

Admin passwords use salted PBKDF2-SHA256 (310,000 iterations). Signed HttpOnly/SameSite=Strict sessions expire after eight hours; state-changing API calls require CSRF tokens; setup/login attempts are rate limited. WebSockets require the signed session and check Origin against Host when present. Without an explicit `APP_SECRET`, a random key is stored at `data/.session-secret`; persist it across app restarts.

## Modbus and SQL layouts

The poller can read enabled TCP and RTU devices in one sequential loop. Tags support coils, discrete inputs, holding registers and input registers with zero-based addresses and count 1–125. A good read yields `GOOD`; a read/connection failure yields `BAD`, null value and error text. Timestamps are UTC ISO values per poll cycle. The monitor and WebSocket show the latest cycle only; SQLite does not keep sample history. The logger does not issue Modbus writes.

- **Narrow**: `modbus_samples`, one row per sample with timestamp, device, tag, value, quality and error.
- **Wide**: `modbus_samples_wide`, one row per timestamp with generated device/tag columns. Generated column keys are normalized and hash-suffixed. New columns are added as devices/tags arrive. Wide layout contains values only; quality/error are still visible in the UI but not persisted in wide columns. The writer ensures the narrow table schema even in wide mode.

SQL Server uses `?` bound parameters for sample values, transaction commit/rollback, and validated/quoted generated identifiers. A failed batch rolls back, closes the connection and appears in destination status; later cycles retry. Polling is sequential and `POLL_INTERVAL` is a target rather than a real-time guarantee.

## UI/API and limitations

The UI offers Overview, Devices & Tags, Destination and About. API documentation is at `/docs`; `/health` is a basic health endpoint. This read-only poller has no sample history when the destination is disabled, alarm engine, scaling/type decoding, CSV export, history charts, simulator or device/tag edit forms (there is a device update API). Networked deployments need external TLS and appropriate network controls.

## Offline tests and syntax check

```sh
.venv/bin/python -m pytest -q tests
.venv/bin/python -m compileall -q run.py logger_app tests
```

On Windows use `.venv\Scripts\python.exe`. Tests use fake Modbus clients and fake DB cursors/connections, do not require `pyodbc` to connect, and do not contact SQL Server or a PLC.
