# Modbus SQLite Historian

A standalone local-first FastAPI historian for multiple Modbus TCP devices and Modbus RTU slaves. Configure a device, define one or many tags, poll them into one SQLite database, monitor live value/timestamp/quality/error, and browse the same data as normalized (narrow) rows or timestamp-aligned wide rows.

This is a separate project from the sibling `modbus_app` and `csv_logger`; its runtime data and configuration are stored in this folder's `data/` directory by default.

## Start

- Windows: double-click `run.bat` (creates `.venv`, installs dependencies, copies `.env.example` to `.env` if needed, then runs the app).
- POSIX: `./run.sh` (same setup behavior).
- Manual: `python -m venv .venv`, activate it, `pip install -r requirements.txt`, copy `.env.example` to `.env`, then `python run.py`.
- Open `http://127.0.0.1:8765`. First run prompts for an administrator username/password; the username and PBKDF2 hash are stored, never plaintext.

The default listener is `127.0.0.1`; change `APP_HOST` only when you intend to expose the UI. Use HTTPS and set `APP_COOKIE_SECURE=true` behind a trusted reverse proxy for non-loopback use. Choose a unique `APP_SECRET_KEY` or let the app create a random private key in `data/secret.key`; preserve that key and the database together across backups. `.env`, `data/`, and virtual environments should not be committed.

## Configure and poll

1. In **Devices & Tags**, add any number of TCP devices (`host`, `port`, Unit ID) or RTU devices (`serial_port`, baud rate, parity, stop bits, Unit ID). Example serial paths are `COM3` or `/dev/ttyUSB0`.
2. Add tags individually or submit a JSON list in the bulk form. A tag records its device, Modbus area, zero-based address, optional engineering unit and enabled state. Supported areas are coils, discrete inputs, holding registers and input registers.
3. Choose the poll interval and start polling. The monitor shows the latest value, UTC timestamp, quality and last error for every point. Failed reads are captured as `BAD` samples with an error rather than silently dropping the point.
4. Stop/restart polling from the UI. A failed poll closes its client; a subsequent scan reconnects. RTU devices that share the same serial settings reuse a single serial client and I/O lock, so different Unit IDs on the bus are read one at a time. TCP devices at the same IP/port likewise share a socket client safely.

Each poll cycle captures one UTC timestamp and cycle ID for the scan. The normalized `samples` table stores one row per timestamp/device/tag, including value, quality and error. Wide view groups by scan cycle and emits a stable JSON `[device name, tag]` column key. Its columns are projected dynamically from the current point configuration; adding/removing a tag does not alter old SQLite rows. If tags are removed, their historical samples remain in narrow view; wide view columns list currently configured tags.

## Security

- First-run admin setup is one-time. Passwords use PBKDF2-HMAC-SHA256 with a random salt and 600,000 iterations; only the encoded hash is stored.
- Sessions are signed, time-limited cookies (`HttpOnly`, `SameSite=Strict`, `Secure` when configured). The CSRF token is in the signed session and is required in `X-CSRF-Token` for all mutating API requests, including login/setup's signed pre-auth token.
- Login attempts are throttled per client IP in memory (defaults: 5 failures in 5 minutes, then 5-minute lockout); process restart resets that throttle.
- WebSocket access requires a valid session cookie plus the session CSRF token in the `csrf` query parameter. Do not share websocket URLs.
- Default listen address is loopback. There is no built-in TLS, multi-user role system, remote account recovery, or distributed/shared rate-limit backend.

## Storage and API

SQLite is the only measurement store for this project. It uses WAL mode, fixed schema identifiers, bound values, parameterized filters and additive `ALTER TABLE` migrations for later schema columns. Database file: `data/historian.sqlite3` (override via `APP_DATA_DIR`). The UI offers:

- `GET /api/devices`, `POST /api/devices`, `DELETE /api/devices/{id}`
- `GET /api/points`, `POST /api/points`, `POST /api/points/bulk`, `DELETE /api/points/{id}`
- `POST /api/poll/start`, `/api/poll/stop`, `/api/poll/once`
- `GET /api/history?layout=narrow|wide&limit=200`, `DELETE /api/history`
- `GET /api/status`, `GET /api/auth/status`, `GET /health`

Interactive OpenAPI is available at `/docs` after startup, but data routes require login and all mutations require the CSRF header. Health is intentionally a minimal unauthenticated liveness endpoint.

Configuration is via `.env`; all settings are optional and defaults are in `.env.example`. Notable values: `APP_DATA_DIR`, `APP_POLL_INTERVAL`, `APP_POLL_ON_START`, `APP_MODBUS_TIMEOUT`, `APP_REQUEST_DELAY`, `APP_MAX_POINTS`, `APP_LOGIN_MAX_ATTEMPTS`, `APP_LOGIN_WINDOW`, `APP_LOGIN_LOCKOUT`.

## Tests

From this directory, install requirements and run `pytest -q`. Unit coverage includes SQLite schema evolution and SQL parameterization, mocked TCP/RTU client polling and RTU Unit ID serialization, error samples, narrow/wide layouts, authentication/CSRF/throttling/WebSocket protection, and a real local Modbus TCP server roundtrip. RTU hardware behavior requires an available serial adapter/device and is not exercised by CI tests.
