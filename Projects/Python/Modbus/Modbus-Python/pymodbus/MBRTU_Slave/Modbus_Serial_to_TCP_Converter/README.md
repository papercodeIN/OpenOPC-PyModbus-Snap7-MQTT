# Bi-Directional Modbus RTU to Modbus TCP Converter

This project provides a Python-based tool to forward Modbus RTU requests from a serial port to a Modbus TCP server, supporting multiple slave devices. It uses the Pymodbus library and asyncio for asynchronous operation.

## Features
- Forwards Modbus RTU requests to Modbus TCP
- Supports multiple slave devices
- Configurable serial port, baudrate, server IP/port, and slave IDs
- Graceful shutdown on SIGINT
- Logging support

## Requirements
- Python 3.7+
- [pymodbus==3.6.6](https://github.com/pymodbus-dev/pymodbus)

Install dependencies:
```bash
pip install pymodbus==3.6.6
```

## Usage
Run the converter with command-line arguments. The script name is:

`rtu_2_tcp - 26-SEP-2025.py`

### Windows Example
```bash
python "rtu_2_tcp - 26-SEP-2025.py" --log debug --port "COM2" --baudrate 9600 --server_ip "127.0.0.1" --server_port 502 --slaves 1 2 3
```

### Linux Example
```bash
python "rtu_2_tcp - 26-SEP-2025.py" --log debug --port "/dev/ttyUSB0" --baudrate 9600 --server_ip "127.0.0.1" --server_port 502 --slaves 1 2 3
```

### Arguments
- `--log`        : Log level (critical, error, warning, info, debug; default: info)
- `--port`       : RTU serial port (e.g., COM2, /dev/ttyUSB0; default: /dev/ttyUSB0)
- `--baudrate`   : RTU baudrate (default: 9600)
- `--server_ip`  : Modbus TCP server IP (default: 127.0.0.1)
- `--server_port`: Modbus TCP server port (default: 5020)
- `--slaves`     : List of slave IDs to forward (e.g., 1 2 3)

## Example
```bash
python "rtu_2_tcp - 26-SEP-2025.py" --port COM3 --baudrate 19200 --server_ip 192.168.1.100 --server_port 502 --slaves 1 2
```

## Notes
- Use `Ctrl+C` to gracefully stop the server.
- Logging output will show server status and connected slaves.
