
# Modbus RTU/Serial to CSV Datalogger

This project logs Modbus RTU/Serial device data into CSV files for historical storage and analysis. It uses `pymodbus` for Modbus communication (via serial/RTU) and Python's built-in `csv` for file operations.

## Library Version Details

| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |
| pyserial    | 3.5     | Serial communication for RTU    |
| csv         | builtin | CSV file logging for Python     |

## Features

 - Reads Modbus holding registers (default; other types supported)
 - Per-address reading for flexibility (supports non-consecutive addresses)
 - Logs only when values change
 - Efficient batch CSV logging for improved performance
 - Each register/address is logged with timestamp, type, address, and value
 - Configurable update interval
 - Easy configuration via `src/config.py`
 - CSV files are organized by year/month/day folders
 - Handles file lock errors (e.g., if CSV is open in Excel) with retry logic
 - Supports Modbus RTU/Serial (not TCP/IP)
 - Automatically resumes logging after device reconnects

## Project Structure

```
modbus-csv-datalogger-05092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus RTU/Serial client wrapper
│   ├── csv_logger.py         # CSV logger for Modbus data
│   └── config.py             # User configuration for Modbus/CSV/interval
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
- CSV log folder path
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)

Example (`src/config.py`):
```python
CSV_LOGGER_FOLDER = r'data_logs'
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
- Inspect the CSV files in the configured folder. Each day has its own file, organized by year/month.
- Change Modbus register values to see new rows logged in the CSV file.


## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for batch reads, custom logging, or data export.


## Code Overview

### `src/main.py`
Main loop: connects to Modbus device, reads configured addresses, logs changes in batches to SQLite, and handles device reconnects.

### `src/modbus_client.py`
Wraps pymodbus RTU/Serial client. Provides methods for reading coils, discrete inputs, holding registers, and input registers.

### `src/csv_logger.py`
Handles CSV file creation, folder structure, and batch logging of data with timestamp. Includes retry logic for file lock errors.

### `src/config.py`
User configuration for Modbus serial, CSV log folder, addresses, and update interval.

