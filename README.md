# OpenOPC-PyModbus-Snap7-MQTT

Industrial automation toolkit for OPC, Modbus, MQTT, BACnet, IEC104, and DNP3 protocols with Python-based tools, GUI applications, and training simulators.

## Library and Software Used

- OpenOPC (pip install OpenOPC-Python3x)
- opcua (pip install opcua)
- PyModbus (pip install pymodbus)
- pyModbusTCP (pip install pyModbusTCP)
- modbus-tk (pip install modbus_tk)
- GrayBox OPC-DA Automation Wrapper(DLL) : [Download](https://mega.nz/file/H8JCADiI#1AMDkI5jcHGugb6DBw-t1by4aDQNtfOcxjsLHGdCwBI)
- Register GrayBox OPC-DA Automation Wrapper(DLL) : (regsvr32 gbda_aut.dll)
- Python Version 3.6.8(32-Bit)
- PyWin32 for Python 3.6.8(32-Bit) : [Download](http://gestyy.com/etVOqH)
- Matrikon OPC-DA Server for Simulation : [Download](https://mega.nz/file/epZUlJIb#esdoFpnPNQ44fXcldYOViGpPig1fByJpCDmNVjeC3Bk)
- Matrikon OPC Explorer : [Download](https://mega.nz/file/2pAiUBhD#tIscS4SuZCRhj2Tc-QNcUf6m6f2NsVKNTHE0C40STeY)
- Download diagslave Modbus Simulator : [Download](https://www.modbusdriver.com/downloads/diagslave.zip)
- Download Virtual Serial Port Driver Software : [Download](https://cdn.eltima.com/download/vspd.exe)

## Repository Structure

```
├── Protocols/                          # Protocol implementations and examples
│   ├── BACnet/                         # BACnet IP communication scripts
│   ├── DNP3/                           # DNP3 protocol examples
│   ├── IEC104/                         # IEC 60870-5-104 server implementations
│   ├── MODBUS/                         # Modbus RTU/TCP clients and servers
│   │   ├── Arduino_NodeMCU/            # NodeMCU Modbus TCP server
│   │   ├── MinimulModbus/              # Minimal Modbus examples
│   │   ├── Modbus_Serial/              # Modbus Serial RTU examples (incl. JavaScript)
│   │   ├── modbus_tk/                  # modbus_tk library examples
│   │   └── pymodbus/                   # pymodbus library examples
│   │       ├── Modbus_RTU_Master/      # RTU master implementations
│   │       ├── Modbus_RTU_or_Serial/   # RTU/Serial notebooks
│   │       ├── Modbus_TCP/             # TCP client/server notebooks
│   │       └── Modbus_TCP_Client/      # TCP client examples
│   ├── MQTT/                           # MQTT publishers, subscribers, loggers
│   │   ├── NodeMCU/                    # NodeMCU MQTT examples
│   │   ├── Part-5/                     # MQTT admin/config examples
│   │   ├── Publisher/                  # MQTT publisher scripts
│   │   └── Subscriber/                 # MQTT subscriber scripts
│   └── OPC/                            # OPC-DA and OPC-UA examples
│       ├── OPC-DA/                     # OpenOPC DA client notebooks
│       ├── OPC-UA/                     # OPC-UA server/client notebooks (incl. JavaScript)
│       ├── OPCUA/                      # Telegraf OPC-UA integration
│       └── OPC UA + MQTT/              # OPC-UA to MQTT converters
├── Projects/                           # Platform-based solutions
│   ├── JavaScript/                     # JavaScript-based projects
│   │   └── js-modbus/                  # Browser-based Modbus client
│   ├── Node-RED/                       # Node-RED flows organized by protocol
│   │   ├── BACnet/                     # Node-RED + BACnet (Public, Private)
│   │   ├── Modbus/                     # Node-RED + Modbus (Public, Private)
│   │   ├── MQTT/                       # Node-RED + MQTT (Public)
│   │   └── OPC-UA/                     # Node-RED + OPC-UA (Public, Private)
│   ├── Python/                         # Python-based tools and applications
│   │   ├── Fanuc/                      # Fanuc CNC communication scripts
│   │   ├── Fanuc_Logger/               # Fanuc data logging to database
│   │   ├── MQTT-to-MSSQL-Logger/       # MQTT to Microsoft SQL Server logger
│   │   ├── Python Based Modbus SImulator/ # Software Modbus simulator
│   │   ├── Python GUI Application/     # GUI apps (BACnet, OPC-DA, OPC-UA loggers)
│   │   ├── Python-Modbus-Simulator/    # Modbus TCP server development
│   │   ├── Python-OPCDA-Datalogger/    # OPC-DA data logging tool
│   │   ├── Python-OPCDA-to-OPCUA-Converter/ # OPC-DA to OPC-UA bridge
│   │   └── SQLite-to-OPCUA-Publisher/  # SQLite to OPC-UA publisher
│   └── Telegraf/                       # Telegraf configurations for OT
│       ├── Modbus/                     # Telegraf Modbus read configs
│       └── OPCUA/                      # Telegraf OPC-UA read configs
├── Training Simulators/                # Simulator software for student training
│   ├── BACnet/                         # BACnet simulators
│   ├── DNP3/                           # DNP3 client and server simulators
│   ├── IEC104/                         # IEC104 client and server simulators
│   ├── MQTT/                           # MQTT broker tools
│   ├── Modbus/                         # Modbus simulators
│   ├── Node-RED Remote Access/         # Remote access tools (ngrok, localtonet)
│   ├── OPCDA/                          # OPC-DA simulation servers
│   └── OPCUA/                          # OPC-UA clients (UaExpert)
├── Tools/                              # Supporting utilities
│   ├── KEPServerEX V6.6.350 Tutorial Project Backup/
│   └── pywin32/                        # pywin32 library resources
├── .github/                            # GitHub issue templates
├── LICENSE
├── CONTRIBUTING.md
├── requirements.txt
└── README.md
```

## Student Simulator Downloads

| Simulator | Location |
|-----------|----------|
| DNP3 Client/Server | `Training Simulators/DNP3/` |
| IEC104 Client/Server | `Training Simulators/IEC104/` |
| Modbus | `Training Simulators/Modbus/` |
| MQTT | `Training Simulators/MQTT/` |
| OPC-DA Server | `Training Simulators/OPCDA/` |
| OPC-UA Client (UaExpert) | `Training Simulators/OPCUA/` |
| Node-RED Remote Access | `Training Simulators/Node-RED Remote Access/` |

## Getting Started

1. Install dependencies: `pip install -r requirements.txt`
2. Navigate to the relevant `Protocols/` or `Projects/` directory for your use case
3. Follow the Jupyter notebooks (`.ipynb`) or Python scripts in each subdirectory

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

See [LICENSE](LICENSE).
