# Modbus with Telegraf ⚡

> 📌 **Public repo is documentation/demo only.** Runnable `.conf` files and `.bat` launchers are kept in the private repository (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

This folder contains industry-ready Telegraf configurations for collecting Modbus data over **TCP** and **RTU**, plus one-click Windows launchers for every config.

| Transport | Connection | Status |
| --- | --- | --- |
| **Modbus TCP** 🌐 | Network address + TCP port | ✅ Tested (sample server) |
| **Modbus RTU** 🔌 | Serial port + framing settings | 🧪 Draft (placeholders) |

All `.conf` files pass `telegraf config check`. Live device and destination tests are deployment-specific — run them with the launchers below and report the output.

---

## 🧭 Choose a Guide

- **[Modbus TCP Outputs](Modbus%20TCP%20Outputs/README.md)** — For network-connected devices.
- **[Modbus RTU Output](Modbus%20RTU%20Output/README.md)** — For serial-connected devices.

---

## 📦 Solutions (available for both TCP and RTU)

Each folder has the same nine configs, and each config has a matching `.bat` launcher (double-click to run; add `test` as an argument for one cycle).

| Solution | Config | Destination |
| --- | --- | --- |
| CSV data logger | `modbus_to_csv.conf` | Daily-rotating CSV |
| SQLite data logger | `modbus_to_sqlite.conf` | Local SQLite file |
| MQTT publisher | `modbus_to_mqtt.conf` | MQTT broker, one topic per field |
| MySQL data logger | `modbus_to_mysql.conf` | MySQL / MariaDB |
| MSSQL data logger | `modbus_to_mssql.conf` | Microsoft SQL Server |
| PostgreSQL data logger | `modbus_to_postgres.conf` | PostgreSQL |
| OPC UA publisher | `modbus_to_opcua.conf` | JSON → MQTT → **external** OPC UA gateway |
| InfluxDB data logger | `modbus_to_influxdb.conf` | InfluxDB v2 |
| Starter | `modbus_tcp.conf` / `modbus_rtu.conf` | Screen + daily CSV |

> Telegraf **cannot** host an OPC UA server. `modbus_to_opcua.conf` publishes to `opcua/bridge/#`; a separately selected, secured gateway maps those topics to OPC UA nodes.

---

## 🛠️ General Notes

1. **Install Telegraf** first using the [setup guide](../README.md).
2. **Configure**: update IP/port or serial settings, slave ID, and register map to match *your* device.
3. **Secrets**: the configs contain no passwords or tokens. Set the environment variables listed in each guide's `.bat` (local test defaults only); for plant deployment use the Telegraf Windows service environment, TLS broker URLs and least-privilege accounts.
4. **Provision first**: create SQL databases/logins and the InfluxDB bucket, and make sure CSV/SQLite folders exist *before* running. The SQL plugin creates tables but not databases or users.
5. **Validate**: run a launcher with the `test` argument first, then run it normally for continuous collection.

---

## 📚 References

- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
- [Telegraf SQL Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/sql/README.md)
- [Telegraf MQTT Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/mqtt/README.md)
- [Telegraf InfluxDB v2 Output](https://docs.influxdata.com/telegraf/v1/output-plugins/influxdb_v2/)
