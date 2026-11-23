# Modbus RTU/Serial to SQLite Datalogger

This project logs Modbus RTU/Serial device data into an SQLite database for historical storage and analysis. It uses `pymodbus` for Modbus communication (via serial/RTU) and Python's built-in `sqlite3` for database operations.

## Library Version Details

| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| pyserial    | 3.5     | Serial communication for RTU    |
| sqlite3     | builtin | SQLite database for Python      |

## Features

 - Reads Modbus holding registers (default; other types supported)
 - Per-address reading for flexibility (supports non-consecutive addresses)
 - Logs only when values change
 - Efficient batch database inserts for improved performance
 - Each register/address is logged with timestamp, type, address, and value
 - Configurable update interval
 - Easy configuration via `src/config.py`
 - Supports Modbus RTU/Serial (not TCP/IP)
 - Automatically resumes logging after device reconnects

## Project Structure

```
modbus-sqlite-datalogger-02092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus RTU/Serial client wrapper
│   ├── sqlite_logger.py      # SQLite logger for Modbus data
│   ├── modbus_data.db        # SQLite database file (created at runtime)
│   └── config.py             # User configuration for Modbus/database/interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd modbus-sqlite-datalogger-02092025
   ```


2. Install dependencies:
    ```powershell or CMD
    pip install -r requirements.txt
    ```


## Configuration

Edit `src/config.py` to set:
- Modbus serial port (e.g., 'COM3' for Windows, '/dev/ttyUSB0' for Linux)
- Baudrate, parity, stopbits, bytesize
- Modbus slave ID (unit)
- SQLite database filename
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)

Example (`src/config.py`):
```python
SQLITE_DB_NAME = 'modbus_data.db'
MODBUS_SERIAL_PORT = 'COM3'
MODBUS_BAUDRATE = 9600
MODBUS_PARITY = 'N'
MODBUS_STOPBITS = 1
MODBUS_BYTESIZE = 8
MODBUS_SLAVE_ID = 1
MODBUS_READ_CONFIG = {
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7]
    }
    # "coils": {"addresses": [0, 1, 2]},
    # "discrete_inputs": {"addresses": [0, 1, 2]},
    # "input_registers": {"addresses": [0, 1, 2]},
}
UPDATE_INTERVAL = 5  # seconds
```

To enable other data types (coils, discrete inputs, input registers), uncomment and configure them in `MODBUS_READ_CONFIG`.


## Usage

Start the datalogger:
```powershell or CMD
python src/main.py
```

- The app reads configured Modbus addresses at the set interval.
- Only changed values are logged to the SQLite database.
- Each value is stored with timestamp, type, address, and value.
- If the Modbus device is unavailable, the script will retry and resume logging when the device is reconnected.


## Testing & Validation

- Ensure your Modbus RTU/Serial device is connected and accessible.
- Use any SQLite client or tool to inspect the `modbus_data.db` database.
- Change Modbus register values to see new rows logged in the database.


## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for batch reads, custom logging, or data export.


## Code Overview

### `src/main.py`
Main loop: connects to Modbus device, reads configured addresses, logs changes in batches to SQLite, and handles device reconnects.

### `src/modbus_client.py`
Wraps pymodbus RTU/Serial client. Provides methods for reading coils, discrete inputs, holding registers, and input registers.

### `src/sqlite_logger.py`
Handles SQLite database connection, table creation, and batch logging of data with timestamp.

### `src/config.py`
User configuration for Modbus serial, database, addresses, and update interval.

