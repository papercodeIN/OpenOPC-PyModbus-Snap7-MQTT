# 🌐 Modbus TCP Outputs

Telegraf 1.40.3 configurations that read Modbus TCP holding registers and write
to a file, database or broker. **One active data output per file.**

| 📄 Config | 📤 Destination | 👥 Devices |
| --- | --- | --- |
| `modbus_tcp.conf` | Rotating CSV | Single |
| `modbus_to_csv.conf` | Rotating CSV | Single / Multi |
| `modbus_to_sqlite.conf` | SQLite | Single / Multi |
| `modbus_to_mysql.conf` | MySQL / MariaDB | Single / Multi |
| `modbus_to_mssql.conf` | SQL Server | Single / Multi |
| `modbus_to_postgres.conf` | PostgreSQL | Single / Multi |
| `modbus_to_influxdb.conf` | InfluxDB v2 | Single / Multi |
| `modbus_to_mqtt.conf` | MQTT (one topic per field) | Single / Multi |
| `modbus_to_opcua.conf` | MQTT JSON bridge for an OPC UA gateway | Single / Multi |

Each file has a matching `.bat` launcher. Multi-device variants are named
`multi_modbus_to_*.conf` and are selected from the launcher menu.

---

## 🚀 Quick start

```powershell
cd Projects\Telegraf\Modbus

# One cycle on screen
.\Modbus TCP Outputs\modbus_to_csv.bat test

# Continuous collection
.\Modbus TCP Outputs\modbus_to_csv.bat

# Multi-device mode
.\Modbus TCP Outputs\modbus_to_csv.bat
#   then choose [2]
```

---

## ⚙️ Defaults

- Controller: `tcp://127.0.0.1:502` (local simulator)
- Slave ID: `1`
- Registers: `HR_0` … `HR_9` (`UINT16`, `AB`)
- Poll interval: `5s`
- Data folder: `C:/ProgramData/Telegraf/Modbus`
- Health endpoint: `http://127.0.0.1:8080/health`

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

---

## 🛡️ Security

Modbus TCP is plaintext on port 502. Keep devices on an isolated OT VLAN,
restrict the port with a firewall allow-list, and use read-only function codes
where possible. Never expose port 502 to the internet.

No password is stored in any config or launcher. Database and MQTT credentials
come from environment variables — see the parent [`README.md`](../README.md).

---

## ✅ Validation

```powershell
.\validate.ps1
```

All 34 Modbus configurations pass `telegraf config check` on Telegraf 1.40.3.
