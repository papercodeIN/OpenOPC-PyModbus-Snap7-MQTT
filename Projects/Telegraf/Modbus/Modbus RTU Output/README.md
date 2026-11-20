# Modbus RTU Output 🔌

This guide covers Telegraf Modbus RTU configurations for serial connections.

> ⚠️ **Status:** These are **draft examples**. Serial and register settings are **placeholders**. Confirm your device settings before running!

---

## 🚀 Quick Start

1. **Prerequisites**: Telegraf installed, Modbus RTU device connected (COM port), device documentation in hand.
2. **Setup**: Identify your COM port, baud rate, data bits, parity, stop bits, and slave ID.
3. **Test**: Run one collection cycle to verify data:
   ```powershell
   telegraf --config ".\Modbus\Modbus RTU Output\modbus_rtu.conf" --test
   ```

---

## 📝 Configuration

Each `.conf` file handles one destination. Update it with your actual device and destination settings.

| File | Purpose |
| --- | --- |
| `modbus_rtu.conf` | Starter (JSON to terminal + CSV) |
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
   - `controller`: e.g., `COM3`.
   - `baud_rate`, `data_bits`, `parity`, `stop_bits`: Match device.
   - `slave_id`: Match device.
3. **Update Registers**: Adjust to match your specific register map (defaults are `HR_0`–`HR_9`).
4. **Update Destination**: Update file/database paths, broker addresses, and credentials.
5. **Run**:
   - `--test` first to confirm.
   - Remove `--test` to run continuously:
     ```powershell
     telegraf --config ".\Modbus\Modbus RTU Output\modbus_to_csv.conf"
     ```

---

## 🔍 Troubleshooting

| Issue | Check |
| --- | --- |
| Serial port busy | Close other apps using the COM port. |
| Timeout/No response | Wiring, framing (Baud/Parity), Slave ID. |
| Illegal Address | Register map compatibility. |
| Zero/Unexpected Values | Data type, scale, byte order. |

---

## 📚 References

- [Modbus Overview](../README.md)
- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
