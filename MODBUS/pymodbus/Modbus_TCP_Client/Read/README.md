
# Modbus TCP/IP Data Reader

This project reads data from Modbus TCP/IP devices and prints the values for all configured data types (coils, discrete inputs, holding registers, input registers) to the console. It uses `pymodbus` for Modbus communication.

## Library Version Details
| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |


## Features

- Reads Modbus coils, discrete inputs, holding registers, and input registers
- Per-address reading for flexibility (supports non-consecutive addresses)
- Configurable update interval
- Easy configuration via `src/config.py`

## Project Structure

```
modbus-mqtt-publisher-01092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
│   └── config.py             # User configuration for Modbus addresses and interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
    ```
    git clone <repository-url>
    cd modbus_read-01092025
    ```


2. Install dependencies:
    ```
    pip install -r requirements.txt
    ```


## Configuration

Edit `src/config.py` to set:
- Modbus server IP and port
- Register types and addresses to read (coils, discrete inputs, holding registers, input registers)
- Update interval (in seconds)

Example (`src/config.py`):
```python
MODBUS_READ_CONFIG = {
    "coils": {
        "addresses": [0, 1, 2]
    },
    "discrete_inputs": {
        "addresses": [0, 1, 2]
    },
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7]
    },
    "input_registers": {
        "addresses": [0, 1, 2]
    }
}
UPDATE_INTERVAL = 5  # seconds
```

To enable other data types (coils, discrete inputs, input registers), uncomment and configure them in `MODBUS_READ_CONFIG`.

## Usage

Start the reader:
```
python src/main.py
```

- The app reads configured Modbus addresses at the set interval.
- All values are printed to the console in the format: `<data_type> address <address>: <value>`


## Testing

- Ensure your Modbus server is running and accessible.
- Change Modbus register values to see updates printed in the console.


## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for logging, batch reads, or other output formats if required.
