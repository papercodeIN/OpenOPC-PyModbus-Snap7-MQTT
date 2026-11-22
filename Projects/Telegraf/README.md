# ⚡ Telegraf 2-Point Data Collection 📊

> 📌 **Public repo is documentation/demo only.** Runnable `.conf` files and `.bat` launchers are kept in the private repository (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

Welcome! 🚀 This guide helps newcomers collect **2-point industrial data** (such as 2 sensor values or Modbus registers) quickly and easily using [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) on Windows.

---

## 🛠️ Requirements
- **Windows 10 / 11** (64-bit) 🖥️
- **PowerShell** (pre-installed) ⚡

---

## 📥 1. Install Telegraf (One Command)
Open PowerShell in this folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File ".\install-telegraf.ps1"
```

Verify the installation in a **new** terminal:
```powershell
telegraf --version
```

---

## 🚀 2. Quick Start: Read 2 Data Points
This project is configured to read **2 data points** (`HR_0` and `HR_1`) from a Modbus TCP server (e.g., local simulator on `127.0.0.1:502`).

Test a single collection cycle (reads data, writes nothing to disk):

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf" --test
```

### What you will see:
```text
> modbus,name=Device HR_0=42,HR_1=100 1716200000000000000
```
*(Only your 2 data points are collected!)*

---

## 🏃 3. Run Continuously & Save to CSV
To run continuously and save your 2 data points to a daily-rotating CSV file, remove `--test`:

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf"
```

---

## 📁 4. Files & Structure

| Folder | Contents |
| --- | --- |
| [`Modbus/Modbus TCP Outputs`](Modbus/Modbus%20TCP%20Outputs/README.md) | 9 configs + 9 `.bat` launchers (CSV, SQLite, MQTT, MySQL, MSSQL, PostgreSQL, OPC UA publisher, InfluxDB, starter) |
| [`Modbus/Modbus RTU Output`](Modbus/Modbus%20RTU%20Output/README.md) | Same 9 solutions for serial devices (draft settings) |
| [`MQTT`](MQTT/README.md) | MQTT pipeline overview (demo) — configs live in the private repository |
| [`OPC-UA`](OPC-UA/README.md) | OPC UA pipeline overview (demo) — configs live in the private repository |
| [`ConfigBuilder`](ConfigBuilder/README.md) | Demo of the web app that generates Telegraf configs (source in private repo) |

Every config has a matching `.bat` launcher — **double-click it to run**. Add the `test` argument for a single test cycle. The launchers set local test defaults only; move credentials to the Telegraf service environment before plant deployment.

All 18 Modbus configs pass `telegraf config check` (Telegraf 1.40.3).

---

## ✅ Testing status

| 🔌 Source | 📄 Config file | 📤 Output | 📦 Payload | ✅ Status |
| --- | --- | --- | --- | --- |
| Modbus TCP | `modbus_to_csv.conf` | CSV | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_mqtt.conf` | MQTT | Raw payload + JSON payload | ✅&nbsp;Tested |
| OPC UA | `opcua_to_mqtt.conf` | MQTT | Raw payload + JSON payload | ❌&nbsp;Pending |
| OPC UA | `opcua_to_csv.conf` | CSV | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_sqlite.conf` | SQLite | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `modbus_to_mysql.conf` | MySQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_csv.conf` | CSV | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_mqtt.conf` | MQTT | Raw + JSON | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_mysql.conf` | MySQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_mysql.conf` | MySQL | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_postgres.conf` | PostgreSQL | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_csv.conf` | CSV | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_mqtt.conf` | MQTT | Raw + JSON | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_mysql.conf` | MySQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `multi_modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_csv.conf` | CSV | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_mqtt.conf` | MQTT | Raw + JSON | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_mysql.conf` | MySQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `multi_modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |

> **Wide vs narrow:** **Wide** stores one row per poll with all tags as columns
> (`modbus_wide` / `opcua_wide`). **Narrow** stores one row per tag per poll with
> `timestamp`, tag ID/name and `value` (`modbus_narrow` / `opcua_narrow`).
> Only one output is active per config; comment/uncomment to switch.

> **Repository rule:** this public repository contains README/demo items only. All source code and real configuration files are kept in the private repository.

---

## 📚 Reference
- [Telegraf Documentation](https://docs.influxdata.com/telegraf/v1/)
- [Modbus Input Plugin](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
