# BACnet → MQTT Bridge

This project discovers BACnet devices using BAC0 and publishes BACnet point values to an MQTT broker using paho-mqtt.

Features
- BACnet device discovery and interactive device selection
- Per-point `raw` publishes or a single aggregated `json` payload per scan
- Config-driven behavior via `config.ini`
- Publish-on-change support to reduce MQTT traffic
- Safe MQTT publishing with connect/retry/backoff

Quick start
1. Open PowerShell or Command Prompt in the project folder:
   ```powershell
   cd "d:\Users\Parrot\Documents\GitHub-New\BACnet-Python\BACnet + MQTT\BACnet_to_MQTT-05-OCT-2025"
   ```

2. Install Python dependencies:
   - Double-click `install_requirements.bat` or run in PowerShell:
     ```powershell
     .\install_requirements.ps1
     ```
   - Or run:
     ```powershell
     python -m pip install -r requirements.txt
     ```

3. Edit `config.ini` and set your MQTT broker and options.

4. Run the bridge:
```powershell
python .\main.py
```

Configuration (`config.ini`)
- `[mqtt]` section:
  - `broker` (default 127.0.0.1)
  - `port` (default 1883)
  - `username`, `password` (optional)
  - `client_id_prefix` (prefix for the MQTT client id)
  - `topic_prefix` (root topic for published messages)
  - `max_retries`, `retry_delay` (mqtt connect retry behavior)
  - `publish_on_change` (True/False) — when True, only publishes when values change
  - `payload_format` (`raw` or `json`) — default `raw`. `json` publishes all points in a single JSON object per scan.

- `[bacnet]` section:
  - `scan_interval` (seconds between scans; default 4.0; clamped 0.5 - 3600)

Aggregated JSON format
When `payload_format = json`, the bridge publishes a single JSON payload like:

```json
{
  "device": {"name": "...", "vendor": "...", "address": "...", "id": "..."},
  "timestamp": 1234567890,
  "points": {"Point1": 10, "Point2": true}
}
```

Notes & troubleshooting
- If MQTT connect fails, verify broker is running and `broker`/`port` in `config.ini` are correct.
- If no BACnet devices are discovered, check network settings and BACnet device availability.

Next improvements
- Add TLS support for MQTT
- Add per-device/topic mapping and filters
- Add unit tests (mock BAC0 and paho)

License
Add your preferred license file to this repository.
