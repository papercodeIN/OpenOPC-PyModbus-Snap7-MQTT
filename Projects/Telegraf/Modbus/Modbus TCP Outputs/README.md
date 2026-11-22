# 🌐 Modbus TCP Outputs

Telegraf 1.40.3 configurations that read Modbus TCP holding registers and write
to a file, database or broker. **One active data output per file.**

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
To collect from more devices, uncomment the **ADDITIONAL DEVICES** block
(`Device2`) in the input section — copy it for Device3, Device4, … and give
each device a unique `name`, `controller` and `slave_id`.

---

## 🚀 Quick start

```powershell
cd Projects\Telegraf\Modbus

# One cycle on screen
.\Modbus TCP Outputs\modbus_to_csv.bat test

# Continuous collection
.\Modbus TCP Outputs\modbus_to_csv.bat
```

---

## ⚙️ Defaults

- Controller: `tcp://127.0.0.1:502` (local simulator)
- Slave ID: `1`
- Registers: `HR_0` … `HR_9` (`UINT16`, `AB`)
- Poll interval: `5s`
- Data folder: `C:/ProgramData/Telegraf/Modbus`
- Logfile: `C:/ProgramData/Telegraf/telegraf-modbus-<destination>.log`

Each destination has its own health port and logfile, so different
destinations never collide on one host (8086 is skipped — InfluxDB's own
default API port):

| Config | Health port | Logfile |
| --- | --- | --- |
| `modbus_to_csv` | 8080 | `telegraf-modbus-csv.log` |
| `modbus_to_sqlite` | 8081 | `telegraf-modbus-sqlite.log` |
| `modbus_to_mysql` | 8082 | `telegraf-modbus-mysql.log` |
| `modbus_to_mssql` | 8083 | `telegraf-modbus-mssql.log` |
| `modbus_to_postgres` | 8084 | `telegraf-modbus-postgres.log` |
| `modbus_to_influxdb` | 8085 | `telegraf-modbus-influxdb.log` |
| `modbus_to_mqtt` | 8087 | `telegraf-modbus-mqtt.log` |
| `modbus_to_opcua` | 8088 | `telegraf-modbus-opcua.log` |

Change the controller, `slave_id` and `holding_registers` for your device. The
address rules and data-type examples are documented in each file.

---

## 🧩 Layouts

- **Wide (default)** — one metric per poll with all registers in one row
  (`modbus_wide`). Best for historians and SQL tables.
- **Narrow (optional)** — one row per tag (`modbus_narrow`). Uncomment the
  processors and narrow output at the bottom of the file. `name`, `slave_id`
  and `type` are preserved.

Only one layout should be enabled per file to avoid double writes.

**MQTT is different.** The `modbus_to_mqtt.conf` files use **payload modes**,
not wide/narrow: **RAW** (one scalar message per field, active) or **JSON** (one
JSON message per metric, alternative). The OPC UA bridge always uses JSON.

---

## 🛡️ Security

Modbus TCP is plaintext on port 502. Keep devices on an isolated OT VLAN,
restrict the port with a firewall allow-list, and use read-only function codes
where possible. Never expose port 502 to the internet.

Configs use literal defaults (with `CHANGE_ME` where a secret belongs); replace
them before going live. A commented `${VAR}` line under each value lets you use
environment variables instead — see the parent [`README.md`](../README.md).

---

## ✅ Validation

```powershell
.\validate.ps1
```

All 16 Modbus configurations pass `telegraf config check` on Telegraf 1.40.3.
