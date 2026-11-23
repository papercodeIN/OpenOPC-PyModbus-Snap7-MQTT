# JavaScript Modbus Projects

Node.js Modbus TCP/IP and RTU projects from Fusion Automate. The source code is maintained in the private repository; this public folder contains project summaries only.

## Modbus TCP-RTU Converter

A bidirectional gateway that polls configured Modbus RTU points over a serial connection and exposes the latest good values through a Modbus TCP server. Optional TCP writes can be forwarded to the RTU device after explicit configuration and per-point permission.

- Supported transports: Modbus RTU serial source and Modbus TCP gateway.
- Supported TCP function codes: FC1–FC6, FC15 and FC16.
- The example configuration uses COM1, 9600 baud, 8N1, unit ID 1, and integer holding registers 0–9 named “Holding register 0” through “Holding register 9”.
- Global polling defaults to 50 ms and contiguous registers are read in grouped FC3 requests; address gaps are read as separate ranges.
- Verified on the attached device with read-only polling: FC3 address 0 succeeded; FC1, FC2 and FC4 returned Illegal Function.
- Write-back is disabled by default. Modbus TCP has no authentication or encryption; the gateway defaults to loopback.

The private source includes a themed web UI, configurable point map, API, tests and Windows launch/task helpers. Hardware support depends on the serial adapter, device register map and OS permissions. No source code is published in this public repository.

## Other projects

See each project README as it becomes available for the Modbus Client Monitor, Modbus Server, and database/MQTT loggers.
