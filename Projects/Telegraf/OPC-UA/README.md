# Telegraf OPC UA Pipelines 📊

> 📌 **Public repo is documentation/demo only.** Runnable `.conf` files and `.bat` launchers are kept in the private repository (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

Overview of the OPC UA pipelines: Telegraf acts as an OPC UA **client**, reading
selected nodes and writing the values to a destination.

| Pipeline | Status |
| --- | --- |
| **OPC UA → MQTT** 📤 | ✅ Tested — live Prosys server, RAW + JSON payloads |
| **OPC UA → CSV / SQLite / SQL / InfluxDB** 💾 | ✅ Configs checked; live destination tests are deployment-specific |

---

## 🚀 Quick Start

1. **Prerequisites**: Telegraf installed, OPC UA server running and reachable, node IDs identified.
2. **Setup**: Identify your server endpoint, node IDs, and credentials (in the private configs).
3. **Test**: Run one collection cycle:
   ```powershell
   telegraf --config ".\OPC-UA\opcua_to_mqtt.conf" --test
   ```

---

## 📝 Configurations

Each `.conf` file handles one destination.

| File | Flow |
| --- | --- |
| `opcua_to_csv.conf` | OPC UA → daily-rotating CSV |
| `opcua_to_sqlite.conf` | OPC UA → SQLite |
| `opcua_to_mysql.conf` | OPC UA → MySQL |
| `opcua_to_mssql.conf` | OPC UA → MSSQL |
| `opcua_to_postgres.conf` | OPC UA → PostgreSQL |
| `opcua_to_influxdb.conf` | OPC UA → InfluxDB v2 |
| `opcua_to_mqtt.conf` | OPC UA → MQTT (RAW / JSON / Sparkplug B) |

## 🎯 Current demo target

- Endpoint: `opc.tcp://DESKTOP-FAFB2HS:53532/OPCUA/SimulationServer`
- Identity: `admin` / `admin`, security policy and mode `None`
- Namespace `3`, 9 nodes: Constant (1001), Counter (1002), Random (1003),
  Sawtooth (1004), Sinusoid (1005), Square (1006), Triangle (1007), Binary (1008), Text (1009)
- Poll + flush interval: **1s**

---

## 💾 Data logger table formats

The CSV and SQLite loggers support two formats; **one output is active** per config:

| Format | Table | Columns | Status |
| --- | --- | --- | --- |
| Wide | `opcua_wide` | `timestamp`, `id`, 9 tag columns + `Quality` (one row/second) | ✅ Tested |
| Narrow | `opcua_narrow` | `timestamp`, `id`, `name`, `value` (one row/tag/second) | ✅ Tested |

Comment out the active output and uncomment the other to switch formats.

---

## 📤 OPC UA → MQTT payload modes

| Mode | Status | Topic | Payload |
| --- | --- | --- | --- |
| RAW (default) | ✅ Tested | `plant/opcua/raw/<field>` | One raw scalar value per topic |
| JSON | ✅ Tested | `plant/opcua/telemetry` | All 9 nodes in one JSON message |
| Sparkplug B | 🧪 Draft (not tested) | `spBv1.0/<group>/NDATA/<node>` | Protobuf via the companion gateway (private repo) |

The MQTT client ID is random by default; a commented section in the config
allows a fixed ID. MQTT credentials are commented out (local broker needs no login).

---

## 🛠️ Step-by-Step Configuration

1. **Edit** the selected `.conf` file in the private repository.
2. **Server Settings**: set `endpoint`, security policy and mode.
3. **Nodes**: update node IDs, namespace and polling cadence to match the server.
4. **Identity**: configure username/password and server/client certificates.
5. **Destination**: update paths, database credentials, and schemas.
6. **Run**: `--test` first, then run continuously.

---

## 🔑 Security & Design

- **Secrets**: use environment variables for production passwords, keys, and DSNs.
- **Access**: use a dedicated OPC UA identity with **read-only** access.
- **Security Policy**: use `SignAndEncrypt` and verify certificates in production.
- **Database**: provision least-privilege users for SQL databases.

---

## 🔗 MQTT to OPC UA

Telegraf **cannot** host an OPC UA server. MQTT → OPC UA uses a writer gateway
as an OPC UA client to an external server. See `../MQTT/README.md` for the
unidirectional architecture (implementation in the private repository).

---

## 📚 References

- [Telegraf OPC UA Input](https://docs.influxdata.com/telegraf/v1/input-plugins/opcua/)
- [Telegraf SQL Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/sql/README.md)
- [Telegraf MQTT Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/mqtt/README.md)
