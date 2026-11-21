# Modbus CSV Historian

A standalone local-first FastAPI historian for multiple Modbus TCP devices and Modbus RTU slaves. Configure one or more points per device, monitor value/timestamp/quality/error live, and inspect one common history through normalized (narrow) or timestamp-aligned wide layouts.

This project intentionally does not share runtime state with `modbus_app` or `sqlite_logger`. The SQLite file is a small catalog for accounts/devices/tags only. Measurement samples are written to CSV files under `data/history/`.

## Start

- Windows: double-click `run.bat` (creates `.venv`, installs dependencies, copies `.env.example` to `.env` if missing, and starts the app).
- POSIX: `./run.sh`.
- Manual: create/activate a Python 3.10+ virtual environment, `pip install -r requirements.txt`, copy `.env.example` to `.env`, then `python run.py`.
- Visit `http://127.0.0.1:8766` and set the first-run administrator credentials.

Default bind is loopback only. Change `APP_HOST` only for a deliberate network deployment. Use HTTPS behind a trusted reverse proxy and set `APP_COOKIE_SECURE=true`. Set a unique `APP_SECRET_KEY` or let the service create `data/secret.key`; back up the key, catalog DB and all history epochs. `.env`, `data/` and `.venv/` are private runtime state and should not be committed.

## Devices, tags and polling

The **Devices & Tags** page supports Modbus TCP host/port and RTU serial/baud/parity/stop bits/Unit ID settings. Add one tag at a time or submit a JSON array for batch configuration. Tags include area (coils, discrete inputs, holding registers, input registers), zero-based address and optional engineering unit.

Start polling at the configured interval. Current value, UTC timestamp, quality and last error are shown for each tag. Failures are kept as `BAD`-quality rows with error details. One scan assigns a shared timestamp and cycle ID to all sampled points. Requests to devices on a shared RTU serial bus are serialized; matching RTU bus settings reuse one client while each device's Unit ID is applied on its request. TCP endpoints share a client when host/port match.

## CSV schema evolution (important)

Each complete poll scan is appended as **one wide row** to an immutable schema-epoch file named `history_epoch_NNNNNN.csv`. The header starts with `cycle_id,timestamp,epoch_ms`, then has three columns per tag: `value::<JSON tag metadata>`, `quality::<same JSON metadata>`, and `error::<same JSON metadata>`. Metadata includes device ID/name, point ID/tag, area, address and unit. The JSON column suffix avoids ambiguous delimiter-based names.

When the configured set/order or metadata of points changes, the logger creates the next epoch file with its own complete header. It never appends a row with the wrong number or meaning of columns and never rewrites older epoch files. Previous files preserve the exact tag schema active when they were created. If an operator edits an active CSV header by hand, the logger detects the mismatch before the next write and rotates instead of writing values under a corrupted header. Samples are stored in CSV only; wide history reads exact cycle rows from the epoch files, while narrow history flattens each value/quality/error triple into a device/tag sample. Adding/removing tags does not cause prior data loss; old samples keep their original schema epoch and metadata.

The UI **Historian** page offers narrow or wide views, and the CSV file list is available at `GET /api/history/files`. `DELETE /api/history` intentionally clears all CSV history epochs but keeps the SQLite device/tag/admin catalog.

## Security

- First-run administrator setup is one time. Passwords are PBKDF2-HMAC-SHA256 with unique salt and 600,000 iterations; plaintext is never saved.
- Sessions use signed time-limited `HttpOnly`, `SameSite=Strict` cookies; the secure flag is configurable. Every mutating API requires a matching `X-CSRF-Token`.
- The WebSocket requires a valid signed session and matching CSRF token in the query string.
- Login is throttled by client IP (5 failures in 5 minutes then a 5-minute lockout by default). Rate-limit state is process-local and resets on restart.
- The listener defaults to `127.0.0.1`. No built-in TLS, multi-user role system, remote recovery or distributed rate limiting is provided.

## API and tests

Key API routes: `/api/devices`, `/api/points`, `/api/points/bulk`, `/api/poll/start`, `/api/poll/stop`, `/api/poll/once`, `/api/history?layout=narrow|wide`, `/api/history/files`, and `/api/status`. Data access requires login; mutations also require CSRF. `/health` is a minimal unauthenticated liveness endpoint; `/docs` shows the API schema.

Run `pytest -q` from this directory. Tests cover safe schema-epoch rotation and preservation, catalog parameterization, error rows, mocked TCP/RTU multi-device polling, shared serial client/Unit IDs, narrow/wide history, authentication and CSRF, login throttling, WebSocket protection, and an in-process local TCP Modbus roundtrip. Real RTU devices require an available serial adapter and are not tested in CI.
