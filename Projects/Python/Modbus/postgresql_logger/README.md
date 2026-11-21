# Modbus PostgreSQL Logger

A self-contained FastAPI app for polling multiple Modbus TCP/RTU devices and optionally persisting samples to PostgreSQL. A local SQLite file holds only administrator, device, tag and destination metadata; it is not the sample-history store. The project includes an authenticated UI with the copied Modbus dark theme, device/tag management, live monitor and PostgreSQL destination settings.

## Requirements and setup

- Python 3.10 or newer.
- A reachable PostgreSQL server and a database created in advance. The application creates sample tables and indexes; the PostgreSQL login needs create/alter/index/insert/select permissions as applicable.
- Python driver `psycopg` 3, installed via `psycopg[binary]` in `requirements.txt`.
- Modbus TCP network access and/or an accessible serial adapter for RTU devices.

Copy `.env.example` to `.env` and edit settings. Run `run.bat` on Windows or `./run.sh` on Linux/macOS/Git Bash. The launcher creates `.venv`, installs requirements, loads `.env`, and runs the UI. Browse to <http://127.0.0.1:8080>, create the sole administrator on first run, add devices/tags, test PostgreSQL, then enable destination writing. The target database must already exist.

## Environment settings

`APP_HOST` defaults to `127.0.0.1`; `APP_PORT` defaults to `8080`; `APP_DATA_DIR` defaults to project `data/`; optional `APP_SECRET` must have at least 32 bytes, otherwise a signing key is created in the data directory; `COOKIE_SECURE` defaults off for local HTTP; `POLL_INTERVAL` defaults to 2 seconds (minimum 0.2); `DESTINATION_ENABLED` defaults off. PostgreSQL settings are `DB_HOST`, `DB_PORT` (5432), `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_CONNECT_TIMEOUT`, `DB_SSLMODE`, and `TABLE_LAYOUT` (`narrow`/`wide`). The UI saves destination values locally and takes precedence after save. A blank submitted password preserves the stored password. Credentials are not returned to the browser but are not encrypted in local SQLite; protect the data directory, `.env`, and backups.

`DB_SSLMODE` uses psycopg's supported modes: `disable`, `allow`, `prefer`, `require`, `verify-ca`, or `verify-full`. Choose a mode appropriate for your PostgreSQL service and certificate setup. Leave the app bound to loopback; it has no built-in HTTPS. Set `COOKIE_SECURE=1` only when serving through actual HTTPS.

## Authentication and security

Administrator passwords are PBKDF2-SHA256 hashes with a random salt and 310,000 rounds. Signed HttpOnly/SameSite=Strict cookies expire after eight hours. Every state-changing API request requires CSRF validation; login/setup attempts are in-memory rate-limited. WebSockets require a signed session, and same-origin is checked when Origin is supplied. The signing key in `data/.session-secret` must remain persistent to preserve sessions. This is a local training/monitoring service, not an Internet-facing hardened product.

## Devices, tags and polling

Configure TCP host/port or RTU serial port, baud, parity, stop bits, Unit ID and timeout. Add individual tags or paste `name, area, address, count` per line. Areas are coils, discrete inputs, holding registers and input registers; addresses are zero-based and count is 1–125. Enabled tags are polled sequentially on a shared background loop. If the Modbus client is no longer connected, it is recreated and reconnected. Successful reads are `GOOD`; read/connection failures create a `BAD` sample with null value and error text. Values, timestamp, quality, and errors appear in the live overview. Samples are not retained locally when the PostgreSQL destination is disabled.

## PostgreSQL sample schema and layouts

Only PostgreSQL DDL and psycopg calls are used. The application creates the target tables/indexes in the configured database; it never creates the database itself. DDL and writes occur inside a transaction. Values use psycopg `%s` parameters, identifiers are generated, validated and double-quoted, and failed batches roll back and close the connection. PostgreSQL aborts the transaction on a failed DDL statement; a concurrent duplicate-column ALTER can fail the current cycle, which is rolled back and retried on the next poll.

- **Narrow (default):** `modbus_samples`: `id BIGSERIAL`, `timestamp TIMESTAMPTZ`, `device TEXT`, `tag TEXT`, `value TEXT`, `quality VARCHAR(32)`, `error TEXT`, with timestamp and `(device, tag)` indexes. It stores one row per sample and preserves quality/error. Lists/dicts/tuples become compact JSON text; other non-null values are stringified.
- **Wide:** `modbus_samples_wide`: `timestamp TIMESTAMPTZ PRIMARY KEY` plus one nullable text column per device/tag. Column identifiers are normalized with a deterministic SHA-256 suffix and added with `ALTER TABLE ... ADD COLUMN` as new tags arrive. Samples sharing a timestamp are grouped into a row and `ON CONFLICT ("timestamp") DO UPDATE` binds all values. Wide rows store values only; quality/error are not retained there.

The configured poll interval is a target rather than a hard real-time guarantee. Reads across device/tag list are sequential and timeouts affect cycle length. There is no simulator, Modbus write path, alarms, scaling/type decoder, local sample history, CSV output, charts, or history browser. UI adds/removes devices and tags; a device update API exists but no edit form is present.

## UI/API and tests

The UI includes Overview, Devices & Tags, Destination and About. FastAPI OpenAPI docs are served at `/docs`; `/health` is available. Routes include `/api/auth/*`, `/api/devices`, `/api/devices/{id}/tags`, `/api/config`, `/api/config/destination`, `/api/config/test`, `/api/status`, and authenticated `/ws`.

Offline tests use fake psycopg-like connections/cursors and mocked Modbus clients; no PostgreSQL server or native driver connection is required:

```sh
.venv/bin/python -m pytest -q tests
.venv/bin/python -m compileall -q run.py logger_app tests
```

On Windows use `.venv\Scripts\python.exe`.
