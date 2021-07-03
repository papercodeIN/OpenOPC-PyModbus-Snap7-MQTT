## Library and Software Used:

- OpenOPC (pip install OpenOPC-Python3x)
- opcua (pip install opcua)
- PyModbus (pip install pymodbus)
- pyModbusTCP (pip install pyModbusTCP)
- modbus-tk (pip install modbus_tk)
- GrayBox OPC-DA Automation Wrapper(DLL) : [Download](http://gestyy.com/etVI8J)
- Register GrayBox OPC-DA Automation Wrapper(DLL) : (regsvr32 gbda_aut.dll)
- Python Version 3.6.8(32-Bit)
- PyWin32 for Python 3.6.8(32-Bit) : [Download](http://gestyy.com/etVOqH)
- Matrikon OPC-DA Server for Simulation : [Download](http://gestyy.com/etVO0r)
- Matrikon OPC Explorer : [Download](http://gestyy.com/etVI9q)
- Download diagslave Modbus Simulator : [Download](https://www.modbusdriver.com/downloads/diagslave.zip)
- Download Virtual Serial Port Driver Software : [Download](https://cdn.eltima.com/download/vspd.exe)


### Repository File Structure
```markdown

├── Modbus Notebooks/
│   ├── pymodbus
│   │   ├── Modbus_RTU_or_Serial
│   │   │   ├── pymodbus Library | 
│   │   │   ├── pymodbus Library | Read & Write Float Value of Modbus (RTU/Serial) Holding Register
│   │   │   └── pymodbus Library | Read & Write Modbus (RTU/Serial) Holding Register 
│   │   │
│   │   └── Modbus_TCP
│   │       ├── pymodbus Library | ModbusTCP Client in Python
│   │       ├── pymodbus Library | ModbusTCP Server in Python
│   │       ├── pymodbus Library | Read & Write DINT Value of Modbus (TCP) Holding Register
│   │       ├── pymodbus Library | Read & Write Float Value of Modbus (TCP) Holding Register
│   │       ├── pymodbus Library | Read & Write Modbus (TCP) Coil Status 
│   │       ├── pymodbus Library | Read & Write Modbus (TCP) Holding Register Values 
│   │       └── pymodbus Library | Read Modbus (TCP) Holding Register and Convert it into Binary(Bits)
│   │
│   ├── pyModbusTCP
│   │   └── pyModbusTCP Library | ModbusTCP Server in Python
│   │
│   └── modbus_tk
│       ├── modbus_tk Library | Read & Write Float Value
│       └── modbus_tk Library | Read & Write Modbus Holding Register Values in Python
│   
├── MQTT Notebooks/
│   ├── paho.mqtt | MQTT Publisher - Mosquitto - No Security
│   ├── paho.mqtt | MQTT Publisher - CloudMQTT - With Security
│   └── paho.mqtt | MQTT Subscriber - Any Broker - With and Without Security
│   
└── OPC Notebooks/
    │
    ├── OPC-DA Notebooks/
    │   ├── OpenOPC-Python3x Library | OpenOPC with Citect SCADA OPC-DA Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with CODESYS OPC-DA Server (Schneider Machine Expert Basic)
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with Schneider OPC Factory Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server - Getting Tag Properties
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server - Flat and Recursive Option
    │   ├── OpenOPC-Python3x Library | OpenOPC with KEPServerEX - Read and Write Tags
    │   ├── Flat_True.png
    │   └── Recursive_True.png
    │
    └── OPC-UA Noteboooks
        ├── opcua Library | OPC-UA Client with SubscriptionHandler  
        ├── opcua Library | Import OPC-UA Server Model from XML File
        ├── opcua Library | Export OPC-UA Server Model into XML File by NameSpace
        ├── opcua Library | Export OPC-UA Server Model into XML File by Node
        ├── Server_Model.xml
        ├── opcua Library | Basic OPC-UA Server No Security
        └── opcua Library | Secure OPC-UA Server with User Credential
```
