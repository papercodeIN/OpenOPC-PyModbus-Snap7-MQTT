# JavaScript Modbus Projects

Node.js Modbus TCP/IP and RTU projects from Fusion Automate. The source code is maintained in the private repository; this public folder contains project summaries only.

## Modbus TCP-RTU Converter

A transparent gateway forwards supported Modbus TCP client requests to a Modbus RTU device over a serial connection, then returns the device response. No register map or polling configuration is required for forwarding; the optional point list is only for the local monitor.

- Supported TCP function codes: FC1–FC6, FC15, FC16 and FC23.
- The example uses COM1, 9600 baud, 8N1, unit ID 1. It starts with no configured points; the optional point list is monitor-only.
- Writes are forwarded by default; the private UI can disable TCP write forwarding. Modbus TCP has no authentication or encryption, and the gateway defaults to loopback.
- This is standard-function-code forwarding, not an arbitrary raw-PDU tunnel. Unit-ID 0 broadcast is not supported.
- A previous read-only probe of the attached device confirmed FC3 address 0 and observed Illegal Function for FC1, FC2 and FC4; device-supported functions vary by target.

The private source includes a themed web UI, configurable point map, API, tests and Windows launch/task helpers. Hardware support depends on the serial adapter, device register map and OS permissions. No source code is published in this public repository.

## Other projects

See each project README as it becomes available for the Modbus Client Monitor, Modbus Server, and database/MQTT loggers.
