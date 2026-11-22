# Telegraf OPC UA Pipelines 📊

Industry-ready Telegraf configurations that make Telegraf an OPC UA **client**,
reading selected nodes and writing values to a destination.

| Pipeline | Status |
| --- | --- |
| **OPC UA → MQTT** 📤 | ✅ Tested live — JSON mode (2026-11-22); RAW mode verified too |
| **OPC UA → CSV / SQLite / MySQL / PostgreSQL** 💾 | ✅ Tested live — wide + narrow (2026-11-22) |
| **OPC UA → MSSQL / InfluxDB** 💾 | ✅ Configs checked (services not running locally — untested) |

All `.conf` files pass `telegraf config check` on Telegraf 1.40.3.

---

## 🚀 Quick Start

```powershell
telegraf --config ".\OPC-UA\opcua_to_mqtt.conf" config check
telegraf --config ".\OPC-UA\opcua_to_mqtt.conf" --test
telegraf --config ".\OPC-UA\opcua_to_mqtt.conf"
```

Every config has a matching `.bat` launcher (pass `test` for a single cycle).

---

## 📝 Configurations

| File | Flow | Tested live |
| --- | --- | --- |
| `opcua_to_csv_wide.conf` / `_narrow.conf` | OPC UA → rotating CSV | ✅ 2026-11-22 |
| `opcua_to_sqlite_wide.conf` / `_narrow.conf` | OPC UA → SQLite | ✅ 2026-11-22 |
| `opcua_to_mysql_wide.conf` / `_narrow.conf` | OPC UA → MySQL | ✅ 2026-11-22 |
| `opcua_to_postgres_wide.conf` / `_narrow.conf` | OPC UA → PostgreSQL | ✅ 2026-11-22 |
| `opcua_to_mssql_wide.conf` / `_narrow.conf` | OPC UA → MSSQL | ⏳ service not running |
| `opcua_to_influxdb_wide.conf` / `_narrow.conf` | OPC UA → InfluxDB v2 | ⏳ service not running |
| `opcua_to_mqtt.conf` | OPC UA → MQTT (JSON active; RAW alternative; Sparkplug B draft) | ✅ 2026-11-22 |

All seven requested OPC UA data-logger/publisher solutions are present.

---

## 🎯 Current demo target

- Endpoint: `opc.tcp://DESKTOP-FAFB2HS:53530/OPCUA/SimulationServer`
- Identity: Anonymous (security policy and mode `None`; server account `admin`/`admin` available)
- Namespace `3`, 7 nodes: Counter (1001), Random (1002), Sawtooth (1003),
  Sinusoid (1004), Square (1005), Triangle (1006), Constant (1007)
- Poll + flush interval: **1s**

---

## 💾 Data logger table formats

Wide and narrow are separate config files — run the layout you want (or both,
they write to separate tables):

| Format | Config | Table | Columns | Status |
| --- | --- | --- | --- | --- |
| Wide | `*_wide.conf` | `opcua_wide` | `timestamp`, `id`, 7 value columns + `Quality` (one row/second) | ✅ Tested live |
| Narrow | `*_narrow.conf` | `opcua_narrow` | `timestamp`, `id`, `name`, `value` (one row/tag/second) | ✅ Tested live |

---

## 📤 OPC UA → MQTT payload modes

`opcua_to_mqtt.conf` contains three output blocks; **one** is active at a time:

| Mode | Status | How | Gateway needed |
| --- | --- | --- | --- |
| JSON (default) | ✅ Tested live — one message with all 7 nodes | `outputs.mqtt`, `layout = "batch"`, topic `plant/opcua/json` | no |
| RAW (alternative) | ✅ Verified — one scalar message per field | `outputs.mqtt`, `layout = "field"`, topic `plant/opcua/raw/<field>` | no |
| Sparkplug B | 🧪 Draft (not tested) | `outputs.http` → Sparkplug Edge Node | yes — [`gateway/README.md`](gateway/README.md) |

MQTT `client_id` is omitted so Telegraf generates a random ID; a commented
`client_id` section is provided for a fixed ID. MQTT credentials are commented
out because the local broker needs no login.

Telegraf has no Sparkplug serializer, so MODE 3 sends JSON to the companion
gateway which encodes protobuf and publishes `spBv1.0/<group>/NDATA/<node>`.

---

## 🔑 Security & Design

- Live-lab credentials are local-only; for production use `${ENV_VAR}` references
  and a service environment / secret store.
- Use a read-only OPC UA identity for the logger solutions.
- Use `SignAndEncrypt` with trusted client/server certificates in production.
- Provision least-privilege database users.

---

## 📚 References

- [Telegraf OPC UA Input](https://docs.influxdata.com/telegraf/v1/input-plugins/opcua/)
- [Telegraf SQL Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/sql/README.md)
- [Telegraf MQTT Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/mqtt/README.md)
