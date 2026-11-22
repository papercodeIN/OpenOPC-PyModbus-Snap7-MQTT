# 🔌 Modbus RTU Output

Telegraf 1.40.3 configurations for serial Modbus RTU (RS-485) devices.
**One active data output per file.**

> ⚠️ **Serial settings are placeholders.** The controller, baud rate, parity,
> stop bits, slave ID and register map must be taken from your device manual
> before connecting real hardware. All files pass `telegraf config check`.

| 📄 Config | 📤 Destination | 👥 Devices |
| --- | --- | --- |
| `modbus_rtu.conf` | Rotating CSV | Single |
| `modbus_to_csv.conf` | Rotating CSV | Single / Multi |
| `modbus_to_sqlite.conf` | SQLite | Single / Multi |
| `modbus_to_mysql.conf` | MySQL / MariaDB | Single / Multi |
| `modbus_to_mssql.conf` | SQL Server | Single / Multi |
| `modbus_to_postgres.conf` | PostgreSQL | Single / Multi |
| `modbus_to_influxdb.conf` | InfluxDB v2 | Single / Multi |
| `modbus_to_mqtt.conf` | MQTT (one topic per field) | Single / Multi |
| `modbus_to_opcua.conf` | MQTT JSON bridge for an OPC UA gateway | Single / Multi |

---

## 🚀 Quick start

```powershell
cd Projects\Telegraf\Modbus

# One cycle on screen
.\Modbus RTU Output\modbus_to_csv.bat test

# Continuous collection
.\Modbus RTU Output\modbus_to_csv.bat
```

---

## ⚙️ Defaults and required edits

| Setting | Placeholder | Action |
| --- | --- | --- |
| `controller` | `COM1` | Set the real port, e.g. `COM3` |
| `baud_rate` | `9600` | Match the device |
| `data_bits` | `8` | Usually 8 |
| `parity` | `"N"` | `N`, `E` or `O` |
| `stop_bits` | `1` | Usually 1 |
| `slave_id` | `1` | Device unit ID |
| `holding_registers` | `HR_0`…`HR_9` | Replace with the device map |

Poll interval is `5s`, data folder is `C:/ProgramData/Telegraf/Modbus`, and the
health endpoint is `http://127.0.0.1:8080/health`.

---

## 🔧 RS-485 checklist

1. Confirm the USB-RS485 adapter appears as a COM port in Device Manager.
2. Match baud rate, parity and stop bits on both ends.
3. Use the correct A/B wiring and a common ground where required.
4. Terminate the bus (typically 120 Ω at both ends) for long runs.
5. Keep the slave ID unique on the bus.

---

## 🛡️ Security and operations

Modbus RTU is a local serial link; protect the host machine and the physical bus.
Configs use literal defaults (with `CHANGE_ME` where a secret belongs); replace
them before going live. A commented `${VAR}` line under each value lets you use
environment variables instead — see the parent [`README.md`](../README.md).
Use `install-service.ps1` for 24/7 operation.

---

## ✅ Validation

```powershell
.\validate.ps1
```

All 34 Modbus configurations pass `telegraf config check` on Telegraf 1.40.3.
