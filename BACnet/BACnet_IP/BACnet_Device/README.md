# BACnet Device Simulator

This project simulates a BACnet device for testing and development purposes. It is implemented in Python and is intended to help developers interact with BACnet/IP networks without requiring physical hardware.

## Features
- Simulates BACnet/IP device behavior
- Useful for integration testing and protocol validation
- Easily extensible for custom BACnet objects and properties

## Requirements
| Requirement         | Version         |
|---------------------|----------------|
| Python              | 3.7 or higher  |
| BACpypes            | 0.19.0         |
| BACpypes3           | 0.0.102        |
| BAC0                | 2025.8.16      |
| pybacnet            | 0.0.8          |
| pyasyncore          | 1.0.4          |
| pytz                | 2025.2         |
| netifaces           | 0.11.0         |

## Usage
1. Install Python and required dependencies.
2. Run the simulator:
   ```powershell
   python bacnet_device_simulator_01092025.py
   ```
3. Configure your BACnet client to communicate with the simulator's IP and port.

## File Structure
- `bacnet_device_simulator_01092025.py`: Main simulator script

