# Projects — Tools and Protocol Compatibility

This folder contains platform-based examples: `Grafana`, `JavaScript`, `Node-RED`, `Python` and `Telegraf` (working version: **Telegraf 1.40.3**). The table below shows which industrial protocols each tool can connect to.

## Tool vs Protocol

Tick = supported. Warning = possible through community/external help, but not official. Cross = not supported.

| Tool | BACnet | Modbus | OPC DA | OPC UA | MQTT | IEC-104 | DNP3 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Python** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Node-RED** | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| **JavaScript (Node.js)** | ✅ | ✅ | ⚠️ | ✅ | ✅ | ⚠️ | ⚠️ |
| **Telegraf** | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Grafana** | ⚠️ | ⚠️ | ⚠️ | ✅ | ✅ | ❌ | ❌ |

### How to read this

- **Python, JavaScript and Node-RED** are protocol clients/servers you can script or wire with flows. Python has the widest library coverage.
- **Telegraf** is a collector: it reads supported protocols and writes to destinations such as InfluxDB/Prometheus. This project uses its MQTT, Modbus and OPC UA plugins; BACnet, OPC DA, IEC-104 and DNP3 are not supported here.
- **Grafana** is visualization only: MQTT and OPC UA are supported through official plugins; other protocols arrive through Telegraf or a gateway.
- **OPC DA** is Windows COM/DCOM based, so non-Windows tools need a DA→UA gateway or the OPC Foundation COMIOP wrapper.

