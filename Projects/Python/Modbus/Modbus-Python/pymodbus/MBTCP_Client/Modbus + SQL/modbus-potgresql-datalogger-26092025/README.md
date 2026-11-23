
# Modbus TCP/IP to PostgreSQL Datalogger

This project logs Modbus TCP/IP device data into a PostgreSQL database for historical storage and analysis. It uses `pymodbus` for Modbus communication and `psycopg2` for PostgreSQL operations.

## Features

- Reads Modbus holding registers and input registers (default configuration)
- Supports non-consecutive and consecutive address reading (optimized block reads)
- Logs only when values change
- Batch logging: all changed values in a cycle are inserted in one query for performance
- Each register/address is logged with timestamp, type, address, and value (narrow/long format)
- Configurable update interval
- Supports reading from a specific Modbus slave ID (see `MODBUS_SLAVE_ID` in config)
- Easy configuration via `src/config.py`

## Project Structure


```
modbus-potgresql-datalogger-26092025
├── src
│   ├── main.py               # Main application logic
│   ├── modbus_client.py      # Modbus TCP client wrapper
│   ├── postgres_logger.py    # PostgreSQL logger for Modbus data
│   └── config.py             # User configuration for Modbus/database/interval
├── requirements.txt          # Python dependencies
├── README.md                 # Project documentation
```

## Library Version Details

| Package           | Version   | Description                    |
|-------------------|-----------|--------------------------------|
| pymodbus          | 3.11.1    | Modbus protocol implementation |
| psycopg2-binary   | 2.9.10    | PostgreSQL database for Python |

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd modbus-mysql-datalogger-01092025
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

## Configuration

Edit `src/config.py` to set:
- Modbus server IP and port
    PostgreSQL database connection details
- Modbus slave ID (`MODBUS_SLAVE_ID`) to target a specific device
- Register types and addresses to read (currently only holding registers enabled)
- Update interval (in seconds)


Example (`src/config.py`):
```python
POSTGRES_DB_CONFIG = {
    'host': '127.0.0.1',
    'user': 'postgres',
    'password': 'toor',
    'dbname': 'test'
}
MODBUS_SERVER = '127.0.0.1'
MODBUS_PORT = 502
MODBUS_SLAVE_ID = 1  # Modbus slave ID to read from
MODBUS_READ_CONFIG = {
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

Start the datalogger:
```
python src/main.py
```

- The app reads configured Modbus addresses at the set interval from the specified slave ID.
- Only changed values are logged to the PostgreSQL database, using batch logging for efficiency.
- Each value is stored with timestamp, type, address, and value (narrow/long format).

## Testing

- Ensure your Modbus server is running and accessible.
- Use any PostgreSQL client or tool to inspect the `modbus_data` table in the `test` database.
- Change Modbus register values to see new rows logged in the database.

## Advanced

- Supports all Modbus data types (add to `MODBUS_READ_CONFIG` as needed).
- Optimized for block reads: consecutive addresses are read in a single request for efficiency.
- Easily extend for custom logging, data export, or additional features.

