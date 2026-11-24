# ⚡ Telegraf 2-Point Data Collection 📊

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

## 🚀 2. Quick Start: Read Modbus Registers
This project is configured to read **10 holding registers** (`HR_0` … `HR_9`) from a Modbus TCP server (e.g., local simulator on `127.0.0.1:502`).

Test a single collection cycle (reads data, writes nothing to disk):

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_csv.conf" --test
```

### What you will see:
```text
> modbus_wide,area=area1,...,name=Device1,site=site1,slave_id=1 HR_0=42,HR_1=100,...,HR_9=9 1716200000000000000
```
*(All 10 registers in one wide row — the narrow layout (one row per tag) is logged too.)*

---

## 🏃 3. Run Continuously & Save to CSV
To run continuously and save all values (wide + narrow layouts) to daily-rotating CSV files, remove `--test`:

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_csv.conf"
```

---

## 📁 4. Files & Structure

| Folder | Contents |
| --- | --- |
| [`Modbus/Modbus TCP Outputs`](Modbus/Modbus%20TCP%20Outputs/README.md) | 8 configs + 8 `.bat` launchers (CSV, SQLite, MQTT, MySQL, MSSQL, PostgreSQL, InfluxDB, OPC UA publisher) |
| [`Modbus/Modbus RTU Output`](Modbus/Modbus%20RTU%20Output/README.md) | Same 8 solutions for serial devices (tested live on COM1) |
| [`MQTT`](MQTT/README.md) | 8 runnable configs → CSV, SQLite, MySQL, MSSQL, PostgreSQL, InfluxDB, MQTT bridge, OPC UA server pipeline (+ writer gateway) |
| [`OPC-UA`](OPC-UA/README.md) | 7 runnable configs → CSV, SQLite, MySQL, MSSQL, PostgreSQL, InfluxDB, MQTT (RAW/JSON/Sparkplug + gateway) |
| [`ConfigBuilder`](ConfigBuilder/README.md) | Local web app that generates any of the above `.conf` files from a form |

> **OPC DA and BACnet:** their configs, launchers and the `opcda.exe` helper
> live in the PRIVATE repository at `Projects/Telegraf/OPC-DA/` and
> `Projects/Telegraf/BACnet/`. Copy **both** `opcda.exe` and `opcda.conf` into
> `C:\ProgramData\Telegraf\OPC-DA\` before running an OPC DA launcher. Telegraf
> starts the exe via `[[inputs.execd]]` with `-config <that folder>\opcda.conf`;
> the exe reads the tags from the OPC DA server and prints Influx Line Protocol
> to stdout for Telegraf. If the exe is missing, download `opcda_i386.exe` from
> https://github.com/lpc921/telegraf-execd-opcda/releases and rename it to
> `opcda.exe` (32-bit binary for a 32-bit OPC server).

Every config has a matching `.bat` launcher — **double-click it to run**. Add the `test` argument for a single test cycle. The launchers set local test defaults only; move credentials to the Telegraf service environment before plant deployment.

All 16 Modbus configs and the updated MQTT / OPC UA configs pass `telegraf config check` (Telegraf 1.40.3).

---

## ✅ Testing status

Last live tests: **2026-11-22** (Modbus TCP simulator :502, Modbus RTU device on COM1, MQTT broker, MySQL, PostgreSQL, ProSys OPC UA server) and **2026-11-24** (Matrikon OPC DA Simulation Server, 45 supported tags: CSV, SQLite and MQTT JSON/RAW). Multi-device support lives in the commented ADDITIONAL DEVICES block inside each Modbus config.

| 🔌 Source | 📄 Config file | 📤 Output | 📦 Payload | ✅ Status |
| --- | --- | --- | --- | --- |
| Modbus TCP | `modbus_to_csv.conf` | CSV | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_mqtt.conf` | MQTT | Raw payload + JSON payload | ✅&nbsp;Tested |
| OPC UA | `opcua_to_mqtt.conf` | MQTT | Raw payload + JSON payload | ✅&nbsp;Tested |
| OPC UA | `opcua_to_csv.conf` | CSV | Wide + Narrow | ✅&nbsp;Tested |
| OPC UA | `opcua_to_sqlite.conf` | SQLite | Wide + Narrow | ✅&nbsp;Tested |
| OPC UA | `opcua_to_mysql.conf` | MySQL | Wide + Narrow | ✅&nbsp;Tested |
| OPC UA | `opcua_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| OPC UA | `opcua_to_postgres.conf` | PostgreSQL | Wide + Narrow | ✅&nbsp;Tested |
| OPC UA | `opcua_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| OPC DA | `opcda_to_csv.conf` | CSV | Wide + Narrow | ✅&nbsp;Tested |
| OPC DA | `opcda_to_sqlite.conf` | SQLite | Wide + Narrow | ✅&nbsp;Tested |
| OPC DA | `opcda_to_mqtt.conf` | MQTT | JSON payload | ✅&nbsp;Tested |
| OPC DA | `opcda_to_mqtt.conf` | MQTT | Raw payload | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_mysql.conf` | MySQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus TCP | `modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus TCP | `modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_csv.conf` | CSV | Wide + Narrow | ✅&nbsp;Tested |
| Modbus RTU | `modbus_to_sqlite.conf` | SQLite | Wide + Narrow | ✅&nbsp;Tested |
| Modbus RTU | `modbus_to_mqtt.conf` | MQTT | JSON payload | ✅&nbsp;Tested |
| Modbus RTU | `modbus_to_mysql.conf` | MySQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus RTU | `modbus_to_mssql.conf` | MSSQL | Wide + Narrow | ❌&nbsp;Pending |
| Modbus RTU | `modbus_to_postgres.conf` | PostgreSQL | Wide + Narrow | ✅&nbsp;Tested |
| Modbus RTU | `modbus_to_influxdb.conf` | InfluxDB&nbsp;v2 | Wide + Narrow | ❌&nbsp;Pending |

| 🔌 Protocol | 🗄️ SQLite | 📄 CSV | 🐬 MySQL | 🪟 MSSQL | 🐘 Postgres | 📨 MQTT | 📈 InfluxDB | 🔗 OPC UA |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Modbus | ✅ | ✅ | ✅ | | ✅ | ✅ | | |
| OPC UA | ✅ | ✅ | ✅ | | ✅ | ✅ | | |
| MQTT | | | | | | | | |
| BACnet | | | | | | | | |
| OPC DA | ✅ | ✅ | | | | ✅ | | |

> **OPC DA live evidence (2026-11-24):** CSV wide + narrow files; SQLite
> `opcda_data.db` with `opcda_wide` + `opcda_narrow`; MQTT JSON topic
> `plant/opcda/json` and RAW topic `plant/opcda/raw/<tag>`.

> **Wide vs narrow:** **Wide** stores one row per poll with all tags as columns
> (`modbus_wide` / `opcua_wide`). **Narrow** stores one row per tag per poll with
> `timestamp`, tag ID/name and `value` (`modbus_narrow` / `opcua_narrow`).
> Modbus files log BOTH layouts (separate files/tables — not duplicates); OPC UA ships wide and narrow as separate `*_wide`/`*_narrow` configs. MQTT ships JSON payload mode (RAW is the commented alternative).

> **Repository rule:** all source code and real configs live in this private repository. The public repository gets README/demo items only.

---

## 📚 Reference
- [Telegraf Documentation](https://docs.influxdata.com/telegraf/v1/)
- [Modbus Input Plugin](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
