
# Modbus TCP/IP to CSV Datalogger

This project logs Modbus TCP/IP device data into daily CSV files for historical storage and analysis. It uses `pymodbus` for Modbus communication and is designed for reliability and ease of use.

## Library Version Details

| Package     | Version | Description                     |
|-------------|---------|---------------------------------|
| pymodbus    | 3.11.1  | Modbus protocol implementation  |

## Features

- Reads Modbus holding registers (default configuration)
- Per-address reading for flexibility (supports non-consecutive addresses)
- Logs only when values change (no duplicate entries)
- Each register/address is logged with timestamp, type, address, and value
- Timestamp format: `DD-MM-YYYY HH:MM:SS` for easy sorting and readability
- Configurable update interval; logs data exactly at the interval defined, compensating for processing time
- Robust reconnect logic: automatically reconnects to Modbus device if communication fails
- Handles CSV file lock (e.g., if open in Excel): retries writing instead of crashing
- Supports reading from a specific Modbus slave ID (see `MODBUS_SLAVE_ID` in config)
- Easy configuration via `src/config.py`
- Data is stored in daily CSV files in a folder structure: `logs/<Year>/<Month>/<DD-MM-YYYY>.csv`

## Project Structure

```
modbus-csv-datalogger-03092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
│   └── config.py             # User configuration for Modbus/interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd modbus-csv-datalogger-03092025
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

Edit `src/config.py` to set:
- Modbus server IP and port
- Modbus slave ID (`MODBUS_SLAVE_ID`) to target a specific device
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)
- CSV base path (`CSV_BASE_PATH`) for log storage

Example (`src/config.py`):
```python
MODBUS_SERVER = '127.0.0.1'
MODBUS_PORT = 502
MODBUS_SLAVE_ID = 1  # Modbus slave ID to read from
MODBUS_READ_CONFIG = {
    "holding_registers": {
        "addresses": [0, 1, 2, 5, 6, 7]
    }
}
UPDATE_INTERVAL = 5  # seconds
CSV_BASE_PATH = "logs"
```

To enable other data types (coils, discrete inputs, input registers), uncomment and configure them in `MODBUS_READ_CONFIG`.

## Usage

Start the datalogger:
```
python src/main.py
```

- The app reads configured Modbus addresses at the set interval from the specified slave ID.
- Only changed values are logged to the CSV file.
- Each value is stored with timestamp, type, address, and value in a daily CSV file.

## Testing

- Ensure your Modbus server is running and accessible.
- Change Modbus register values to see new rows logged in the CSV file for the current day.

## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Easily extend for batch reads, custom logging, or data export.
- See code comments in `main.py` for details on logging, reconnect logic, and interval handling.
