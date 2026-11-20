# Telegraf MQTT Pipelines 📥

These are configuration templates for MQTT consumers and one MQTT-to-MQTT bridge.

> ⚠️ **Status:** These are **templates**. They have not been tested against production brokers or destination services.

---

## 🚀 Quick Start
    
1. **Prerequisites**: Telegraf installed, MQTT broker running and reachable, documentation for your topic schema in hand.
2. **Setup**: Identify your broker address, topic, and credentials.
3. **Test**: Run one collection cycle to verify parsing (replace the config name):
   ```powershell
   telegraf --config ".\MQTT\mqtt_to_csv.conf" --test
   ```
    
---

## 📝 Configuration
    
Each `.conf` file handles one destination. Update it with your actual broker and destination settings.
    
| File | Flow |
| --- | --- |
| `mqtt_to_csv.conf` | MQTT → daily-rotating CSV |
| `mqtt_to_sqlite.conf` | MQTT → SQLite |
| `mqtt_to_mysql.conf` | MQTT → MySQL |
| `mqtt_to_mssql.conf` | MQTT → MSSQL |
| `mqtt_to_postgres.conf` | MQTT → PostgreSQL |
| `mqtt_to_influxdb.conf` | MQTT → InfluxDB v2 |
| `mqtt_to_mqtt_bridge.conf` | MQTT → another broker (JSON transform) |
| `mqtt_to_opcua_server.conf` | Reference only: MQTT → external OPC UA gateway |
    
---

## 🛠️ Step-by-Step Configuration
    
1. **Edit** the selected `.conf` file.
2. **Broker Settings**:
   - Update `servers` (broker address, usually `tcp://host:8883`).
   - Configure TLS, client certificates, and authentication.
3. **Update Topic**: Change subscription topic (e.g., `plant/+/telemetry/#`) to match your broker's topic contract.
4. **Payload Parsing**: Ensure your MQTT payload matches the expected parser (default is raw numeric; JSON requires specific configuration).
5. **Destination**: Update paths, database credentials, and schemas.
6. **Run**:
   - `--test` first to confirm parsing and broker connectivity.
   - Remove `--test` to run continuously.

---

## 🔑 Security & Design
    
- **Secrets**: Use environment variables for passwords, tokens, and DSNs. Never hardcode secrets.
- **Broker**: Use TLS (port 8883) with mutual authentication (`insecure_skip_verify = false`).
- **Permissions**: Provision least-privilege broker ACLs.
- **Persistence**: QoS 1 may result in duplicates; downstream processing must tolerate this.

---

## 🔗 MQTT to OPC UA
    
Telegraf **cannot** host an OPC UA server. `mqtt_to_opcua_server.conf` is for reference only. For this integration, select an external OPC UA gateway and secure it independently.

---
    
## 📚 References
    
- [Telegraf MQTT Consumer Input](https://docs.influxdata.com/telegraf/v1/input-plugins/mqtt_consumer/)
- [Telegraf MQTT Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/mqtt/README.md)
