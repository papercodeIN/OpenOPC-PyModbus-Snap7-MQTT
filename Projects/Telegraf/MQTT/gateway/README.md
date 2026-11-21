# MQTT → OPC UA writer gateway

Telegraf has **no OPC UA server output plugin**. It cannot create or host an OPC
UA server. This small FastAPI service is the OPC UA **client** that completes the
unidirectional pipeline:

```
MQTT broker  →  Telegraf (mqtt_to_opcua_server.conf)  →  this gateway  →  external OPC UA server
```

Both **raw** and **JSON** MQTT payloads are accepted by the Telegraf config; the
gateway receives the normalised metrics as JSON over HTTP.

---

## Start

```powershell
pip install -r requirements.txt
.\run_gateway.bat
```

Then start Telegraf with `..\mqtt_to_opcua_server.conf`. The gateway listens on
`127.0.0.1:8787` only. Health check: `GET http://127.0.0.1:8787/health`.

---

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `OPCUA_ENDPOINT` | `opc.tcp://127.0.0.1:4840` | External OPC UA server endpoint |
| `OPCUA_USERNAME` / `OPCUA_PASSWORD` | empty | OPC UA identity (read/write rights required) |
| `OPCUA_SECURITY_STRING` | empty | e.g. `Basic256Sha256,SignAndEncrypt,cert.pem,key.pem` |
| `OPCUA_NODE_MAP` | `{}` | JSON map: field name → node ID |
| `OPCUA_TOPIC_NODE_MAP` | `{}` | JSON map: exact MQTT topic → node ID |
| `OPCUA_WRITE_TIMEOUT` | `10` | Seconds allowed per write |
| `LOG_LEVEL` | `INFO` | Logging level |

Example (PowerShell):

```powershell
$env:OPCUA_ENDPOINT = "opc.tcp://192.168.1.20:4840"
$env:OPCUA_USERNAME = "telegraf_writer"
$env:OPCUA_PASSWORD = "<from secret store>"
$env:OPCUA_NODE_MAP = '{"Temperature":"ns=2;i=1234","Pressure":"ns=2;i=1235"}'
$env:OPCUA_TOPIC_NODE_MAP = '{"sensors/Line1/raw":"ns=2;i=1300"}'
```

Node selection order: exact topic match → field name → `default` entry in
`OPCUA_NODE_MAP`. Metrics without a mapping are counted as skipped.

---

## Payload examples

Raw MQTT topic `sensors/Line1/raw`, payload `23.6`:

```json
[{"name":"mqtt_consumer_value","tags":{"topic":"sensors/Line1/raw"},
  "fields":{"value":"23.6"},"timestamp":1763700000}]
```

JSON MQTT topic `sensors/Line1/json`, payload `{"Temperature":23.6,"Pressure":1.2}`:

```json
[{"name":"mqtt_consumer_json","tags":{"topic":"sensors/Line1/json"},
  "fields":{"Temperature":23.6,"Pressure":1.2},"timestamp":1763700000}]
```

---

## Security notes

- Use a dedicated OPC UA identity with write access **only** to the mapped nodes.
- Use `SignAndEncrypt` with trusted client/server certificates in production.
- Keep all credentials in the service environment or a secret store, not in files.
- The gateway binds to loopback; put it behind a secured reverse proxy if a
  remote Telegraf instance must reach it.
