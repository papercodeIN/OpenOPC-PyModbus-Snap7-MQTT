# Sparkplug B publisher gateway

Telegraf 1.40.3 has **no Sparkplug serializer**. This FastAPI service receives
the JSON produced by `../opcua_to_mqtt.conf` (MODE 3) and publishes it as a
standards-compliant Sparkplug B Edge Node using `pysparkplug`.

```
OPC UA server -> Telegraf -> HTTP -> this gateway -> MQTT broker
topic: spBv1.0/<group>/NDATA/<edge_node>
```

The gateway publishes NBIRTH on connect, registers an NDEATH will message and
sends NDATA batches. It is single-directional (no Sparkplug commands consumed).

---

## Start

```powershell
pip install -r requirements.txt
.\run_gateway.bat
```

Then enable MODE 3 in `../opcua_to_mqtt.conf` and start Telegraf. Health check:
`GET http://127.0.0.1:8790/health`.

---

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `SPARKPLUG_MQTT_HOST` | `127.0.0.1` | MQTT broker host |
| `SPARKPLUG_MQTT_PORT` | `1883` | MQTT broker port (8883 for TLS) |
| `SPARKPLUG_MQTT_USERNAME` / `SPARKPLUG_MQTT_PASSWORD` | empty | Broker credentials |
| `SPARKPLUG_MQTT_CA` | empty | CA certificate path for TLS |
| `SPARKPLUG_GROUP_ID` | `Plant` | Sparkplug Group ID |
| `SPARKPLUG_EDGE_NODE_ID` | `OPCUA-01` | Sparkplug Edge Node ID |
| `SPARKPLUG_METRICS` | `Temperature,Pressure` | Metric names declared in NBIRTH |
| `LOG_LEVEL` | `INFO` | Logging level |

`SPARKPLUG_METRICS` must list the field names that appear in the Telegraf data,
so the birth certificate advertises them before the first NDATA.

---

## Notes

- RAW and JSON MQTT output modes need no gateway — they are native Telegraf
  `outputs.mqtt` layouts in `../opcua_to_mqtt.conf`.
- Keep credentials in the service environment / secret store.
- The gateway binds to loopback only.
