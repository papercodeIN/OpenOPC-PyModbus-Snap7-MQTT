# Modbus MySQL Logger

A self-contained FastAPI application for monitoring multiple Modbus TCP and RTU devices and optionally persisting their samples to MySQL. It includes the Modbus Control Room dark theme, first-run administrator setup, device/tag management, latest-value monitor, destination configuration and a live WebSocket feed. Local SQLite is used only for administrator/device/tag/destination metadata; it is not the sample-history destination.

## Install and run

Requires Python 3.10+. From this folder:

- Windows: copy `.env.example` to `.env`, edit it, then run `run.bat`.
- Linux/macOS/Git Bash: `cp .env.example .env`, then `./run.sh` (use `chmod +x run.sh` once if needed).

The launchers create `.venv`, install `requirements.txt` on first run, load `.env`, and start the UI. Visit <http://127.0.0.1:8080>, create the administrator (password length 12–256), then add a device and tags. Configure and test the MySQL destination before turning on writes. Create the target database beforehand; the application creates/updates the sample tables.

## Configuration and security

`.env.example` documents `APP_HOST` (`127.0.0.1` default), `APP_PORT`, `APP_DATA_DIR`, optional `APP_SECRET` (32+ bytes), `COOKIE_SECURE`, `POLL_INTERVAL`, `DESTINATION_ENABLED`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_CONNECT_TIMEOUT`, `DB_CHARSET`, and `TABLE_LAYOUT`. UI settings are stored in local SQLite and take precedence after saving. The destination password is not returned to the browser but is stored unencrypted in the local settings database. Protect `.env`, `data/`, and backups. Leave the app bound to loopback; there is no built-in HTTPS. Use `COOKIE_SECURE=1` only behind correctly configured HTTPS.

Passwords use salted PBKDF2-SHA256 (310,000 rounds). Session cookies are signed, HttpOnly, SameSite=Strict, eight-hour expiry; state-changing API calls check CSRF tokens; setup/login attempts are rate limited; WebSockets require a valid session and compare the Origin host if supplied. The generated signing key in `data/.session-secret` must remain persistent.

## Modbus and data layouts

Device parameters include TCP host/port or RTU serial port, baud, parity and stop bits, Unit ID, timeout, and enabled state. Tags read coils, discrete inputs, holding registers or input registers using zero-based address and count 1–125. Add one tag or paste newline-separated `name, area, address, count` rows. The shared poller reads configured tags sequentially, reconnects when clients are not connected, and marks latest samples `GOOD` or `BAD`; bad samples carry a null value and error text. Timestamps are UTC ISO strings shared within a polling cycle. Multi-value reads appear as arrays/JSON values. No Modbus writes are issued by this logger.

- **Narrow / normalized**: `modbus_samples`, one row per sample with timestamp, device, tag, value, quality, error.
- **Wide**: `modbus_samples_wide`, one row per timestamp with columns generated from normalized device/tag names plus a short SHA-256 suffix. New columns are added when tags are introduced. The writer also ensures the narrow table schema each batch, though wide mode writes sample rows to the wide table only. Wide rows keep values (including NULL on failures); per-sample quality/error are shown in the monitor but not retained in wide table.

Schema changes and inserts run in a transaction. SQL values use bound parameters. Generated identifiers are validated and quoted using MySQL syntax. Failed batches roll back and close their connection; the poller reports destination errors and retries on later cycles. Ensure the MySQL login has CREATE/ALTER/INDEX/INSERT/SELECT privileges.

## Screens, API, limitations

Pages include Overview, Devices & Tags, Destination, and About. FastAPI docs are at `/docs`, health at `/health`. APIs include `/api/auth/*`, `/api/devices`, `/api/devices/{id}/tags`, `/api/config`, `/api/config/destination`, `/api/config/test`, `/api/status`; `/ws` is session-protected. Polling is sequential and the configured interval is a target, not a hard real-time guarantee. There is no local sample history, alarm engine, scaling/type decoding, CSV export, charts, simulator, or device/tag edit form (a device update API exists).

## Offline tests and syntax check

Tests use temporary SQLite stores and fake Modbus clients and SQL connections; they do not require a live PLC, MySQL, or MySQL connector at test runtime.

```sh
.venv/bin/python -m pytest -q tests
.venv/bin/python -m compileall -q run.py logger_app tests
```

On Windows, use `.venv\Scripts\python.exe`.
