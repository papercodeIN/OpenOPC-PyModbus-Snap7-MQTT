# Modbus with Telegraf ⚡

Industry-ready Telegraf 1.40.3 configurations for **Modbus TCP** and **Modbus RTU**.
Every file has exactly **one active data output**, runs wide layout by default, and
passes `telegraf config check`.

| Transport | Folder | Status |
| --- | --- | --- |
| Modbus TCP 🌐 | [`Modbus TCP Outputs`](Modbus%20TCP%20Outputs/README.md) | ✅ Config-checked |
| Modbus RTU 🔌 | [`Modbus RTU Output`](Modbus%20RTU%20Output/README.md) | ✅ Config-checked (serial settings are placeholders) |

**Contents:** 34 `.conf` files, 18 `.bat` launchers, 3 helper scripts.

---

## ✅ What is guaranteed

- One active data output per file (health output is monitoring only).
- Literal defaults in every config; a commented `${VAR}` line is included underneath.
- No real credentials are shipped (values use `CHANGE_ME`).
- No user-specific paths (data folder is `C:/ProgramData/Telegraf/Modbus`).
- Every device metric keeps `name`, `slave_id` and `type` tags.
- Wide layout is the default; narrow layout is a ready-to-enable commented block.
- Internal metrics and a health endpoint are enabled in every config.
- Automatic restart and log file when installed as a scheduled task.

---

## 🧭 Choose a guide

- **[Modbus TCP Outputs](Modbus%20TCP%20Outputs/README.md)** — network devices.
- **[Modbus RTU Output](Modbus%20RTU%20Output/README.md)** — serial devices.

---

## 📦 Solutions

Both folders provide the same nine destinations, single-device and multi-device:

| Destination | Config | Multi-device |
| --- | --- | --- |
| CSV file | `modbus_to_csv.conf` | `multi_modbus_to_csv.conf` |
| SQLite | `modbus_to_sqlite.conf` | `multi_modbus_to_sqlite.conf` |
| MySQL / MariaDB | `modbus_to_mysql.conf` | `multi_modbus_to_mysql.conf` |
| SQL Server | `modbus_to_mssql.conf` | `multi_modbus_to_mssql.conf` |
| PostgreSQL | `modbus_to_postgres.conf` | `multi_modbus_to_postgres.conf` |
| InfluxDB v2 | `modbus_to_influxdb.conf` | `multi_modbus_to_influxdb.conf` |
| MQTT | `modbus_to_mqtt.conf` | `multi_modbus_to_mqtt.conf` |
| OPC UA gateway | `modbus_to_opcua.conf` | `multi_modbus_to_opcua.conf` |
| Starter (CSV) | `modbus_tcp.conf` / `modbus_rtu.conf` | — |

---

## 🚀 Quick start

```powershell
cd Projects\Telegraf\Modbus

# 1. Validate every configuration
.\validate.ps1

# 2. Run one collection cycle
.\Modbus TCP Outputs\modbus_to_csv.bat test

# 3. Run continuously
.\Modbus TCP Outputs\modbus_to_csv.bat
```

Multi-device configs are selected from the launcher menu (`2`) or by running the
`multi_*.bat` config through Telegraf directly.

---

## 🔐 Environment variables

Every setting is a **literal default** you can edit directly, for example
`C:/ProgramData/Telegraf/Modbus` or `tcp://127.0.0.1:1883`. If you prefer
environment variables, the `${VAR}` version is on the commented line directly
underneath each literal value.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `TELEGRAF_DATA_DIR` | all | Data folder. Literal default: `C:/ProgramData/Telegraf/Modbus`. |
| `MYSQL_DSN` | MySQL | `user:password@tcp(host:3306)/database` |
| `MSSQL_DSN` | SQL Server | `sqlserver://user:password@host:1433?database=db` |
| `POSTGRES_DSN` | PostgreSQL | `postgres://user:password@host:5432/db` |
| `INFLUX_URL` / `INFLUX_TOKEN` / `INFLUX_ORG` / `INFLUX_BUCKET` | InfluxDB v2 | Server and write target |
| `MQTT_BROKER_URL` / `MQTT_USERNAME` / `MQTT_PASSWORD` | MQTT, OPC UA | Broker connection |
| `MQTT_TLS_CA` / `MQTT_TLS_CERT` / `MQTT_TLS_KEY` | MQTT TLS | Client certificates (optional) |

To use an environment variable:

1. Comment out the literal line in the `.conf` file.
2. Uncomment the `${VAR}` line underneath it.
3. Set the variable at **machine scope** in PowerShell as Administrator.
4. Restart Telegraf or the scheduled task.

```powershell
[Environment]::SetEnvironmentVariable('MYSQL_DSN','user:password@tcp(host:3306)/database','Machine')
```

To remove it later:

```powershell
[Environment]::SetEnvironmentVariable('MYSQL_DSN',$null,'Machine')
```

Each config file ends with the exact Set and Remove commands for every variable it uses.

---

## 🏭 Production deployment

Use the scheduled-task installer instead of leaving a console window open:

```powershell
.\install-service.ps1 -Config ".\Modbus TCP Outputs\modbus_to_mysql.conf"
Get-ScheduledTask -TaskName 'Telegraf-Modbus' | Get-ScheduledTaskInfo
.\uninstall-service.ps1
```

The task runs as `SYSTEM` at startup, restarts up to three times after a failure,
and writes to `C:\ProgramData\Telegraf\telegraf-modbus.log`.

Health endpoint: `http://127.0.0.1:8080/health`.

---

## 🛡️ Modbus security

Modbus has **no native encryption or authentication**. Before connecting a plant
device:

1. Keep Modbus devices on an isolated OT VLAN.
2. Allow only the required TCP port (502 by default) through the firewall.
3. Use read-only function codes where the process allows it.
4. Never expose port 502 to the internet.
5. Put a Modbus-aware gateway/firewall in front of critical PLCs when required.

MQTT and database outputs support TLS; enable it for any traffic that leaves the
OT network.

---

## 🏷️ Naming and metadata

Every metric carries the tags below, which map cleanly to an ISA-95 / UNS path:

| Tag | Source |
| --- | --- |
| `site`, `area`, `line` | `[global_tags]` — change per plant |
| `name` | device name in `[[inputs.modbus]]` |
| `slave_id` | Modbus unit ID |
| `type` | register area (`holding_register`, `coil`, ...) |

Measurement names: `modbus_wide` (default) and `modbus_narrow` (optional).
Rename `site1` / `area1` / `line1` before deployment.

---

## ✅ Validation

```powershell
.\validate.ps1
```

CI runs the same check on every change to this folder:
`.github/workflows/telegraf-modbus.yml` (Telegraf 1.40.3, SHA-256 verified).
