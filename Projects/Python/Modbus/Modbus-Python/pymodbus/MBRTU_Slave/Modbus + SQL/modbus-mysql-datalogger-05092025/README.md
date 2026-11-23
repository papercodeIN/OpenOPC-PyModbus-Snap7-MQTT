# Modbus RTU/Serial to MySQL Datalogger

This project logs Modbus RTU/Serial device data into a MySQL database for historical storage and analysis. It uses `pymodbus` for Modbus communication (via serial/RTU) and `mysql-connector-python` for MySQL operations.

## Library Version Details

| Package                | Version | Description                     |
|------------------------|---------|---------------------------------|
| pymodbus               | 3.11.1  | Modbus protocol implementation  |
| pyserial               | 3.5     | Serial communication for RTU    |
| mysql-connector-python | 9.4.0   | MySQL database connector        |

## Features

 - Reads Modbus holding registers (default; other types supported)
 - Per-address reading for flexibility (supports non-consecutive addresses)
 - Logs only when values change
 - Batch database insert after each update interval (all changed values logged together)
 - Each register/address is logged with timestamp, type, address, and value
 - Configurable update interval
 - Easy configuration via `src/config.py`
 - Supports Modbus RTU/Serial (not TCP/IP)
 - Automatically resumes logging after device or MySQL reconnects

## Project Structure

```
modbus-sqlite-datalogger-02092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus RTU/Serial client wrapper
│   ├── mysql_logger.py       # MySQL logger for Modbus data
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
    ```powershell
    pip install -r requirements.txt
    ```


## Configuration

Edit `src/config.py` to set:
- MySQL database name, table name, username, password, host, port
- Modbus serial port (e.g., 'COM3' for Windows, '/dev/ttyUSB0' for Linux)
- Baudrate, parity, stopbits, bytesize
- Modbus slave ID (unit)
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)

Example (`src/config.py`):
```python
 # MySQL Database configuration
MYSQL_DB_NAME = 'test'
MYSQL_TABLE_NAME = 'modbus_data'
MYSQL_USER = 'root'
MYSQL_PASSWORD = 'toor'
MYSQL_HOST = '127.0.0.1'
MYSQL_PORT = 3306

## Modbus Serial/RTU configuration
MODBUS_SERIAL_PORT = 'COM2'  # Change to your serial port (e.g., 'COM3' for Windows, '/dev/ttyUSB0' for Linux)
MODBUS_BAUDRATE = 9600
MODBUS_PARITY = 'N'  # 'N', 'E', 'O'
MODBUS_STOPBITS = 1
MODBUS_BYTESIZE = 8
MODBUS_SLAVE_ID = 1  # Default slave ID (unit)

# Modbus data types and addresses to read, with MQTT topics for each
MODBUS_READ_CONFIG = {
    # "coils": {
    #     "addresses": [0, 1, 2],  # List of coil addresses to read
    # },
    # "discrete_inputs": {
    #     "addresses": [0, 1, 2],  # List of discrete input addresses to read
    # },
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7],  # List of holding register addresses to read
    },
    # "input_registers": {
    #     "addresses": [0, 1, 2],  # List of input register addresses to read
    # }
}

# Other configurations
UPDATE_INTERVAL = 5  # seconds
RECONNECT_INTERVAL = 5  # seconds to wait before reconnecting
```

To enable other data types (coils, discrete inputs, input registers), uncomment and configure them in `MODBUS_READ_CONFIG`.


## Usage

Start the datalogger:
```powershell
python src/main.py
```

- The app reads configured Modbus addresses at the set interval.
- Only changed values are logged to the MySQL database.
- Each value is stored with timestamp, type, address, and value.
- If the Modbus device or MySQL is unavailable, the script will retry and resume logging when the connection is restored.


## Testing & Validation

- Ensure your Modbus RTU/Serial device is connected and accessible.
- Use any MySQL client or tool to inspect the `modbus_data` table in your configured database.
- Change Modbus register values to see new rows logged in the database.


## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for batch reads, custom logging, or data export.


## Code Overview

### `src/main.py`
Main loop: connects to Modbus device, reads configured addresses, logs changes in batches to SQLite, and handles device reconnects.

### `src/modbus_client.py`
Wraps pymodbus RTU/Serial client. Provides methods for reading coils, discrete inputs, holding registers, and input registers.

### `src/mysql_logger.py`
Handles MySQL database connection, table creation, and batch logging of data with timestamp.

### `src/config.py`
User configuration for Modbus serial, database, addresses, and update interval.

