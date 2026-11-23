

# OPC UA CSV Data Logger

This project logs OPC UA tag data to daily CSV files, organized by year and month folders. It does not use MySQL or SQLite.

## Features

- Connects to an OPC UA server
- Reads tag definitions from a CSV file
- Logs data to CSV files only when tag values change
- Creates daily CSV files in a folder structure: `csvFolder/year/month/day.csv`
- Automatically reconnects to OPC UA server if connection/session is lost
- Handles CSV file write errors (e.g., file open/locked)

## Configuration

The project uses a small JSON config file `config.json`. The preferred
structure is the nested schema below. For backward compatibility the code
also supports legacy flat keys, but it's recommended to use the nested form.

Example `config.json` (recommended):

```json
{
   "opcua": {
      "endpoint": "opc.tcp://DESKTOP-FAFB2HS:53532/OPCUA/SimulationServer",
      "username": "",
      "password": "",
      "maxRetryAttempts": 5,
      "retryDelayMs": 2000
   },
   "collection": {
      "pollIntervalMs": 1000,
      "tagsCsvFile": "tags.csv",
      "csvFolder": "csv_data",
      "logOnlyChanges": true
   }
}
```

Keys explained:

- `opcua.endpoint` (string): OPC UA server endpoint URL.
- `opcua.username` / `opcua.password` (string): optional credentials.
- `opcua.maxRetryAttempts` (integer): how many connect attempts before giving up.
- `opcua.retryDelayMs` (integer): base delay between retry attempts (ms).
- `collection.pollIntervalMs` (integer): poll interval in ms.
- `collection.tagsCsvFile` (string): path to the CSV file that lists tags to read.
- `collection.csvFolder` (string): base folder where daily CSVs are written.
- `collection.logOnlyChanges` (boolean): when true, only writes rows when values change.

## Usage

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Edit `config.json` (see example above)
3. Run the logger:
   ```powershell
   node server.js
   ```

## Tag CSV Format

```
name,nodeId
Tag1,ns=2;s=Tag1
Tag2,ns=2;s=Tag2
```

## CSV Output Structure

CSV files are created in `csvFolder` with the following structure:

```
csvFolder/
   2025/
      09/
         04.csv
         05.csv
      10/
         ...
```

Each CSV file contains:

```
timestamp,name,value
2025-09-04T10:00:00.000Z,Tag1,123
2025-09-04T10:01:00.000Z,Tag1,124
...
```

## Error Handling

- If a CSV file is open/locked and cannot be written, an error is logged and the affected data is skipped (not buffered or retried).
- Only one error message is logged for repeated connection failures; retries happen in the background every 5 seconds with exponential backoff.

