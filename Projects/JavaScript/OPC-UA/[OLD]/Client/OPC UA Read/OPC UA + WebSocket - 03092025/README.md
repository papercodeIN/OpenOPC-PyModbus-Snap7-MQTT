# OPC UA to WebSocket Bridge

This project reads data from an OPC UA server and streams it to a browser using WebSocket. The tags to read are defined in a CSV file (`tags.csv`).

## Features
- Reads tag values from OPC UA server
- Streams live data to browser via WebSocket
- Responsive UI with auto-updating table
- Tag list is loaded from `tags.csv`

## Setup
1. Install dependencies:
   ```
   npm install
   npm install csv-parse
   ```
2. Add your tag details to `tags.csv` (format: `name,nodeId`).
3. Start the server:
   ```
   node server.js
   ```
4. Open your browser at [http://localhost:3000](http://localhost:3000)

## CSV Format
```
name,nodeId
Constant,ns=3;i=1001
Counter,ns=3;i=1002
Random,ns=3;i=1003
Sawtooth,ns=3;i=1004
Sinusoid,ns=3;i=1005
Square,ns=3;i=1006
Triangle,ns=3;i=1007
```

## Customization & Limitations
- To add/remove tags, edit `tags.csv` and restart the server.
- The browser UI currently only displays tags present when the server starts. Adding new tags to `tags.csv` requires a server restart and browser refresh to see them.
- UI code is in `public/index.html` and `public/app.js`. For fully dynamic tag updates, further code changes are needed.
