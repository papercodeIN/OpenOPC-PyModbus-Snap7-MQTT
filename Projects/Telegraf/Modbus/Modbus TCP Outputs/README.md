# Modbus TCP Outputs 🌐
    
> 📌 **Public repo is documentation/demo only.** Runnable `.conf` files and `.bat` launchers are kept in the private repository (`OpenOPC-PyModbus-Snap7-MQTT-Private`).

This guide covers Telegraf Modbus TCP configurations for network connections.

> ✅ **Status:** Sample server setup (`127.0.0.1:502`, unit ID `1`, holding registers `0–9`) was tested with Telegraf 1.40.3. All configs pass `telegraf config check`; live destination tests are deployment-specific and left to you. Update device settings before production.

---

## 🚀 Quick Start
    
1. **Prerequisites**: Telegraf installed, Modbus TCP device/simulator reachable, device documentation in hand.
2. **Setup**: Identify your device's IP address, port, and unit ID.
3. **Test**: Run one collection cycle to verify data:
   ```powershell
   telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf" --test
   ```
    
---

## 📝 Configuration
    
Each `.conf` file handles one destination. Update it with your actual device and destination settings.
    
| Config | Purpose | Launcher |
| --- | --- | --- |
| `modbus_tcp.conf` | Starter (JSON to terminal + CSV) | `modbus_tcp.bat` |
| `modbus_to_csv.conf` | Daily-rotating CSV data logger | `modbus_to_csv.bat` |
| `modbus_to_sqlite.conf` | SQLite data logger | `modbus_to_sqlite.bat` |
| `modbus_to_mqtt.conf` | MQTT publisher (one topic per field) | `modbus_to_mqtt.bat` |
| `modbus_to_mysql.conf` | MySQL / MariaDB data logger | `modbus_to_mysql.bat` |
| `modbus_to_mssql.conf` | Microsoft SQL Server data logger | `modbus_to_mssql.bat` |
| `modbus_to_postgres.conf` | PostgreSQL data logger | `modbus_to_postgres.bat` |
| `modbus_to_opcua.conf` | JSON publisher for an **external** OPC UA gateway | `modbus_to_opcua.bat` |
| `modbus_to_influxdb.conf` | InfluxDB v2 data logger | `modbus_to_influxdb.bat` |

Every config has a matching `.bat` launcher — double-click it, then choose **[1] Single device** (default) or **[2] Multiple devices**, which runs the matching `multi_modbus_to_*.conf`. The single-device configs are unchanged; multi variants have 5 device blocks (1 active, 4 commented placeholders). The `.bat` files set **local test defaults only**; replace every `CHANGE_ME` and move the variables into the Telegraf Windows service environment before plant deployment.

### ✅ Single Modbus TCP → CSV data logger (verified: holding registers)

`modbus_to_csv.conf` + `modbus_to_csv.bat` is the tested, working path for logging holding registers from one Modbus TCP device.

| Item | Value |
| --- | --- |
| Config / launcher | `modbus_to_csv.conf` / `modbus_to_csv.bat` (choose **[1] Single device**) |
| Device | Modbus TCP simulator at `tcp://127.0.0.1:502`, `slave_id = 1` |
| Registers | Holding registers `HR_0`–`HR_9`, addresses `0–9`, `data_type = "UINT16"`, `byte_order = "AB"`, `scale = 1.0` |
| Poll / flush | `interval = "10s"`, `flush_interval = "10s"` |
| Outputs | `stdout` (JSON, live viewing) + dated CSV file |
| CSV path | `C:/ModbusData/modbus_csv_data_<YYYY-MM-DD_HHMMSS>.csv` |
| CSV options | `data_format = "csv"`, `csv_header = true`, `rotation_interval = "24h"`, `rotation_max_archives = 30` |
| Telegraf version | 1.40.3 — passes `telegraf config check` |

**Verified:** with the local simulator serving holding registers 0–9, a test run returns the expected `HR_0`–`HR_9` values and appends them as CSV rows with a header. Other areas (coils, discrete inputs, input registers) are commented out in the config because that simulator returns *illegal function* / *illegal data address* for them — uncomment them only for a device that supports those function codes and adjust the register map.

**Run it:**
1. Create the destination folder: `C:\ModbusData` (the parent folder must already exist).
2. Start the Modbus TCP server on `127.0.0.1:502` with slave ID `1` and 10 holding registers.
3. Double-click `modbus_to_csv.bat` and choose **[1] Single device**.
4. The launcher sets `CSV_STAMP = YYYY-MM-DD_HHMMSS` (run start time), so every run writes a unique file; the console prints the exact CSV path. Running Telegraf directly without the launcher falls back to `modbus_csv_data_nostamp.csv`.
5. Stop with **Ctrl+C**. Existing `rotation_interval` / `rotation_max_archives` keep long-running sessions rotating daily and retaining 30 files.

**CSV columns:** `time`, `name`, `tags` (host, etc.) and one field per register (`HR_0` … `HR_9`).

> ⚠️ These are local test defaults. For production, point `controller`/`slave_id` at the real device, adjust the register map to its documentation, and change the output path to a writable, retained location.

### ✅ Single Modbus TCP → SQLite data logger (verified: holding registers)

`modbus_to_sqlite.conf` + `modbus_to_sqlite.bat` is the tested, working path for logging holding registers into a local SQLite database.

| Item | Value |
| --- | --- |
| Config / launcher | `modbus_to_sqlite.conf` / `modbus_to_sqlite.bat` (choose **[1] Single device**) |
| Device | Modbus TCP simulator at `tcp://127.0.0.1:502`, `slave_id = 1` |
| Registers | Holding registers `HR_0`–`HR_9`, addresses `0–9`, `data_type = "UINT16"`, `byte_order = "AB"`, `scale = 1.0` |
| Poll interval | `interval = "10s"` |
| Output | `[outputs.sql]`, `driver = "sqlite"` |
| Database file | `data_source_name = "file:C:/ModbusData/modbus_sqlite_data.db"` (set your own absolute path) |
| Table | `modbus` — `timestamp` + tag columns (`host`, `name`, `slave_id`, `type`) + one column per field (`HR_0` … `HR_9`) |
| Telegraf version | 1.40.3 — built-in pure-Go SQLite driver, no database server needed |

**Auto-creation (verified):** on the first insert Telegraf creates **the database file, the table, and all columns automatically** — you do **not** create the `.db` file yourself. The only requirement is that the **parent folder already exists** (SQLite will not create missing directories). The single-device config ships with a test path under `C:/Users/Parrot/Desktop/ModbusDat/` — change `data_source_name` to your own writable location.

**Verified:** tested against the local simulator's holding registers 0–9; the `.db` file, `modbus` table and logged rows were all created automatically and the readings stored correctly.

**Run it:**
1. Create the parent folder, e.g. `C:\ModbusData`.
2. Set `data_source_name` in `[outputs.sql]` to your absolute `.db` path (forward slashes are fine).
3. Start the Modbus TCP server on `127.0.0.1:502`, slave ID `1`, with 10 holding registers.
4. Run `modbus_to_sqlite.bat` and choose **[1] Single device**, or:
   ```powershell
   telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_sqlite.conf"
   ```
   Do **not** use `--test` for storage — it prints readings only and stores nothing.
5. Stop with **Ctrl+C**, then open the `.db` in any SQLite viewer to see the `modbus` table.

### ✅ Single Modbus TCP → MQTT publisher (verified: holding registers)

`modbus_to_mqtt.conf` + `modbus_to_mqtt.bat` is the tested, working path for publishing holding registers from one Modbus TCP device to an MQTT broker.

| Item | Value |
| --- | --- |
| Config / launcher | `modbus_to_mqtt.conf` / `modbus_to_mqtt.bat` (choose **[1] Single device**) |
| Device | Modbus TCP simulator at `tcp://127.0.0.1:502`, `slave_id = 1` |
| Registers | Holding registers `HR_0`–`HR_9`, addresses `0–9`, `data_type = "UINT16"`, `byte_order = "AB"`, `scale = 1.0` |
| Poll interval | `interval = "10s"` |
| Broker | `servers = ["tcp://127.0.0.1:1883"]`, QoS 1, `keep_alive = 30` |
| Layout | `layout = "field"` — one message per field, payload is the scalar value |
| Topic | `telegraf/modbus/<slave_id>/<device_name>/<field>` |
| Example | `telegraf/modbus/1/Device/HR_0` → `1310` |
| Client ID | **unset** — Telegraf generates a random ID per connection, so multiple instances never clash |
| Telegraf version | 1.40.3 — passes `telegraf config check` |

**Topic uniqueness:** the prefix uses both the device's **slave ID** and the **`name`** you set in the `[[inputs.modbus]]` block (`name = "Device"` by default). Two devices that both expose `HR_0` publish to different topics, so their readings never overwrite each other. In multi-device configs, give every device block a unique name (`Device1`, `Device2`, …).

**Verified:** single-device Modbus TCP → MQTT tested and working — the broker receives the expected topics and holding-register values. The alternative JSON output block (`OUTPUT 2B`) is commented out; only RAW scalar mode is active.

**Run it:**
1. Start an MQTT broker on `127.0.0.1:1883` and the Modbus TCP server on `127.0.0.1:502` (slave ID `1`, 10 holding registers).
2. Double-click `modbus_to_mqtt.bat` and choose **[1] Single device**.
3. Watch the topics with any MQTT client, e.g.:
   ```powershell
   python -c "import paho.mqtt.client as m,time; c=m.Client(); c.on_message=lambda *a: print(a[3].topic, a[3].payload.decode()); c.connect('127.0.0.1'); c.subscribe('telegraf/modbus/#'); c.loop_start(); time.sleep(30)"
   ```
4. Stop the publisher with **Ctrl+C**.

> ⚠️ Local test defaults only. Point `servers`/credentials at your real broker (use `ssl://` with verification in production) and set a unique `name` per device. Leave `client_id` commented to keep the random-ID behaviour.

### 🔑 Environment variables (no secrets in the `.conf` files)

| Config | Variables |
| --- | --- |
| `modbus_to_mqtt.conf`, `modbus_to_opcua.conf` | `MQTT_BROKER_URL`, `MQTT_USERNAME`, `MQTT_PASSWORD` (+ TLS paths for plant) |
| `modbus_to_mysql.conf` | `MYSQL_DSN` |
| `modbus_to_mssql.conf` | `MSSQL_DSN` |
| `modbus_to_postgres.conf` | `POSTGRES_DSN` |
| `modbus_to_influxdb.conf` | `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET` |
| CSV / SQLite / starter | none — edit the file path inside the config |

> Use an `ssl://` broker URL with TLS verification and a least-privilege account in production. Provision databases/logins and the bucket first; the SQL plugin creates tables but not databases or users.

### 🌐 Modbus → OPC UA and → InfluxDB

- `modbus_to_opcua.conf` is a **runnable publisher**: Telegraf has no OPC UA server output, so it publishes JSON to `opcua/bridge/#` for a separately secured external gateway (Node-RED, asyncua, Kepware, Ignition, ...). The gateway maps topics to OPC UA nodes and hosts the server with `SignAndEncrypt`.
- `modbus_to_influxdb.conf` writes points to InfluxDB v2 with a write-only token. Grafana queries InfluxDB; it is not a Telegraf output.

---

## 🛠️ Step-by-Step Configuration
    
1. **Edit** the selected `.conf` file.
2. **Update Device Settings**:
   - `controller`: e.g., `tcp://192.168.1.20:502`.
   - `slave_id`: Match device.
3. **Update Registers**: Adjust to match your specific register map (defaults are `HR_0`–`HR_9`).
4. **Update Destination**: Update file/database paths, broker addresses, and credentials.
5. **Run**:
   - `--test` first to confirm.
   - Remove `--test` to run continuously:
     ```powershell
     telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_to_csv.conf"
     ```

---

## 🔍 Troubleshooting

| Issue | Check |
| --- | --- |
| Connection Refused/Timeout | Device online? IP/Port correct? Firewall allows TCP? |
| Illegal Address | Register map compatibility. |
| Zero/Unexpected Values | Register map, data type, scale, byte order. |
| Missing File/DB Error | Folder exists? Writable? |
| MQTT/SQL Errors | Broker/Server running? Credentials/Topic correct? |
    
---
    
## 📚 References
    
- [Modbus Overview](../README.md)
- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
