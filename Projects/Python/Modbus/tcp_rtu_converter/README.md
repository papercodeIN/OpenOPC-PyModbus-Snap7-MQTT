# Modbus TCP / RTU Converter

A standalone FastAPI control room for a **protocol-aware** Modbus converter. It offers one active route at a time:

- **RTU → TCP:** read explicitly mapped points from one shared RTU bus into a cache and expose them through a real Modbus TCP server.
- **TCP → RTU:** poll one or more TCP devices and expose the mapped cache through a Modbus RTU server on a serial port.

Single-coil/register writes are accepted only for explicitly writable coil/holding-register mappings and are routed back to that tag's configured source. FC15/FC16 multi-write requests are explicitly rejected with a Modbus Illegal Function response rather than being emulated as separate writes that could partially apply. It is **not** a transparent byte tunnel: requests are decoded, matched to configured mappings, served from the poll/cache service, and translated to source operations.

## Start

Windows: run `run.bat` (creates `.venv`, installs requirements, copies `.env.example` to `.env`, starts the UI).

Linux/macOS: `chmod +x run.sh && ./run.sh`.

Open `http://127.0.0.1:8801`. On first run, create the administrator account. Configure `.env` before launch if a different local web port or data folder is required. The UI and the exposed TCP server bind to loopback by default. Do not set `CONVERTER_ALLOW_REMOTE_BIND=true` unless the deployment is on a trusted network behind TLS and access control.

## Configure a route

1. In Overview choose direction and configure source serial parameters, TCP listener or RTU Unit ID, poll interval and stale threshold. Apply changes while stopped.
2. Add source device(s). For RTU → TCP, each device is an RTU slave on the shared serial line with its Unit ID. For TCP → RTU, each source device has its own host/port/Unit ID.
3. Add individual tag mappings or paste a JSON array. Source and exposed data areas/addresses are explicit and unique. The exposed Unit ID is configurable for RTU → TCP; TCP → RTU uses the configured RTU server Unit ID.
4. Mark a tag writable only when it is a coil/holding-register source and exposed area. Start the route. A real read/write smoke flow is available in tests without physical RTU hardware.

The monitor shows value, UTC timestamp, quality (`GOOD`, `BAD`, `UNKNOWN`) and last error. Stale/error data does not get presented as freshly good.

## Security

- First-run setup creates only one admin account.
- Passwords are one-way PBKDF2-HMAC-SHA256 hashes with a random 16-byte salt and 310,000 iterations; no plaintext password is saved.
- Browser session and pre-auth tokens are HMAC-signed, `HttpOnly`, `SameSite=Lax` cookies. `Secure` can be enabled for HTTPS reverse-proxy deployments.
- State-changing APIs require the CSRF token in `X-CSRF-Token`; login/setup are pre-auth CSRF-protected and rate-limited by client IP and username.
- WebSocket monitor validates the signed session cookie before accepting.
- Loopback web and Modbus TCP binds are the default. Protocol server starts only after an explicit UI/API action and validates mappings, transport, port, and serial prerequisites first.

## REST API

Interactive OpenAPI docs: `/docs` (requires sign-in for the UI; API operations also require the session cookie). Auth bootstrap routes are `/api/auth/status`, `/api/auth/setup`, `/api/auth/login`, and `/api/auth/logout`. After login, read `csrf` from status and pass `X-CSRF-Token` for POST/DELETE calls.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/config`, `/api/devices`, `/api/tags` | Read route settings, devices and mappings |
| POST / DELETE | `/api/devices`, `/api/devices/{id}` | Manage source devices |
| POST | `/api/tags` | Add one mapping |
| POST | `/api/tags/bulk` | Add a list of mappings atomically, body `{ "tags": [ ... ] }` |
| DELETE | `/api/tags/{id}` | Remove a mapping |
| POST | `/api/settings` | Apply route/serial/listener/poll settings while stopped |
| POST | `/api/runtime/start`, `/api/runtime/stop` | Start or stop the single active route |
| POST | `/api/runtime/poll` | Poll now |
| GET | `/api/status`, `/api/validation`, `/api/monitor` | Runtime, validation and value/quality status |
| POST | `/api/tags/{id}/write` | Write one configured writable tag, body `{ "value": 12 }` |
| WS | `/ws/monitor` | Authenticated live status and monitor snapshots |

Mapping example (replace `device_id` with the ID returned by `/api/devices`):

```json
{
  "name": "Tank_Level",
  "device_id": "device-id",
  "source_area": "input_registers",
  "source_address": 4,
  "target_area": "input_registers",
  "target_address": 12,
  "target_unit_id": 1,
  "writable": false,
  "data_type": "uint16",
  "unit": "%"
}
```

## Notes / limitations

- A mapped tag currently represents one Modbus point. `float`, `int32`, and `string` labels describe UI/MQTT metadata for a single raw 16-bit word; they do not silently combine multi-register values. Use a proper explicit register decoder/scale layer before treating them as engineering values.
- Reads are per configured tag, not block-coalesced. The shared RTU link lock serializes all operations; poll interval should be selected for the bus/device count.
- The RTU server and serial clients need a real serial interface/port at runtime. Startup validates configuration but cannot prove wiring/device health until communication begins.
- Only one converter direction runs at once. Route edits are disabled while running.
- The app does not persist admin passwords in configuration, logs or browser storage. `.env`, the generated `data/secret.key`, and the data directory should be access-controlled.

## Tests

From this directory:

```sh
python -m pip install -r requirements.txt
python -m pytest -q
python -m compileall -q app run.py
```

Tests use an in-memory fake source for RTU mapping, a real local pymodbus TCP server/client protocol exchange, and mock serial transactions. They do not require an external PLC or serial adapter.
