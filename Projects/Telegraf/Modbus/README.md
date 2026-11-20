# Modbus with Telegraf ⚡

This folder contains Telegraf configurations for collecting Modbus data over **TCP** and **RTU**.

| Transport | Connection | Status |
| --- | --- | --- |
| **Modbus TCP** 🌐 | Network address + TCP port | ✅ Tested (sample server) |
| **Modbus RTU** 🔌 | Serial port + framing settings | 🧪 Draft (placeholders) |

Each transport folder includes a detailed guide and ready-to-use configurations.

---

## 🧭 Choose a Guide

- **[Modbus TCP Outputs](Modbus%20TCP%20Outputs/README.md)** — For network-connected devices.
- **[Modbus RTU Output](Modbus%20RTU%20Output/README.md)** — For serial-connected devices.

---

## 🛠️ General Notes

1. **Install Telegraf** first using the [setup guide](../README.md).
2. **Configure**: Update IP/port, serial settings, slave ID, and register maps to match *your* device.
3. **Validate**: Always use `--test` first to verify data collection before writing to a destination.
4. **Environment**: Create SQL databases/users and ensure output folders exist *before* running.

---

## 📚 References

- [Telegraf Modbus Input](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
- [Telegraf SQL Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/sql/README.md)
- [Telegraf MQTT Output](https://github.com/influxdata/telegraf/blob/v1.40.3/plugins/outputs/mqtt/README.md)
