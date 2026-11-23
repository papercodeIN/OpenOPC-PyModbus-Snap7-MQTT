# Modbus InfluxDB Logger

A self-contained FastAPI app for polling Modbus TCP/RTU devices and optionally writing their samples to InfluxDB v2. Local SQLite stores administrator/device/tag/destination metadata only; it is not a sample-history database. The app includes the copied Modbus Control Room theme, first-run login, live monitor, persistent device/tag registry and a provider-native InfluxDB writer.

## Install and run

Requires Python 3.10+. Copy `.env.example` to `.env`, configure it, and run `run.bat` on Windows or `./run.sh` on Linux/macOS/Git Bash. Launch scripts create `.venv`, install `requirements.txt`, load `.env`, and start the FastAPI service. Open <http://127.0.0.1:8080> and create the one-time administrator. Add devices/tags, configure the InfluxDB URL, organization, bucket, token, and measurement; test the connection and then enable writes. Create the organization/bucket and provide a token with the required write permission first. The server may be unavailable during UI setup; connection is needed only for testing and actual writes.

## Configuration and security

See `.env.example` for `APP_HOST` (loopback default), `APP_PORT`, `APP_DATA_DIR`, optional `APP_SECRET` (minimum 32 bytes), `COOKIE_SECURE`, `POLL_INTERVAL`, `DESTINATION_ENABLED`, `INFLUX_URL`, `INFLUX_ORG`, `INFLUX_BUCKET`, `INFLUX_TOKEN`, `INFLUX_MEASUREMENT`, `INFLUX_LAYOUT`, and `INFLUX_CONNECT_TIMEOUT`. UI settings persist in SQLite and override environment defaults after saving. Blank token submission preserves the saved value. The API redacts the token; SQLite does not encrypt stored secrets, so protect the local database, `.env`, and backups.

The launcher rejects non-loopback `APP_HOST`; use an independently secured reverse proxy/VPN for remote access. The app does not serve HTTPS; set `COOKIE_SECURE=1` only behind HTTPS. Passwords use salted PBKDF2-SHA256 with 310,000 rounds. Sessions are signed, HttpOnly, SameSite=Strict, and expire after eight hours. State-changing API routes require CSRF validation; login/setup are in-memory rate-limited. WebSockets require a signed session and a matching Origin/Host header. Preserve the generated `data/.session-secret` across restarts.

## Modbus acquisition

Each named device can use TCP host/port or RTU serial port, baud rate, parity and stop bits. Unit ID, timeout, and enabled state are per device. Tags can be added singly or in batches (`name, area, address, count` per line), and support coils, discrete inputs, holding registers and input registers with zero-based addresses and count 1–125. The shared background poller reads tags sequentially, reuses/reconnects clients, and assigns `GOOD` or `BAD` quality. Failed samples include a null value and a readable error. UTC timestamps, quality, errors and current values show in Overview and the protected live WebSocket. The configured interval is a target, not a hard real-time guarantee.

## InfluxDB point mapping (not SQL tables)

InfluxDB is a time-series point store, not a relational SQL destination. The writer creates **no SQL tables**, runs no SQL DDL, and does no `ALTER TABLE`. Samples are sent as synchronous point batches through the native InfluxDB v2 client. Each sample becomes one point in the configured bucket and organization, using the configured measurement (default `modbus`) and millisecond write precision.

- **Narrow (default):** tags `device=<device name>` and `tag=<tag name>`; fields `value`, `quality`, and optional non-empty `error`.
- **Wide:** tag `device=<device name>` only; each sample stores fields `tag_<normalized tag>_<tag digest>_value`, `tag_<normalized tag>_<tag digest>_quality`, and optional `tag_<normalized tag>_<tag digest>_error`. The digest keeps distinct tags separate even when normalization or length truncation would otherwise collide. This is still one point per sample, not one point per timestamp. Field keys appear as points arrive; no table/schema migration occurs.

Values are serialized to stable strings (scalars with their standard text form, lists/dicts/tuples as compact JSON), avoiding InfluxDB field-type conflicts when coils, registers, or engineering values share a series. Missing values use an empty string. Wide fields are prefixed and suffixed by role so tags named `quality` or `error` cannot overwrite metadata fields. Unsupported tag-name characters are replaced by `_`; a tag-specific SHA-256 digest keeps normalized field names distinct and field names remain within Influx's 255-character limit. `INFLUX_LAYOUT` and a UI field called table layout are legacy/internal names for this point mapping only.

## UI/API and limitations

Pages include Overview, Devices & Tags, Destination and About. Interactive API docs are at `/docs`, and `/health` is available. Main endpoints include `/api/auth/*`, `/api/devices`, `/api/devices/{id}/tags`, `/api/config`, `/api/config/destination`, `/api/config/test`, `/api/status`, and authenticated `/ws`. This is a read-only logger: it does not issue Modbus writes. There is no alarm engine, scaling/type decoder, local sample history when Influx is disabled, charts, CSV export, or built-in Modbus simulator. UI adds/removes devices/tags; the device update API is available without an edit form.

## Offline tests and syntax

```sh
.venv/bin/python -m pytest -q tests
.venv/bin/python -m compileall -q run.py logger_app tests
```

On Windows use `.venv\\Scripts\\python.exe`. Tests mock Modbus clients, Influx point/write APIs and local SQLite; they do not connect to a PLC or an InfluxDB service.
