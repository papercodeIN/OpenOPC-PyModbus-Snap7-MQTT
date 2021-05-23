## Library and Software Used:

- OpenOPC (pip install OpenOPC-Python3x)
- opcua (pip install opcua)
- PyModbus (pip install pymodbus)
- GrayBox OPC-DA Automation Wrapper(DLL) : [Download](http://gestyy.com/etVI8J)
- Register GrayBox OPC-DA Automation Wrapper(DLL) : (regsvr32 gbda_aut.dll)
- Python Version 3.6.8(32-Bit)
- PyWin32 for Python 3.6.8(32-Bit) : [Download](http://gestyy.com/etVOqH)
- Matrikon OPC-DA Server for Simulation : [Download](http://gestyy.com/etVO0r)
- Matrikon OPC Explorer : [Download](http://gestyy.com/etVI9q)

### Repository File Structure
```markdown
├── Modbus Notebooks/
│   ├── pymodbus Library | ModbusTCP Client
│   ├── pymodbus Library | ModbusTCP Server Python
│   ├── pymodbus Library | Read & Write Coils ModbusTCP Python
│   ├── pymodbus Library | Read & Write DINT Value ModbusTCP Python
│   ├── pymodbus Library | Read & Write Float Value ModbusTCP Python
│   ├── pymodbus Library | Read Modbus Holding Register and Convert it into Binary(Bits)
│   └── pymodbus Library | Read & Write Holding Register ModbusTCP Python
|
├── MQTT Notebooks/
│   ├── MQTT Basic Publisher
│   └── MQTT Publisher with Secirity (Username and Password)
|
├── OPC Notebooks/
    |
    ├── OPC-DA Notebooks/
    │   ├── OpenOPC-Python3x Library | OpenOPC with Citect SCADA OPC-DA Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with CODESYS OPC-DA Server (Schneider Machine Expert Basic)
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with Schneider OPC Factory Server
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server - Getting Tag Properties
    │   ├── OpenOPC-Python3x Library | OpenOPC with Metrikon Simulation Server - Flat and Recursive Option
    |   ├── OpenOPC-Python3x Library | OpenOPC with KEPServerEX - Read and Write Tags
    │   ├── Flat_True.png
    |   └── Recursive_True.png
    |
    └── OPC-UA Noteboooks
        ├── opcua Library | Basic OPC-UA Server No Security
        └── opcua Library | Secure OPC-UA Server with User Credential

```
