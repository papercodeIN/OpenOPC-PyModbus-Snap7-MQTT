# OPC-DA Data Logger


## Step1:
- Install `python-2.7.18.msi`

## Step2:
- Install `pywin32-228.win32-py2.7.exe`

## Step3:
- Install `OpenOPC-1.3.1.win32-py2.7.exe`

## Step4: 
- Install `python-3.6.7.exe`

## Step5: 
- Install `pywin32-300.win32-py3.6.exe`

## Step6:
- Remove `Python python-2.7.18` & `pywin32-228.win32-py2.7` from control panel
- Installed Required Library for python using below pip commands
```
python -m pip install pandas pyodbc OpenOPC-Python3x pyqt5 sqlalchemy nuitka pymsteams
```

## Step7: 
- Open CMD and type python, output should be like below
```
Python 3.6.7 (v3.6.7:6ec5cf24b7, Oct 20 2018, 12:45:02) [MSC v.1900 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>>
```
- Try to Import OpenOPC Library in Python, there should not be any error after importing library
```
Python 3.6.7 (v3.6.7:6ec5cf24b7, Oct 20 2018, 12:45:02) [MSC v.1900 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import OpenOPC
>>>
```
- Now, try to import pywintypes 
```
Python 3.6.7 (v3.6.7:6ec5cf24b7, Oct 20 2018, 12:45:02) [MSC v.1900 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import OpenOPC
>>> import pywintypes # To avoid timeout error
>>> pywintypes.datetime=pywintypes.TimeType
>>>
```
- Create OPC Client in Python
```
Python 3.6.7 (v3.6.7:6ec5cf24b7, Oct 20 2018, 12:45:02) [MSC v.1900 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import OpenOPC
>>> import pywintypes # To avoid timeout error
>>> pywintypes.datetime=pywintypes.TimeType
>>> opc = OpenOPC.client()
>>>
```
- Use "servers = opc.servers()" to search for available OPC Server in System and then we will print those server names.
```
Python 3.6.7 (v3.6.7:6ec5cf24b7, Oct 20 2018, 12:45:02) [MSC v.1900 32 bit (Intel)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import OpenOPC
>>> import pywintypes # To avoid timeout error
>>> pywintypes.datetime=pywintypes.TimeType
>>> opc = OpenOPC.client()
>>> servers = opc.servers()
>>> print (servers)
['SchneiderElectric.SCADA.OpcDaServer.1', 'Kepware.KEPServerEX.V6', 'Matrikon.OPC.Simulation.1', 'National Instruments.NIOPCServers.V5', 'National Instruments.LookoutOPCServer.1', 'National Instruments.Variable Engine.1', 'OPCSample.OpcDa20Server.1', 'OPCSample.OpcDaServer.1']
>>>
```
- If above steps are completed without any errors then installation is correct and python will able to communicate with Any OPC-DA Server in the system.

## Step8: How to Create .exe file
- 
```
- 