# OPC DA Training Software

OPC DA (classic OPC) servers, clients and supporting tools for training and learning. All installers are published as assets on the **[OPC DA Training Tools release](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/tag/opc-da-tools-2026-11-19)**; byte-identical copies of some installers are also tracked in this folder in the repository.

## Matrikon OPC Simulation Server and OPC Explorer

The classic free simulation server and its browser client. They are the starting point for the OPC DA exercises (a 32-bit OPC DA automation wrapper and DCOM configuration are typically needed).

| Software | Asset | Download |
| --- | --- | --- |
| Matrikon OPC Simulation Server | `MatrikonOPCSimulation.exe` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/MatrikonOPCSimulation.exe) |
| Matrikon OPC Explorer | `MatrikonOPCExplorer.exe` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/MatrikonOPCExplorer.exe) |

## Pascam PsOPCServer 1.8.0 and PsOPCClient 2.1.0

| Software | Asset | Download |
| --- | --- | --- |
| PsOPCServer x64 | `PsOPCServer180_x64.msi` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/PsOPCServer180_x64.msi) |
| PsOPCServer x86 | `PsOPCServer180_x86.msi` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/PsOPCServer180_x86.msi) |
| PsOPCClient x64 | `PsOPCClient210_x64.msi` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/PsOPCClient210_x64.msi) |
| PsOPCClient x86 | `PsOPCClient210_x86.msi` | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/PsOPCClient210_x86.msi) |

## GrayBox OPC-DA Automation Wrapper

`graybox_opc_automation_wrapper.zip` — the `gbda_aut.dll` wrapper used by the Python examples in this repository to talk to OPC DA servers.

- [Download from the release](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/graybox_opc_automation_wrapper.zip)
- After extracting, register the DLL with `regsvr32 gbda_aut.dll`.

## Prerequisites: .NET Framework 3.5

Some of the legacy installers require .NET Framework 3.5, which is not installed by default on newer Windows versions.

| Asset | Download |
| --- | --- |
| `dotnetfx35.exe` (full offline installer) | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/dotnetfx35.exe) |
| `dotNetFx35setup.exe` (web bootstrapper) | [Download](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/dotNetFx35setup.exe) |

## Notes

- OPC DA relies on Windows DCOM. Configure DCOM permissions and use a dedicated local user for training setups.
- Verify downloads against [CHECKSUMS.sha256](https://github.com/papercodeIN/OpenOPC-PyModbus-Snap7-MQTT/releases/download/opc-da-tools-2026-11-19/CHECKSUMS.sha256).
- Check each vendor's license terms before use. These files are provided for training and learning purposes only.

