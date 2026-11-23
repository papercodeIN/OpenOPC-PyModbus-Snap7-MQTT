# OPC UA ⇄ MQTT Bidirectional Gateway

Python gateway that connects **any OPC UA server** to **any MQTT broker** in **both directions**, with a professional industrial web console on a single page:

- **OPC UA → MQTT** — polls configured nodes and publishes changes to MQTT (JSON snapshot + per-node values).
- **MQTT → OPC UA** — anything published to the MQTT *set* topics is written straight back to the OPC UA server (with safety gates and type checking).
- **Web console** — connect to a different server/broker at runtime, browse the OPC UA address space, watch both data flows live, and write values from the page.

![Web console](docs/web-console.png)

Tested on Windows 11, Python 3.13, Mosquitto 2.x, Prosys OPC UA Simulation Server, and the bundled demo server. All checks in `tools/e2e_check.py` pass (both directions + write-safety gates).

---

## Features

- Bidirectional bridge in one process: polling OPC UA reader + MQTT publisher + MQTT subscriber + OPC UA writer.
- Publishes **only changed values** (plus an initial snapshot on startup and after every reconnect).
- Retained messages: late subscribers immediately see the latest values.
- **Write safety**: global `write_enabled` gate, per-node `writable` flag, strict data-type coercion, non-retained command topics, every write attempt logged.
- Robust connections: automatic reconnect with backoff on both sides; fresh OPC UA session per attempt; paho network loop with auto-reconnect for MQTT.
- Unique per-connection MQTT client id suffix — two gateway instances can never kick each other off the broker.
- Single-page industrial console (dark SCADA theme, no external assets, works offline): live cards with sparklines, master-payload viewer, filterable event log, address-space browser, runtime reconfiguration, config persistence.
- Ships with a demo OPC UA simulation server and a headless end-to-end check.

## How it works

```
                    reads (poll, interval)              publishes (retained)
   ┌──────────────┐  ─────────────────────────▶  ┌─────────────────┐   ┌──────────────┐
   │  OPC UA      │                              │  GATEWAY        │──▶│ MQTT broker  │──▶ consumers
   │  server      │  ◀─────────────────────────  │  (engine +      │   │ 127.0.0.1:…  │
   └──────────────┘   writes (from set topics)    │   web console)  │◀──│              │
                                                  └─────────────────┘   └──────────────┘
                                                                       set topics from
                                                                       any producer / the console
```

### MQTT topic layout

| Topic | Direction | Payload | Retained |
|---|---|---|---|
| `<master_topic>` | OPC UA → MQTT | JSON snapshot `{"Counter": 123, "Random": 45.67, …}` | yes |
| `<master_topic>/<NodeName>` | OPC UA → MQTT | raw value of that node, e.g. `123` | yes |
| `<master_topic>/set/<NodeName>` | MQTT → OPC UA | value to write, e.g. `42`, `"hello"`, `true` | no |

`<NodeName>` is the key from `config.nodes`. Publish JSON values to the set topic — a plain string is accepted as-is, so `42`, `4.5`, `true` and `"text"` all work.

## Requirements

```powershell
python -m pip install -r requirements.txt
```

| Package | Tested | Purpose |
|---|---|---|
| asyncua | 2.1.0 | async OPC UA client (read / write / browse) |
| paho-mqtt | 2.2.0 | MQTT client (network-loop thread, auto-reconnect) |
| fastapi | 0.163.1 | REST + WebSocket API |
| uvicorn | 0.54.0 | ASGI server for the web console |
| websockets | 15.0.1 | WebSocket support for uvicorn |
| python-dateutil | 4.0.0 | datetime parsing for DateTime node writes |

## Quick start

1. **Install dependencies** (see above). Make sure an MQTT broker (e.g. Mosquitto) is running.
2. *(Optional, no real server needed)* start the bundled demo OPC UA server:
   ```powershell
   python tools/demo_opcua_server.py --port 4840
   ```
3. **Edit `config.json`** — set `opcua_server_url`, `mqtt.broker`/`port`/`master_topic`, and the `nodes` map (name → NodeId). Node ids for any server can be discovered from the console's **Browse** panel or with any OPC UA client.
4. **Run the gateway**:
   ```powershell
   python main.py
   ```
5. **Open the console** at `http://127.0.0.1:8080` — both connection pills turn green, node cards fill with live values.
6. **Test the reverse direction** from any MQTT client:
   ```powershell
   mosquitto_pub -h 127.0.0.1 -t "OPC_UA_Nodes/set/SetPoint" -m 777
   ```
   The OPC UA node updates within one poll interval, the new value is republished to MQTT, and the write appears in the event log. The console's **Write → MQTT** button exercises the exact same path.

## Configuration reference (`config.json`)

| Key | Default | Meaning |
|---|---|---|
| `opcua_server_url` | — | OPC UA endpoint, e.g. `opc.tcp://DESKTOP-FAFB2HS:53532/OPCUA/SimulationServer` |
| `mqtt.broker`, `mqtt.port` | — | MQTT broker address |
| `mqtt.master_topic` | `opcua_values` | base topic for all publishes and set-topics |
| `mqtt.client_id` | `opcua_mqtt_bridge` | prefix only — a random suffix is added per connection to prevent client-id kick loops |
| `mqtt.qos` | `1` | QoS for publishes and the set-topic subscription |
| `nodes` | — | map of `NodeName` → `{ "node_id": "ns=3;i=1002", "writable": true }` (a plain `"ns=…"` string also works and defaults to writable). Names are sanitized for MQTT topic safety: `/`, `#`, `+` and whitespace become `_` |
| `interval` | `2` | OPC UA poll interval in seconds (≥ 0.2) |
| `reconnect_delay` | `5` | reconnect backoff for both sides in seconds |
| `write_enabled` | `true` | global gate for MQTT → OPC UA writes |
| `web.host`, `web.port` | `127.0.0.1`, `8080` | web console bind address |

## Write safety (MQTT → OPC UA)

A published value reaches the OPC UA server only when **all** of these pass — otherwise it is rejected and logged in the event log:

1. **Global gate** — `write_enabled: true` (toggleable live from the console's Settings panel).
2. **Per-node flag** — the node is configured `"writable": true` (the `R/W` badge in the console).
3. **Known node** — `<NodeName>` exists in the node map.
4. **Type coercion** — the payload is converted to the node's OPC UA data type read at connect time:

| Node type | Accepted payloads | Rejected (examples) |
|---|---|---|
| Int…/UInt… | `42`, `"42"`, `42.0` | `12.5`, `"abc"`, `true` |
| Float/Double | `4.5`, `"4.5"`, `4` | `"abc"`, `true` |
| Boolean | `true/false`, `1/0`, `on/off`, `yes/no` | `"maybe"` |
| String | any text (JSON string or raw) | — |
| DateTime | ISO-8601 string | unparsable text |

5. **Server accepts the write** — e.g. a read-only variable inside the server still fails here and is logged, never crashes the gateway.

Set topics are published **non-retained**, so a command is never replayed after a broker restart. The write path is loop-safe: the gateway subscribes only to `…/set/+` and publishes only to `…` and `…/<name>`, so it never consumes its own messages.

## Web console guide

- **Header** — connection pills (OPC UA / MQTT, green = up, tooltip = last error), uptime, counters (reads / publishes / writes, ✗ = failures), node count.
- **Connection panel** — edit OPC UA URL, broker, port and master topic, then **Apply & reconnect**; **Save config** additionally persists the current runtime state to `config.json`.
- **Settings panel** — poll interval and the global **write gate** (unchecking it makes every MQTT write rejected and logged — useful in production).
- **Node cards** — big live value (flash on change), sparkline for numeric values, OPC UA read statistics, last MQTT-published payload and time. Writable cards get a value box + **Write → MQTT** button; read-only cards keep the button disabled.
- **Master topic payload** — the exact JSON currently retained on the broker.
- **Event log** — everything (connects, publishes bursts, writes, rejections, errors), filterable by source; newest first.
- **Add node / Browse server** — browse the connected server's address space from `/Objects`, click **open** to drill down, click a NodeId to fill the form, then **+ add** (or add manually by NodeId). Removing a node also clears its retained MQTT payload.

## Running on a different port

- Web console: set `web.port` in `config.json` (default `8080`), or apply it from the console at runtime.
- A second gateway instance should also get its own `mqtt.client_id` prefix (e.g. `opcua_mqtt_bridge_2`) — the per-connection suffix keeps instances from kicking each other, but distinct prefixes make broker-side debugging easier.
- Alternative config file: `python main.py path\to\other-config.json`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| OPC UA pill stays red, `connect … failed` in the log | wrong URL, server down, or firewall; the gateway keeps retrying every `reconnect_delay` seconds — fix the endpoint in the console and Apply. |
| MQTT pill stays red | broker not running or wrong port; publishes are queued and delivered on reconnect (QoS 1). |
| Broker logs duplicate-client kicks | two instances share a client id; this gateway adds a random suffix per connection — check for *other* clients using the same prefix. |
| `write … rejected: 'X' expects Int32, got 'abc'` | payload does not match the node's data type — this is the type guard doing its job. |
| Write never arrives although published | node is `R` (read-only) or the global gate is off — both are visible in the console. |
| Console shows "connecting to gateway…" | web server restarted or WS blocked; the page reconnects automatically every 2 s. |
| Port 8080 already in use | change `web.port` in `config.json`. |
| OPC UA server requires security | this client connects with SecurityPolicy `None` (like the sibling unidirectional bridges); point it at an endpoint that allows it. |

## Tested on

- Windows 11 · Python 3.13.15 · Mosquitto 2.x (Windows service, port 1883)
- asyncua demo server (`tools/demo_opcua_server.py`, port 4840/4848) — full bidirectional round trip
- Headless end-to-end check: `python tools/e2e_check.py` → 9/9 checks pass (connections, both directions, write gate, type guard, range guard, gate re-open, topic-scheme sanitization)

## Project layout

```
OPCUA_2_MQTT_GATEWAY/
├── main.py                    entry point (engine + web console)
├── config.json                endpoints, nodes, gates, web port
├── requirements.txt
├── gateway/
│   ├── config.py              loading, validation, normalization
│   ├── mqtt_link.py           threaded paho-mqtt link (auto-reconnect, unique client id)
│   ├── bridge.py              engine: polling, publishing, write path, event log, state
│   └── webapp.py              FastAPI REST + WebSocket API, static hosting
├── static/
│   ├── index.html             single-page console
│   ├── style.css              industrial dark theme
│   └── app.js                 live updates, sparklines, write controls, browse tree
├── tools/
│   ├── demo_opcua_server.py   demo OPC UA simulation server
│   └── e2e_check.py           headless end-to-end verification (exit 0 = all pass)
└── docs/web-console.png       console screenshot
```

## Relation to the sibling bridges

The two `UNI_OPCUA_2_MQTT_*` folders in `OPCUA + MQTT/` are the original unidirectional bridges; they keep their single-file style and share the `../uni_common.py` config/connection helpers. This folder is the bidirectional successor: same topic conventions as the JSON variant (`<master_topic>` = JSON snapshot), plus per-node topics, the write-back path, and the web console.
