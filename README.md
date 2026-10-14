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
├── Protocols/                          # Protocol-specific examples and references
│   ├── MODBUS/
│   ├── MQTT/
│   └── OPC/
├── Projects/                           # Platform-based solutions
│   ├── Grafana/
│   ├── JavaScript/                     # JavaScript solutions
│   │   ├── BACnet/
│   │   ├── Modbus/
│   │   ├── MQTT/
│   │   ├── OPC-DA/
│   │   ├── OPC-UA/
│   │   └── js-modbus/
│   ├── Node-RED/                       # Node-RED flows organized by protocol
│   │   ├── BACnet/                     # Node-RED + BACnet (Public, Private)
│   │   ├── Modbus/                     # Node-RED + Modbus (Public, Private)
│   │   ├── MQTT/                       # Node-RED + MQTT (Public)
│   │   └── OPC-UA/                     # Node-RED + OPC-UA (Public, Private)
│   ├── Python/                         # Python solutions and application projects
│   │   ├── BACnet/                     # BACnet clients, simulators and loggers
│   │   ├── IEC-104/
│   │   ├── Modbus/
│   │   ├── MQTT/                       # MQTT clients, publishers and loggers
│   │   ├── OPC-DA/
│   │   ├── OPC-UA/                     # OPC-UA clients, servers and bridges
│   │   ├── OPC/                        # Existing OPC project group
│   │   └── Applications/               # Standalone Python application projects
│   └── Telegraf/                       # Telegraf work grouped by protocol
│       ├── Modbus/
│       └── OPC-UA/
│   # Platform folders use Modbus, OPC-UA, OPC-DA, MQTT and BACnet where applicable
├── Training Simulators/                # Simulator software for student training
│   ├── BACnet/
│   ├── DNP3/
│   ├── IEC-104/
│   ├── Modbus/
│   ├── MQTT/
│   ├── OPC-DA/
│   ├── OPC-UA/
│   └── Remote Access/
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
| IEC104 Client/Server | `Training Simulators/IEC-104/` |
| Modbus | `Training Simulators/Modbus/` |
| MQTT | `Training Simulators/MQTT/` |
| OPC-DA Server | `Training Simulators/OPC-DA/` |
| OPC-UA Client (UaExpert) | `Training Simulators/OPC-UA/` |
| Remote Access | `Training Simulators/Remote Access/` |

## Getting Started

1. Install dependencies: `pip install -r requirements.txt`
2. Navigate to the relevant `Protocols/` or `Projects/` directory for your use case
3. Follow the Jupyter notebooks (`.ipynb`) or Python scripts in each subdirectory

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

See [LICENSE](LICENSE).
