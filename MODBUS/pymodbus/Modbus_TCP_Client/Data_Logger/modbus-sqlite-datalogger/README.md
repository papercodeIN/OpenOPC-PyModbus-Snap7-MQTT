
# Modbus TCP/IP to SQLite Datalogger

This project logs Modbus TCP/IP device data into an SQLite database for historical storage and analysis. It uses `pymodbus` for Modbus communication and Python's built-in `sqlite3` for database operations.

## Library Version Details

| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| sqlite3     | builtin | SQLite database for Python      |

## Features

- Reads Modbus holding registers (default; other types supported)
- Per-address reading for flexibility (supports non-consecutive addresses)
- Logs only when values change
- Each register/address is logged with timestamp, type, address, and value
- Configurable update interval
- Easy configuration via `src/config.py`

## Project Structure

```
modbus-sqlite-datalogger-02092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
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
- Modbus server IP and port
- Modbus slave ID (unit)
- SQLite database filename
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)

Example (`src/config.py`):
```python
SQLITE_DB_NAME = 'modbus_data.db'
MODBUS_SERVER = '127.0.0.1'
MODBUS_PORT = 502
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


## Testing & Validation

- Ensure your Modbus server is running and accessible.
- Use any SQLite client or tool to inspect the `modbus_data.db` database.
- Change Modbus register values to see new rows logged in the database.


## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for batch reads, custom logging, or data export.

## Code Overview

### `src/main.py`
Main loop: connects to Modbus server, reads configured addresses, logs changes to SQLite.

### `src/modbus_client.py`
Wraps pymodbus TCP client. Provides methods for reading coils, discrete inputs, holding registers, and input registers.

### `src/sqlite_logger.py`
Handles SQLite database connection, table creation, and logging of data with timestamp.

### `src/config.py`
User configuration for Modbus server, database, addresses, and update interval.

