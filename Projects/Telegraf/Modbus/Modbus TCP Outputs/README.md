# Modbus TCP Outputs 🌐

> 📌 Public repo = documentation/demo only. Runnable `.conf` files and `.bat` launchers live in the PRIVATE repo (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

Tested with **Telegraf 1.40.3** against a local Modbus TCP simulator: `127.0.0.1:502`, slave ID `1`, holding registers `HR_0`–`HR_9`. All configs pass `telegraf config check`.

---

## Quick start

| Step | Action |
| --- | --- |
| 1 | Start the Modbus TCP server (`127.0.0.1:502`, slave `1`, 10 holding registers) |
| 2 | Edit `controller`, `slave_id`, register map and destination in the chosen `.conf` |
| 3 | Test one cycle: `telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_csv.conf" --test` |
| 4 | Run: double-click the `.bat` → **[1] Single device** / **[2] Multiple devices** (`multi_*` config) |

> `--test` prints readings but **stores nothing**. Stop with **Ctrl+C**. Each `.bat` handles both single and multi modes; multi files have 5 device blocks (1 active, 4 commented).

---

## Configs

| Config | Purpose | Launcher |
| --- | --- | --- |
| `modbus_tcp.conf` | Starter (JSON to terminal + CSV) | `modbus_tcp.bat` |
| `modbus_to_csv.conf` | ✅ Daily CSV logger | `modbus_to_csv.bat` |
| `modbus_to_sqlite.conf` | ✅ SQLite logger | `modbus_to_sqlite.bat` |
| `modbus_to_mqtt.conf` | ✅ MQTT publisher (one topic per field) | `modbus_to_mqtt.bat` |
| `modbus_to_mysql.conf` | MySQL / MariaDB logger | `modbus_to_mysql.bat` |
| `modbus_to_mssql.conf` | SQL Server logger | `modbus_to_mssql.bat` |
| `modbus_to_postgres.conf` | PostgreSQL logger | `modbus_to_postgres.bat` |
| `modbus_to_opcua.conf` | JSON for an external OPC UA gateway | `modbus_to_opcua.bat` |
| `modbus_to_influxdb.conf` | InfluxDB v2 logger | `modbus_to_influxdb.bat` |

---

## Verified destinations (single device)

Shared settings for all three: `interval = "10s"` · `controller = "tcp://127.0.0.1:502"` · `slave_id = 1` · `HR_0`–`HR_9` at addresses `0–9` (`UINT16`, `AB`, scale `1.0`). Coils / discrete / input registers are commented out — the simulator returns *illegal function / illegal data address* for them.

| Destination | Config | Output / naming | Key settings | Verified result |
| --- | --- | --- | --- | --- |
| **CSV** | `modbus_to_csv.conf` | `C:/ModbusData/modbus_csv_data_<YYYY-MM-DD_HHMMSS>.csv` | `csv_header = true`, `rotation_interval = "24h"`, `rotation_max_archives = 30` | Header + `HR_0`–`HR_9` rows written; unique file per run |
| **SQLite** | `modbus_to_sqlite.conf` | `file:C:/<your folder>/modbus_sqlite_data.db` | `[outputs.sql]`, `driver = "sqlite"` | `.db` file, `modbus` table and rows created **automatically** on first insert |
| **MQTT** | `modbus_to_mqtt.conf` | `telegraf/modbus/<slave_id>/<device_name>/<field>` e.g. `telegraf/modbus/1/Device/HR_0` | `layout = "field"`, broker `tcp://127.0.0.1:1883`, QoS `1`, `keep_alive = 30` | Scalar values published; topics unique per device |

| Detail | CSV | SQLite | MQTT |
| --- | --- | --- | --- |
| Auto-created output | file on first row | file + table + columns | topic on first message |
| Prerequisite | parent folder exists | parent folder exists | broker running |
| Uniqueness | `CSV_STAMP` = run start time; else `nostamp` | one `.db` file | slave ID + configured `name` in topic |
| Client ID | — | — | **unset → random per connection** (no clashes) |
| Fallback if run directly | `modbus_csv_data_nostamp.csv` | edit path in config | works with local broker |
| Table / columns | `time`, `name`, tags, `HR_0`…`HR_9` | `modbus`: `timestamp`, `host`, `name`, `slave_id`, `type`, `HR_0`…`HR_9` | one topic per field |

---

## Environment variables (no secrets in `.conf`)

| Config | Variables |
| --- | --- |
| `modbus_to_mqtt.conf`, `modbus_to_opcua.conf` | `MQTT_BROKER_URL`, `MQTT_USERNAME`, `MQTT_PASSWORD` (+ TLS paths) |
| `modbus_to_mysql.conf` | `MYSQL_DSN` |
| `modbus_to_mssql.conf` | `MSSQL_DSN` |
| `modbus_to_postgres.conf` | `POSTGRES_DSN` |
| `modbus_to_influxdb.conf` | `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET` |
| CSV / SQLite / starter | none — edit the path inside the config |

> In production use `ssl://` with TLS verification and a least-privilege account. The SQL plugin creates tables, **not** databases or users — provision those first.

---

## Troubleshooting

| Issue | Check |
| --- | --- |
| Connection refused / timeout | Device online? IP/port correct? Firewall allows TCP? |
| Illegal address | Register map / address range |
| Zero or unexpected values | Register map, data type, scale, byte order |
| Missing file / DB error | Parent folder exists and is writable? |
| MQTT / SQL errors | Broker/server running? Credentials, topic and path correct? |

## References

- [Modbus Overview](../README.md)
- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
