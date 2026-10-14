# OPC UA Server in JavaScript

This project is a simple OPC UA server built with [node-opcua](https://github.com/node-opcua/node-opcua). It allows you to define tags and a parent folder in a `config.json` file, and supports username/password authentication. The server runs on a configurable port and exposes your tags under a custom folder.

## Features
- Configurable port, username, and password
- Tags and parent folder defined in `config.json`
- Runs an OPC UA server on localhost
- Uses [node-opcua](https://github.com/node-opcua/node-opcua)

## Prerequisites
- **Node.js v18.x or v20.x** (do not use v22+)
- npm (comes with Node.js)

## Setup
1. Clone or download this repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Edit `config.json` to set your port, username, password, parent folder, and tags.
4. Start the server:
   ```sh
   node server.js
   ```

## Configuration Example (`config.json`)
```json
{
  "port": 4840,
  "username": "user1",
  "password": "password1",
  "parentFolder": "MyDevices",
  "tags": [
    { "name": "Temperature", "dataType": "Double", "value": 25.5 },
    { "name": "Pressure", "dataType": "Double", "value": 1.2 },
    { "name": "Status", "dataType": "Boolean", "value": true }
  ]
}
```

## Security
- Only users with the username and password in `config.json` can connect.
- Anonymous connections are not allowed.

## Notes
- If you see cryptography errors, downgrade Node.js to v20 or v18.
- The server exposes all tags under the folder specified by `parentFolder`.

## License
MIT
