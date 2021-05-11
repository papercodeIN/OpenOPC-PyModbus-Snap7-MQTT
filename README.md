## Library and Software Used:
```markdown
- OpenOPC (pip install OpenOPC-Python3x)
- opcua (pip install opcua)
- PyModbus (pip install pymodbus)
- GrayBox OPC-DA Automation Wrapper(DLL) : [Download](http://gestyy.com/etVI8J)
- Register GrayBox OPC-DA Automation Wrapper(DLL) : (regsvr32 gbda_aut.dll)
- Python Version 3.6.8(32-Bit)
- PyWin32 for Python 3.6.8(32-Bit) : [Download](http://gestyy.com/etVOqH)
- Matrikon OPC-DA Server for Simulation : [Download](http://gestyy.com/etVO0r)
- Matrikon OPC Explorer : [Download](http://gestyy.com/etVI9q)
```

### Repository File Structure
```markdown
├── Modbus Notebooks/
│   ├── ModbusTCP Client
│   ├── ModbusTCP Server Python
│   ├── Read & Write Coils ModbusTCP Python
│   ├── Read & Write DINT Value ModbusTCP Python
│   ├── Read & Write Float Value ModbusTCP Python
│   └── Read & Write Holding Register ModbusTCP Python
|
├── MQTT Notebooks/
│   ├── MQTT Basic Publisher
│   └── MQTT Publisher with Secirity (Username and Password)
|
├── OPC Notebooks/
    |
    ├── OPC-DA Notebooks/
    │   ├── OpenOPC with Citect SCADA OPC-DA Server
    │   ├── OpenOPC with CODESYS OPC-DA Server (Schneider Machine Expert Basic)
    │   ├── OpenOPC with Metrikon Simulation Server
    │   ├── OpenOPC with Schneider OPC Factory Server
    │   ├── OpenOPC with Metrikon Simulation Server - Getting Tag Properties
    │   ├── OpenOPC with Metrikon Simulation Server - Flat and Recursive Option
    |   ├── OpenOPC with KEPServerEX - Read and Write Tags
    │   ├── Flat_True.png
    |   └── Recursive_True.png
    |
    └── OPC-UA Noteboooks
        ├── Basic OPC-UA Server No Security
        └── Secure OPC-UA Server with User Credential

```
