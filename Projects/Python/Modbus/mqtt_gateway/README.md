# Modbus MQTT Gateway

A standalone FastAPI control room for polling multiple Modbus TCP and RTU devices and publishing configured tags to MQTT.

Output modes can be used together:

- **Raw scalar:** UTF-8 scalar text at `<base>/<device>/<tag>/value`.
- **Timestamped JSON:** JSON at `<base>/<device>/<tag>/json` with value, UTC timestamp, quality, error, unit, device and tag.
- **Sparkplug B:** standards-compliant Sparkplug Protobuf payloads using the maintained `pysparkplug` package. With device topics enabled, the Edge Node publishes NBIRTH/DBIRTH/DDATA and consumes NCMD/DCMD; with device topics disabled, it publishes node-level metrics and writable command aliases only. The Edge Node configures NDEATH as an MQTT Last Will and publishes clean death messages at shutdown. Only configured writable coil/holding-register tags are commandable.

Sparkplug payloads are not JSON; the gateway does not label JSON as Sparkplug.

## Start

Windows: run `run.bat` (creates `.venv`, installs requirements, copies `.env.example` to `.env`, starts the UI).

Linux/macOS: `chmod +x run.sh && ./run.sh`.

Open `http://127.0.0.1:8802` and create the administrator account on first run. Default web bind is loopback. Edit `.env` for web port/data path before launch. Set `GATEWAY_ALLOW_REMOTE_BIND=true` only behind trusted TLS and access controls.

## Configure

1. Add one or more source devices. A TCP device has host, port and Unit ID; an RTU device has serial port, baud, parity, stop bits, timeout and Unit ID. Devices on the same physical RTU bus share a serialized client.
2. Add tags individually or submit a JSON list. Each tag is a Modbus area/address, name, type and optional engineering unit/topic suffix.
3. In Overview, configure the MQTT broker, raw/JSON modes, TLS, QoS and optional Sparkplug IDs. MQTT password is masked in API/UI responses and kept only in the local configuration data file.
4. Start gateway. Polling begins in the background; status/quality/errors are visible in the monitor and over the authenticated WebSocket.
5. Writable tags can be changed through the UI/API and Sparkplug commands. Only coils and holding registers may be writable. Incoming Sparkplug commands for unknown/read-only tags are ignored.

## Sparkplug B details

Dependency pins in `requirements.txt` use `pysparkplug>=0.6.1,<0.7` and `paho-mqtt>=1.6.1,<2` (the serializer currently uses the Paho 1.x API). `pysparkplug` builds Sparkplug B Protocol Buffer payloads and implements Sparkplug topic/Edge Node behavior. With device topics enabled, the adapter uses `EdgeNode`, `Device`, `Metric`, and package command callbacks to publish DBIRTH/DDATA plus NCMD/DCMD. Without device topics, it publishes writable command aliases as node metrics and routes NCMD writes. The Edge Node establishes its NDEATH Last Will and clean NDEATH; each registered device's death is emitted if deregistered. Sparkplug IDs must not contain MQTT topic wildcards or slashes.

The included integration tests use a fake publisher and an injected fake Sparkplug Edge Node, with an additional real `pysparkplug` payload serialization/decode check. Tests require no broker. In production, enable Sparkplug only when the broker/consumer is configured for Sparkplug B.

## Security

- First-run creates a single administrator; passwords are stored as salted PBKDF2-HMAC-SHA256 hashes (310,000 iterations), never plaintext.
- Session and pre-auth cookies are HMAC-signed `HttpOnly`, `SameSite=Lax`; HTTPS deployments can turn on `GATEWAY_COOKIE_SECURE`.
- All changing APIs require the session CSRF token in `X-CSRF-Token`; login/setup also require pre-auth CSRF and rate limiting.
- WebSocket monitor checks the signed session cookie before accept.
- Changing devices, tags or settings is blocked while running. API status and the WebSocket require authentication.
- Broker password is not returned by config API; the UI sends only a new password when changing it. Saved broker credentials are encrypted at rest using Fernet, with the key stored in `data/credentials.key`; protect both the data directory and backups.

## API

Interactive docs: `/docs`. Login bootstrap: `/api/auth/status`, `/api/auth/setup`, `/api/auth/login`, `/api/auth/logout`. After authentication, get the `csrf` value from auth status and send it as `X-CSRF-Token` for POST/DELETE.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/config`, `/api/devices`, `/api/tags` | Read configuration |
| POST / DELETE | `/api/devices`, `/api/devices/{id}` | Manage endpoints |
| POST | `/api/tags` | Add one polling point |
| POST | `/api/tags/bulk` | Add multiple points atomically (`{ "tags": [...] }`) |
| DELETE | `/api/tags/{id}` | Remove a point |
| POST | `/api/settings` | Apply poll/MQTT settings while stopped |
| POST | `/api/runtime/start`, `/api/runtime/stop` | Start/stop polling and publishing |
| POST | `/api/runtime/poll` | Poll now |
| GET | `/api/status`, `/api/validation`, `/api/monitor` | Status, validation, current values/quality |
| POST | `/api/tags/{id}/write` | Write an explicitly writable tag (`{ "value": 123 }`) |
| WS | `/ws/monitor` | Authenticated live snapshots |

Tag example (replace `device_id` with the ID returned by `/api/devices`):

```json
{
  "device_id": "device-id",
  "name": "Tank_Level",
  "area": "input_registers",
  "address": 4,
  "writable": false,
  "data_type": "uint16",
  "unit": "%",
  "topic_suffix": "Tank_Level"
}
```

## Notes / limitations

- A tag currently represents one Modbus point. The float/int32/string data type labels do not combine multiple Modbus registers; they remain single-word/raw metadata. Configure a decoder/scaling layer for multi-register device formats before using engineering values.
- Tags are polled sequentially; RTU calls are serialized. Tune poll interval for the number of devices/tags and device timeouts.
- Failed device reads remain visible as BAD quality with the last value retained. The MQTT JSON stream publishes the error state; raw scalar publication is only emitted for GOOD values.
- MQTT connection failure prevents runtime start. A Modbus source can be offline at start; the poller shows BAD quality and retries on the next cycle.
- No broker, PLC or serial interface is required to run tests. Actual deployment requires configured Modbus sources and an MQTT broker.

## Tests

From this directory:

```sh
python -m pip install -r requirements.txt
python -m pytest -q
python -m compileall -q app run.py
```
