# Telegraf Config Builder — Demo

A local web app that generates production-ready Telegraf configuration files
from a form. Select a protocol, choose a destination, set the parameters, and
download a ready-to-run `.conf` plus a Windows `.bat` launcher.

> This is the **demo/description only**. The full source code is kept in the
> private repository (as are all real configuration files).

---

## What it can generate

| Source | Destinations |
|---|---|
| OPC UA | CSV, SQLite, MySQL, MSSQL, PostgreSQL, InfluxDB, MQTT (RAW / JSON / Sparkplug B) |
| Modbus TCP / RTU | CSV, SQLite, MySQL, MSSQL, PostgreSQL, InfluxDB, MQTT — **multiple devices supported** |
| MQTT | CSV, SQLite, MySQL, MSSQL, PostgreSQL, InfluxDB, MQTT bridge, external OPC UA server |

---

## Four-step wizard

1. **Protocol** — OPC UA, Modbus TCP, Modbus RTU or MQTT
2. **Destination** — the output plugin for that pipeline
3. **Settings** — endpoints, nodes/registers/topics, credentials as `${ENV_VAR}`, agent interval. For Modbus TCP/RTU, add multiple devices with their own registers; each becomes its own `[[inputs.modbus]]` block.
4. **Generate** — review, copy, download, or save a browser preset

---

## Theme

The UI follows the same dark industrial theme as the Python MQTT Control Room:
navy panels, amber accents, status pills, a live clock and a left workspace
navigation. Everything runs locally on `127.0.0.1`.

---

## Notes

- Secrets are never written into generated files — only `${ENV_VAR}` references.
- Generated configs are checked with `telegraf --config <file> config check`.
- Telegraf cannot host an OPC UA server; MQTT → OPC UA uses an external writer gateway.
