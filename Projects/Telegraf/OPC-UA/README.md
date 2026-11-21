# Telegraf OPC UA Pipelines 📊

Overview of the OPC UA pipelines (demo). Runnable configuration files and source
code are kept in the **private** repository.

> ⚠️ **Status:** demo/documentation only in this public repository.

---

## 🚀 Quick Start
    
1. **Prerequisites**: Telegraf installed, OPC UA server running and reachable, node IDs identified.
2. **Setup**: Identify your server endpoint, node IDs, and credentials.
3. **Test**: Run one collection cycle to verify node access (replace the config name):
   ```powershell
   telegraf --config ".\OPC-UA\opcua_read.conf" --test
   ```
    
---

## 📝 Configuration
    
Each `.conf` file handles one destination. Update it with your server's actual settings.
    
| File | Flow |
| --- | --- |
| `opcua_read.conf` | OPC UA → daily-rotating CSV |
| `opcua_to_sqlite.conf` | OPC UA → SQLite |
| `opcua_to_mysql.conf` | OPC UA → MySQL |
| `opcua_to_mssql.conf` | OPC UA → MSSQL |
| `opcua_to_postgres.conf` | OPC UA → PostgreSQL |
| `opcua_to_influxdb.conf` | OPC UA → InfluxDB v2 |
| `opcua_to_mqtt.conf` | OPC UA → MQTT (RAW / JSON / Sparkplug B) |
    
---

## 🛠️ Step-by-Step Configuration
    
1. **Edit** the selected `.conf` file.
2. **Server Settings**:
   - Update `endpoint` (e.g., `opc.tcp://host:4840`).
   - Configure security policy (e.g., `Basic256Sha256`, `SignAndEncrypt`).
3. **Nodes**: Update `node_id`s, `namespace`s, and data polling cadence to match the server.
4. **Identity**: Configure username/password and server/client certificates.
5. **Destination**: Update paths, database credentials, and schemas.
6. **Run**:
   - `--test` first to confirm connectivity and node reading.
   - Remove `--test` to run continuously.

---

## 🔑 Security & Design
    
- **Secrets**: Use environment variables for passwords, keys, and DSNs. Never hardcode secrets.
- **Access**: Use a dedicated OPC UA identity with **read-only** access.
- **Security Policy**: Use `SignAndEncrypt` and verify server/client certificates. Never weaken security to simplify connection.
- **Database**: Provision least-privilege users for SQL databases.

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
