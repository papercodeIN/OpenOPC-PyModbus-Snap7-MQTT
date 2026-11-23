


# OPC UA to MySQL Data Logger

This project reads tag values from an OPC UA server and logs them into a MySQL database at a configurable interval. Tag details are loaded from a CSV file, and all configuration is managed via a JSON config file.


## Features
- Batch reading of OPC UA tags for performance (all tag values read in one request)
- Batch logging to MySQL (all changed values inserted in a single query per polling interval)
- Only logs to MySQL when values change (no duplicate data)
- Configurable OPC UA endpoint, credentials, polling interval, MySQL database/table name, and CSV file
- Automatic MySQL reconnection: if connection drops, the logger will retry every 2 seconds and resume logging once reconnected
- Automatic OPC UA reconnection: if connection or session drops, the logger will retry and resume data logging once reconnected
- Table creation only runs once after first successful connection
- Debug logging for troubleshooting
- Graceful shutdown: closes OPC UA session/client and MySQL DB cleanly on Ctrl+C or SIGTERM

## Files
- `server.js` — Main script for reading OPC UA data and logging to MySQL
- `config.json` — Configuration file for endpoint, credentials, polling interval, database/table, and CSV file
- `tags.csv` — CSV file listing tag names and nodeIds to read

## Configuration
Edit `config.json` to set your parameters:
```json
{
  "opcuaEndpoint": "opc.tcp://localhost:4840",
  "opcuaUsername": "", // optional
  "opcuaPassword": "", // optional
  "mysqlDbName": "test",
  "mysqlTableName": "tag_data",
  "mysqlHost": "127.0.0.1",
  "mysqlUser": "root",
  "mysqlPassword": "toor",
  "pollIntervalMs": 1000,
  "tagsCsvFile": "tags.csv"
}
```

## Tag CSV Format
Example `tags.csv`:
```
name,nodeId
Constant,ns=3;i=1001
Counter,ns=3;i=1002
Random,ns=3;i=1003
```

## Usage
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the logger:
   ```powershell
   node server.js
   ```
3. Inspect the database using a MySQL client (e.g., MySQL Workbench, DBeaver).

## Notes
- Only changed values are logged to avoid duplicate data.
- If MySQL connection drops during runtime, the logger will automatically reconnect and resume logging.
- Debug output is printed to the console for each read and database insert.
- Graceful shutdown: Press Ctrl+C or send SIGTERM to close all connections and DB cleanly.
- Make sure your OPC UA server is running and accessible.
- You can change the polling interval, database/table name, and CSV file in `config.json`.
