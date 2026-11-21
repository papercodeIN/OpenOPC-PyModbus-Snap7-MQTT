# 🌐 Modbus TCP Outputs

> 📌 Public repo = documentation/demo only. Runnable `.conf` files and `.bat` launchers live in the PRIVATE repo (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

⚙️ Telegraf configs that read **Modbus TCP** holding registers and deliver them to a file, a database or a broker. Pick one, set your device and destination, run its `.bat` launcher.

## 📦 Project details

| 📄 Config file | 📥 Source | 📤 Destination / output | 👥 Devices | 💡 What it does |
| --- | --- | --- | --- | --- |
| `modbus_tcp.conf` | Modbus TCP | stdout (JSON) + CSV | Single | Prints readings live and also writes them to a CSV file. |
| `modbus_to_csv.conf` | Modbus TCP | Dated CSV file | Single / Multi | Logs register values into a date-stamped CSV file. |
| `modbus_to_sqlite.conf` | Modbus TCP | SQLite database | Single / Multi | Stores readings in a local SQLite database. |
| `modbus_to_mqtt.conf` | Modbus TCP | MQTT topics | Single / Multi | Publishes every field to its own device-scoped MQTT topic. |
| `modbus_to_mysql.conf` | Modbus TCP | MySQL / MariaDB | Single / Multi | Stores readings in a MySQL or MariaDB table. |
| `modbus_to_mssql.conf` | Modbus TCP | SQL Server | Single / Multi | Stores readings in a Microsoft SQL Server table. |
| `modbus_to_postgres.conf` | Modbus TCP | PostgreSQL | Single / Multi | Stores readings in a PostgreSQL table. |
| `modbus_to_opcua.conf` | Modbus TCP | JSON → external OPC UA gateway | Single / Multi | Feeds Modbus readings to an OPC UA gateway through JSON. |
| `modbus_to_influxdb.conf` | Modbus TCP | InfluxDB v2 | Single / Multi | Sends readings to InfluxDB for charts and dashboards. |

▶️ **Use:** double-click the matching `.bat`, choose **[1] Single device** or **[2] Multiple devices**, then edit `controller`, `slave_id`, registers and destination inside the `.conf`.
