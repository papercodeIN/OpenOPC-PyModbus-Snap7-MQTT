
# OPC UA to SQLite Data Logger

A robust Node.js application that connects to OPC UA servers and logs tag data to SQLite data## 🏷️ Tag Configuration

Edit `tags.csv` to define which OPC UA tags to monitor:

```csv
name,nodeId
Temperature,ns=3;i=1001
Pressure,ns=3;i=1002  
FlowRate,ns=2;s=Process.Flow
```

### NodeId Formats:
- **Numeric**: `ns=3;i=1001` (namespace 3, numeric ID 1001)
- **String**: `ns=2;s=Temperature` (namespace 2, string "Temperature")
- **GUID**: `ns=1;g=550e8400-e29b-41d4-a716-446655440000`
- **Opaque**: `ns=4;b=UmVhZGluZw==`

## 💿 Database Schema

The SQLite table structure:
```sql
CREATE TABLE tag_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,     -- YYYY-MM-DD HH:MM:SS format
    name TEXT,          -- Tag name from CSV
    value REAL          -- Numeric tag value
);
```

## 🔧 Usage Examples

### Basic Anonymous Connection
```json
{
  "opcua": {
    "endpoint": "opc.tcp://localhost:4840",
    "username": "",
    "password": ""
  }
}
```

### Authenticated Connection
```json  
{
  "opcua": {
    "endpoint": "opc.tcp://192.168.1.100:53530",
    "username": "operator",
    "password": "password123"
  }
}
```

### High-Frequency Logging
```json
{
  "collection": {
    "pollIntervalMs": 500,        // Read every 500ms
    "logOnlyChanges": false       // Log all values
  }
}
```

## 🛠️ Developmentomatic reconnection, change-based logging, and configurable authentication.

## ✨ Features

- **Reliable Connection Management**: Automatic reconnection with configurable retry logic
- **Flexible Authentication**: Supports both anonymous and username/password authentication
- **Efficient Data Storage**: SQLite with optional WAL mode for better performance
- **Smart Logging**: Option to log only changed values to reduce database writes
- **Batch Operations**: Efficient batch reading of OPC UA tags and database insertions
- **Graceful Shutdown**: Clean disconnection and database closure on exit
- **Clear Console Output**: Categorized logging with `[OPCUA]`, `[SQLITE]`, and `[SYSTEM]` prefixes

## 📁 Project Structure
- `server.js` — Main script for reading OPC UA data and logging to SQLite
- `config.json` — Configuration file for endpoint, credentials, polling interval, database/table, and CSV file
- `tags.csv` — CSV file listing tag names and nodeIds to read
- `opcua_data.db` — SQLite database file (default name, configurable)

## 📁 Project Structure

```
├── server.js          # Main application entry point
├── config.json        # Configuration file (OPC UA, database, collection settings)
├── tags.csv           # Tag definitions (name and NodeId mappings)
├── package.json       # Node.js dependencies and scripts
├── opcua_data.db      # SQLite database (created automatically)
└── README.md          # This documentation
```

## 🚀 Quick Start

### 1. Install Dependencies
```powershell
npm install
```

### 2. Configure Your Setup
Edit `config.json` with your OPC UA server details and preferences.

### 3. Define Your Tags  
Edit `tags.csv` to specify which OPC UA tags to monitor.

### 4. Run the Logger
```powershell
node server.js
```

### 5. Monitor Output
Watch the console for connection status and data logging activity:
```
[SQLITE] Successfully opened SQLite database: opcua_data.db
[OPCUA] Successfully connected to OPC UA server: opc.tcp://...
[OPCUA] Creating session with anonymous authentication
```
```

## ⚙️ Configuration

The `config.json` file contains all settings organized into logical sections:

```json
{
  // OPC UA Server Configuration
  "opcua": {
    "endpoint": "opc.tcp://localhost:4840",
    "username": "admin", // optional
    "password": "admin", // optional
    "connectionTimeout": 10000,
    "sessionTimeout": 60000,
    "maxRetryAttempts": 5,
    "retryDelayMs": 2000
  },

  // SQLite Database Configuration
  "database": {
    "filename": "opcua_data.db",
    "tableName": "tag_data",
    "enableWAL": true, // Write-Ahead Logging for better performance
    "backupEnabled": false,
    "backupIntervalHours": 24
  },

  // Data Collection Settings
  "collection": {
    "pollIntervalMs": 1000,
    "tagsCsvFile": "tags.csv",
    "logOnlyChanges": true, // Only log when values change
    "batchSize": 100,
    "maxQueueSize": 1000
  },

  // Logging Configuration
  "logging": {
    "level": "info",
    "includeTimestamp": true,
    "logToFile": false,
    "logFilename": "opcua_logger.log"
  },

  // Performance Settings
  "performance": {
    "enableBatching": true,
    "maxBatchSize": 50,
    "batchTimeoutMs": 5000
  }
}
```

### 🔌 OPC UA Settings
- **endpoint**: Server URL (e.g., `opc.tcp://192.168.1.100:4840`)
- **username/password**: Leave empty for anonymous auth
- **maxRetryAttempts**: Connection retry limit (default: 5)
- **retryDelayMs**: Base delay between retries (default: 2000ms)

### 💾 Database Settings  
- **filename**: SQLite database file name
- **tableName**: Table for storing tag data
- **enableWAL**: Write-Ahead Logging for better performance

### 📊 Collection Settings
- **pollIntervalMs**: Data reading frequency 
- **tagsCsvFile**: Tag definitions file
- **logOnlyChanges**: Only log when values change (reduces DB writes)

## 🏷️ Tag Configuration

Edit `tags.csv` to define which OPC UA tags to monitor:
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
3. Inspect the database using a SQLite client (e.g., DB Browser for SQLite).

## 🛠️ Development

### Running in Development
```powershell
# Start with file watching
npm run dev

# Or run directly  
node server.js
```

### Database Inspection
Use any SQLite client to view collected data:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- `sqlite3` command line tool
- VS Code SQLite extensions

### Troubleshooting

**Connection Issues:**
- Verify OPC UA server is running and accessible
- Check endpoint URL format and port
- Ensure firewall allows connection
- Try anonymous authentication first

**Authentication Problems:**
- Verify username/password if using authentication
- Check server security settings
- Try with empty credentials for anonymous

**Performance Issues:**
- Enable WAL mode in database settings
- Increase `pollIntervalMs` for slower polling
- Enable `logOnlyChanges` to reduce writes

## 📝 Console Output Examples

### Successful Connection
```
[SQLITE] Successfully opened SQLite database: opcua_data.db
[SQLITE] WAL mode enabled for better performance  
[OPCUA] Successfully connected to OPC UA server: opc.tcp://localhost:4840
[OPCUA] Creating session with anonymous authentication
```

### Connection Retry
```
[OPCUA] OPCUA connect attempt 1 failed: connect ECONNREFUSED 127.0.0.1:4840
[OPCUA] OPCUA connect attempt 2 failed: connect ECONNREFUSED 127.0.0.1:4840
```

### Graceful Shutdown
```
[SYSTEM] Graceful shutdown requested. Cleaning up...
[OPCUA] OPC UA session closed.
[OPCUA] OPC UA client disconnected.
[SQLITE] SQLite DB closed.
```

## 📋 Requirements

- Node.js 14+ 
- Network access to OPC UA server
- Write permissions for SQLite database file

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper comments
4. Test with your OPC UA setup
5. Submit a pull request

## 📄 License

This project is open source. Feel free to use and modify for your needs.
