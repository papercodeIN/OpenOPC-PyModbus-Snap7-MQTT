# Modbus TCP Outputs 🌐
    
This guide covers Telegraf Modbus TCP configurations for network connections.

> ✅ **Status:** Sample server setup (`127.0.0.1:502`, unit ID `1`, holding registers `0–9`) was tested with Telegraf 1.40.3. Update for your device before production.

---

## 🚀 Quick Start
    
1. **Prerequisites**: Telegraf installed, Modbus TCP device/simulator reachable, device documentation in hand.
2. **Setup**: Identify your device's IP address, port, and unit ID.
3. **Test**: Run one collection cycle to verify data:
   ```powershell
   telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf" --test
   ```
    
---

## 📝 Configuration
    
Each `.conf` file handles one destination. Update it with your actual device and destination settings.
    
| File | Purpose |
| --- | --- |
| `modbus_tcp.conf` | Starter (JSON to terminal + CSV) |
| `modbus_to_csv.conf` | Logs to CSV |
| `modbus_to_sqlite.conf` | Logs to SQLite |
| `modbus_to_mqtt.conf` | Publishes to MQTT |
| `modbus_to_mysql.conf` | Writes to MySQL |
| `modbus_to_mssql.conf` | Writes to MSSQL |
| `modbus_to_postgres.conf` | Writes to PostgreSQL |
    
---

## 🛠️ Step-by-Step Configuration
    
1. **Edit** the selected `.conf` file.
2. **Update Device Settings**:
   - `controller`: e.g., `tcp://192.168.1.20:502`.
   - `slave_id`: Match device.
3. **Update Registers**: Adjust to match your specific register map (defaults are `HR_0`–`HR_9`).
4. **Update Destination**: Update file/database paths, broker addresses, and credentials.
5. **Run**:
   - `--test` first to confirm.
   - Remove `--test` to run continuously:
     ```powershell
     telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_csv.conf"
     ```

---

## 🔍 Troubleshooting

| Issue | Check |
| --- | --- |
| Connection Refused/Timeout | Device online? IP/Port correct? Firewall allows TCP? |
| Illegal Address | Register map compatibility. |
| Zero/Unexpected Values | Register map, data type, scale, byte order. |
| Missing File/DB Error | Folder exists? Writable? |
| MQTT/SQL Errors | Broker/Server running? Credentials/Topic correct? |
    
---
    
## 📚 References
    
- [Modbus Overview](../README.md)
- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
