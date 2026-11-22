# 🔌 Modbus RTU Output

Telegraf 1.40.3 configurations for serial Modbus RTU (RS-485) devices.
**Two complementary data outputs per file: wide + narrow** (same layout and
MQTT payload-mode rules as the TCP folder).

> ⚠️ **Serial settings are placeholders.** The controller, baud rate, parity,
> stop bits, slave ID and register map must be taken from your device manual
> before connecting real hardware. All files pass `telegraf config check`.
>
> RTU logging itself is **untested** — no RTU hardware is connected here. The
> identical TCP-folder configs were tested live on 2026-11-22.

| 📄 Config | 📤 Destination |
| --- | --- |
| `modbus_to_csv.conf` | Rotating CSV |
| `modbus_to_sqlite.conf` | SQLite |
| `modbus_to_mysql.conf` | MySQL / MariaDB |
| `modbus_to_mssql.conf` | SQL Server |
| `modbus_to_postgres.conf` | PostgreSQL |
| `modbus_to_influxdb.conf` | InfluxDB v2 |
| `modbus_to_mqtt.conf` | MQTT (RAW payload, JSON option) |
| `modbus_to_opcua.conf` | MQTT JSON bridge for an OPC UA gateway |

Each file has a matching `.bat` launcher and is **single-device by default**.
To poll more devices on the same bus, uncomment the **ADDITIONAL DEVICES** block
(`Device2`) in the input section — copy it for Device3, Device4, … and give each
device a unique `name` and `slave_id` (they share the same serial port).

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

Poll interval is `5s` and data folder is `C:/ProgramData/Telegraf/Modbus`.

Each destination has its own health port and logfile — the RTU folder uses
`818x` (the TCP folder uses `808x`), so the two can run on the same host:

| Config | Health port | Logfile |
| --- | --- | --- |
| `modbus_to_csv` | 8180 | `telegraf-modbus-rtu-csv.log` |
| `modbus_to_sqlite` | 8181 | `telegraf-modbus-rtu-sqlite.log` |
| `modbus_to_mysql` | 8182 | `telegraf-modbus-rtu-mysql.log` |
| `modbus_to_mssql` | 8183 | `telegraf-modbus-rtu-mssql.log` |
| `modbus_to_postgres` | 8184 | `telegraf-modbus-rtu-postgres.log` |
| `modbus_to_influxdb` | 8185 | `telegraf-modbus-rtu-influxdb.log` |
| `modbus_to_mqtt` | 8187 | `telegraf-modbus-rtu-mqtt.log` |
| `modbus_to_opcua` | 8188 | `telegraf-modbus-rtu-opcua.log` |

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

All 16 Modbus configurations pass `telegraf config check` on Telegraf 1.40.3.
