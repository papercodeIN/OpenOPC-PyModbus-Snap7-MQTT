# Modbus RTU Output 🔌

> 📌 **Public repo is documentation/demo only.** Runnable `.conf` files and `.bat` launchers are kept in the private repository (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

This guide covers Telegraf Modbus RTU configurations for serial connections.

> ⚠️ **Status:** **Draft examples** — serial and register settings are placeholders. All configs pass `telegraf config check`, but live serial/device and destination tests are still pending. Confirm your device settings before running!

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

| Config | Purpose | Launcher |
| --- | --- | --- |
| `modbus_rtu.conf` | Starter (JSON to terminal + CSV) | `modbus_rtu.bat` |
| `modbus_to_csv.conf` | Daily-rotating CSV data logger | `modbus_to_csv.bat` |
| `modbus_to_sqlite.conf` | SQLite data logger | `modbus_to_sqlite.bat` |
| `modbus_to_mqtt.conf` | MQTT publisher (one topic per field) | `modbus_to_mqtt.bat` |
| `modbus_to_mysql.conf` | MySQL / MariaDB data logger | `modbus_to_mysql.bat` |
| `modbus_to_mssql.conf` | Microsoft SQL Server data logger | `modbus_to_mssql.bat` |
| `modbus_to_postgres.conf` | PostgreSQL data logger | `modbus_to_postgres.bat` |
| `modbus_to_opcua.conf` | JSON publisher for an **external** OPC UA gateway | `modbus_to_opcua.bat` |
| `modbus_to_influxdb.conf` | InfluxDB v2 data logger | `modbus_to_influxdb.bat` |

Every config has a matching `.bat` launcher — double-click it to run continuously, or run it with the `test` argument (e.g. `modbus_to_csv.bat test`) for a single test cycle. The `.bat` files set **local test defaults only**; replace every `CHANGE_ME` and move the variables into the Telegraf Windows service environment before plant deployment.

### 🔑 Environment variables (no secrets in the `.conf` files)

| Config | Variables |
| --- | --- |
| `modbus_to_mqtt.conf`, `modbus_to_opcua.conf` | `MQTT_BROKER_URL`, `MQTT_USERNAME`, `MQTT_PASSWORD` (+ TLS paths for plant) |
| `modbus_to_mysql.conf` | `MYSQL_DSN` |
| `modbus_to_mssql.conf` | `MSSQL_DSN` |
| `modbus_to_postgres.conf` | `POSTGRES_DSN` |
| `modbus_to_influxdb.conf` | `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET` |
| CSV / SQLite / starter | none — edit the file path inside the config |

> Use an `ssl://` broker URL with TLS verification and a least-privilege account in production. Serial settings (COM port, baud, data bits, parity, stop bits, slave ID) remain device-specific draft placeholders.

### 🌐 Modbus → OPC UA and → InfluxDB

- `modbus_to_opcua.conf` is a **runnable publisher**: Telegraf has no OPC UA server output, so it publishes JSON to `opcua/bridge/#` for a separately secured external gateway (Node-RED, asyncua, Kepware, Ignition, ...).
- `modbus_to_influxdb.conf` writes points to InfluxDB v2 with a write-only token. Grafana queries InfluxDB; it is not a Telegraf output.

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
