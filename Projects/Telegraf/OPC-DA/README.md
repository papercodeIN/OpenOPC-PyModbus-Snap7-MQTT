<div align="center">

# ⚡ Telegraf + OPC DA

**Windows OPC DA (Classic) → Telegraf → CSV, SQL or MQTT — without writing code**

[![Telegraf](https://img.shields.io/badge/Telegraf-1.40.3-00B4AB?logo=influxdb&logoColor=white)](https://www.influxdata.com/downloads/)
[![Windows](https://img.shields.io/badge/Windows-10%20%7C%2011-0078D6?logo=windows&logoColor=white)](#-what-you-need)
[![OPC DA](https://img.shields.io/badge/OPC%20DA-Classic-6C4CF1)](#-how-it-works)
[![Live tests](https://img.shields.io/badge/Live%20tests-CSV%20%C2%B7%20SQLite%20%C2%B7%20MQTT-success)](#-test-it)

**[⚡ Quick start](#-quick-start)** · **[🧩 How it works](#-how-it-works)** · **[🎯 Change tags](#-change-server-and-tags)** · **[🔀 Multi-server](#-multiple-opc-da-servers)** · **[🩺 Fix](#-troubleshooting)**

</div>

> [!NOTE]
> **Documentation-only copy.** The runnable files — `opcda.exe`, `opcda.conf`, `opcda_to_*.conf`/`.bat`, setup scripts and the wrapper DLL — are maintained in the private repository. This public copy keeps the full setup, architecture and research guide; the `C:/ProgramData/...` paths below still describe the runtime layout.

> [!TIP]
> **In a hurry?** The [quick start](#-quick-start) gets a CSV row flowing in five steps. Deep details are folded into collapsible sections, so the page stays short.

**What you get:** one plugin config per OPC DA server, one Telegraf pipeline per destination, and a tested 45-tag starter list. Each running pipeline owns its `opcda.exe`; no custom code to maintain.

> [!NOTE]
> **Validated on Windows x64** with Telegraf **1.40.3** and the free **Matrikon OPC Simulation Server** (`Matrikon.OPC.Simulation.1`).
> **Live:** CSV, SQLite, MQTT (JSON + RAW) and the two-server CSV sample. **Config check only:** MySQL, SQL Server, PostgreSQL, InfluxDB — their credentials stay `CHANGE_ME` until you set yours.

---

## ⚡ Quick start

| # | Do this | Command / action |
|:--:| --- | --- |
| 1 | **Install Telegraf** (from the project folder, private repo) | `powershell -ExecutionPolicy Bypass -File "../install-telegraf.ps1"` |
| 2 | **Install an OPC DA server** | Free: [Matrikon Simulation Server](https://www.matrikonopc.com/products/opc-drivers/opc-simulation-server.aspx) — run the MSI **as Administrator**, keep OPC Explorer |
| 3 | **Register the wrapper and stage the runtime** (elevated) | `powershell -ExecutionPolicy Bypass -File ./setup_opcda.ps1` |
| 4 | **Point at your tags** | Edit `C:/ProgramData/Telegraf/OPC-DA/opcda.conf` — **skip for Matrikon**: the shipped list already matches |
| 5 | **Run** | Double-click `opcda_to_csv.bat` |

**✅ Success looks like this**

- `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_wide_<stamp>.csv` gets one row per second.
- `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_narrow_<stamp>.csv` gets one row per tag per second.
- `http://127.0.0.1:8290/health` returns `OK`.

> [!WARNING]
> Those are demo paths. Change `files = [...]` in `opcda_to_csv.conf` **and** `CSV_DIR` in `opcda_to_csv.bat` before production.

---

## 🧩 How it works

```text
OPC DA server ──(COM/DCOM + wrapper)──► opcda.exe ──(line protocol)──► Telegraf ──► CSV / SQL / MQTT
                                             ▲
                                       opcda.conf
                                    (server + tag list)
```

- `opcda.exe` is a **long-running external input**. It connects to the OPC DA server, polls the configured items, and prints Influx Line Protocol to stdout:
  ```text
  opcda_source BB_UInt2=0i 1795548780000000000
  opcda_source BB_String="" 1795548780000000000
  ```
- Telegraf starts it through `[[inputs.execd]]`, parses stdout (`data_format = "influx"`), and applies the processors/outputs. **Telegraf never parses `opcda.conf`** — it only passes the path to the exe.
- All seven single-server pipelines share the same `opcda.exe` + `opcda.conf`; their output and health settings differ, but the server/tags come from that one file. Change them once and every pipeline follows.
- Only items whose OPC quality is **Good** are emitted. Bad/uncertain tags simply skip that poll.
- **One `opcda.conf` = one OPC DA server.** The shim reads only the first `[[inputs.opcda]]` block — see [🔀 Multi-server](#-multiple-opc-da-servers).

<details>
<summary><b>📁 What is in the project</b></summary>

| File | Role |
| --- | --- |
| `opcda.exe` | 32-bit external input plugin: OPC DA → line protocol |
| `opcda.conf` | External-plugin config: ProgID, node, item list (source copy) |
| `opcda_to_*.conf` / `.bat` | Seven Telegraf pipelines and their launchers |
| `opcda_multi_server.conf` | Reference config for several OPC DA servers |
| `setup_opcda.ps1` | Elevated staging: wrapper registration + runtime folder + exe/conf |
| `setup_opcda_wrapper.ps1` | Per-user COM redirect workaround (only if needed) |
| `lib/gbda_aut.dll` | Bundled 32-bit Graybox wrapper DLL |

</details>

---

## ✅ What you need

| Component | Needed? | Why / notes |
| --- | :--: | --- |
| Windows 10 / 11 x64 | ✅ | OPC DA is COM/DCOM; there is no Linux/macOS build of this plugin |
| [Telegraf](https://www.influxdata.com/downloads/) 1.40.3 (tested) | ✅ | Runtime; per-user install is enough, no admin |
| An OPC DA **server** | ✅ | Source of the data; this project is the client side |
| OPC DA Automation Wrapper 2.02 (`gbda_aut.dll` / `OPCDAAuto.dll`) | ✅ | COM bridge used by `opcda.exe`; a 32-bit Graybox DLL is bundled |
| `OpcEnum` service | 🌐 | Required for remote servers/browsing; the local simulator also installs it |
| OPC client (e.g. Matrikon OPC Explorer) | 👍 | Verify ProgID and ItemIDs before debugging Telegraf |
| Administrator rights | 🔧 | Only for wrapper registration/staging; pipelines run as a normal user |

> [!IMPORTANT]
> **Bitness must match: `opcda.exe` ↔ wrapper DLL ↔ OPC server.** The bundled exe and wrapper are **32-bit** and work with most OPC DA servers, including Matrikon.

<details>
<summary><b>🔧 64-bit server? Wrapper choices? Open this</b></summary>

**64-bit OPC server**

- Download `opcda_amd64.exe` from the [plugin releases](https://github.com/lpc921/telegraf-execd-opcda/releases); the bundled binary is `opcda_i386.exe`.
- Register a 64-bit `gbda_aut.dll` / `OPCDAAuto.dll` in `System32`; a 32-bit exe cannot load a 64-bit wrapper (and vice versa).
- Point the execd `command` at the amd64 exe.
- Registration: 32-bit wrapper → `C:/Windows/SysWOW64/regsvr32.exe`; 64-bit wrapper → `C:/Windows/System32/regsvr32.exe`.

**Wrapper choices**

| Wrapper | Notes |
| --- | --- |
| **Graybox** `gbda_aut.dll` | Free, bundled in `lib/`, registered by `setup_opcda.ps1` · [official page](http://gray-box.net/download_daawrapper.php?lang=en) |
| **Matrikon** `OPCDAAuto.dll` | Proprietary; installed with Matrikon products, usually at `C:/Program Files (x86)/Common Files/MatrikonOPC/Common/` |
| **OPC Core Components** | OPC Foundation package with `OpcEnum` + proxy/stub DLLs · [download](https://opcfoundation.org/developer-tools/samples-and-tools-classic/core-components) |

**Plugin fallback order:** `OPC.Automation.1` → `Graybox.OPC.DAWrapper.1` → `Matrikon.OPC.Automation.1`.

> On some PCs `OPC.Automation.1` points at a DLL from an uninstalled product, and Graybox cannot add items (`No such interface supported`). The [wrapper fix](#-troubleshooting) handles exactly that case.

</details>

---

## 🚀 Setup

### 1️⃣ Install Telegraf

From the project folder (private repo):

```powershell
powershell -ExecutionPolicy Bypass -File "../install-telegraf.ps1"
```

The script downloads the latest official Windows ZIP, installs to `%LOCALAPPDATA%/Telegraf`, adds it to the **user PATH**, and runs `telegraf --version`. It needs GitHub CLI:

```powershell
winget install GitHub.cli
gh auth login
```

<details>
<summary><b>Manual ZIP install + launcher lookup</b></summary>

1. Download `telegraf-<version>_windows_amd64.zip` from <https://www.influxdata.com/downloads/>.
2. Extract to `%LOCALAPPDATA%/Telegraf` so `telegraf.exe` sits directly inside.
3. Add that folder to PATH, or rely on the launchers (they check `%LOCALAPPDATA%/Telegraf/telegraf.exe` first, then PATH).
4. Open a **new** terminal and verify:
   ```powershell
   telegraf --version
   # Telegraf 1.40.3 (git: HEAD@41b45388)
   ```

</details>

### 2️⃣ Install an OPC DA server

Telegraf is only the **client**. Install the server that owns the tags — a simulator first, then the plant server, or any OPC DA server with a ProgID; the Telegraf side is identical. **Free test server:** [MatrikonOPC Simulation Server](https://www.matrikonopc.com/products/opc-drivers/opc-simulation-server.aspx) v2.0.0.8878 (free for non-production; [direct download](https://www.matrikonopc.com/downloads/178/index.aspx)) — it also installs **OPC Explorer**.

**Fast check:** the shipped `opcda.conf` targets this server. Open OPC Explorer → **Local** → `Matrikon.OPC.Simulation.1` → expand `Bucket Brigade` / `Random` / `Saw-toothed Waves` / `Square Waves` / `Triangle Waves` → add items. Values must change every second; if this fails, fix the OPC install before touching Telegraf. Confirm `OPCSim.exe` (starts with Windows) and `OpcEnum` are running.

<details>
<summary><b>Production server, remote DCOM and the 45/55 tag list</b></summary>

Run the MSI **as Administrator**, accept defaults, and keep **both** the simulation server and OPC Explorer selected. From a production server (Kepware KEPServerEX, Siemens SIMATIC NET, Rockwell FactoryTalk, ABB, Yokogawa, …) you need the **ProgID** (e.g. `Kepware.KEPServerEX.V6`) and exact **ItemIDs** (e.g. `Channel1.Device1.Tag1`, spaces/dots included); confirm them in the vendor's OPC client first. Simulator examples: `Random.Int4`, `Bucket Brigade.Int4`, `Square Waves.Boolean`, `Saw-toothed Waves.Real8`.

**Remote OPC:** configure DCOM (`dcomcnfg.exe`) on both machines with the same local account (or a dedicated domain account) and launch/access permissions; keep `OpcEnum` running on the remote machine for browsing; open firewall/RPC ports. The account running Telegraf — interactive **or service** — needs those permissions. A working OPC Explorer session under your login does **not** guarantee a service can connect. For local servers keep `nodes = ["localhost"]`. The plugin uses the **first node that connects successfully**; a node list is a fallback order, not a load balancer.

**45 of 55 simulator tags:** the shipped list logs 45 tags (the list used for the live tests). Array, `Money`, `Time` and `Qualities` items are excluded because the read loop aborts on those VARIANT types. Start from the working list and add tags incrementally.

</details>

### 3️⃣ Register the wrapper and stage the runtime

Open **PowerShell as Administrator**, `cd` to the project folder (private repo), then run:

```powershell
powershell -ExecutionPolicy Bypass -File ./setup_opcda.ps1
```

<details>
<summary><b>What the script does, options, manual alternative and wrapper fix</b></summary>

The script starts `OpcEnum`; finds a wrapper (`lib/gbda_aut.dll` → local `OPCDAAuto.dll` → standard Matrikon paths → `SysWOW64`/`System32`); stages it at `C:/ProgramData/Telegraf/OPC-DA/gbda_aut.dll`; registers it machine-wide with the bitness-appropriate `regsvr32`; creates the runtime folder and copies `opcda.exe` + `opcda.conf` (existing files kept unless `-Force`); verifies `OPC.Automation.1` and its `InprocServer32` target; prints next actions (edit config, test the exe, run a pipeline).

```powershell
./setup_opcda.ps1 -DllPath "C:/path/to/OPCDAAuto.dll"  # specific wrapper
./setup_opcda.ps1 -Force                              # overwrite runtime files
./setup_opcda.ps1 -SkipRegister                       # DLL already registered
```

> The script targets the bundled **32-bit** wrapper. For a 64-bit server, register a 64-bit wrapper manually and use the amd64 exe.

**Manual alternative**

```powershell
mkdir "C:/ProgramData/Telegraf/OPC-DA"
copy "opcda.exe"        "C:/ProgramData/Telegraf/OPC-DA/opcda.exe"
copy "opcda.conf"       "C:/ProgramData/Telegraf/OPC-DA/opcda.conf"
copy "lib/gbda_aut.dll" "C:/ProgramData/Telegraf/OPC-DA/gbda_aut.dll"
C:/Windows/SysWOW64/regsvr32.exe "C:/ProgramData/Telegraf/OPC-DA/gbda_aut.dll"
Start-Service OpcEnum
```

**Broken `OPC.Automation.1`?** (machine-wide registration sometimes points at a missing Schneider DLL) Run **without** elevation `powershell -ExecutionPolicy Bypass -File ./setup_opcda_wrapper.ps1`. It writes a per-user (HKCU) redirect of `OPC.Automation.1` / `OPC.Automation` to the Matrikon wrapper CLSID; undo with `./setup_opcda_wrapper.ps1 -Remove`. It needs the Matrikon wrapper and does **not** apply to a service under LocalSystem/another account — fix machine-wide registration or run the service as the same user.

</details>

---

## 🎯 Change server and tags

Edit **only** `C:/ProgramData/Telegraf/OPC-DA/opcda.conf` — all seven `opcda_to_*.conf` files point there.

```toml
[[inputs.opcda]]
  name = "opcda_source"                 # used when running opcda.exe standalone
  server = "Your.Server.ProgID"         # exact OPC DA ProgID
  nodes = ["localhost"]                 # or ["192.168.1.50"] for a remote server
  items = [
    { item = "Plant.Line1.Temperature", name = "L1_Temp" },
    { item = "Plant.Line1.Pressure",    name = "L1_Press", tags = [["line", "1"], ["unit", "bar"]] },
  ]
```

`item` is the exact OPC ItemID; `name` is the output field (optional, defaults to ItemID — keep it unique); `tags` adds extra tags to that metric. To change only some tags, keep the rest of the list.

> [!IMPORTANT]
> `opcda.exe` reads the config **at startup**: restart Telegraf. Edit the runtime copy, or delete it before relaunching after editing the repo copy — the `.bat` copies only when the runtime copy is **missing**, so a stale copy silently wins.

### 🗄️ Destination settings

Each pipeline has its own paths, port and log. Open the table before the first run.

<details>
<summary><b>Open destination paths, ports and logs</b></summary>

| Pipeline | Change before first use | Health | Log |
| --- | --- | :--: | --- |
| `opcda_to_csv.conf` | both `files = [...]` paths + `CSV_DIR` in the `.bat` | 8290 | `telegraf-opcda-csv.log` |
| `opcda_to_sqlite.conf` | both `data_source_name` paths; folder must exist | 8296 | `telegraf-opcda-sqlite.log` |
| `opcda_to_mysql.conf` | both DSNs (or `${MYSQL_DSN}`) + DB/table rights | 8294 | `telegraf-opcda-mysql.log` |
| `opcda_to_mssql.conf` | both DSNs (or `${MSSQL_DSN}`) | 8293 | `telegraf-opcda-mssql.log` |
| `opcda_to_postgres.conf` | both DSNs (or `${POSTGRES_DSN}`) | 8295 | `telegraf-opcda-postgres.log` |
| `opcda_to_influxdb.conf` | `urls`, `token`, `organization`, `bucket` (or `${INFLUX_*}`) | 8291 | `telegraf-opcda-influxdb.log` |
| `opcda_to_mqtt.conf` | `servers`, `topic`, optional credentials/TLS | 8292 | `telegraf-opcda-mqtt.log` |
| `opcda_multi_server.conf` | reference only: uncomment server 2 | 8297 | `telegraf-opcda-multi.log` |

Secrets are `CHANGE_ME` placeholders with commented `${VAR}` alternatives; for example:

```powershell
[Environment]::SetEnvironmentVariable("MYSQL_DSN", "telegraf:secret@tcp(127.0.0.1:3306)/telegraf", "User")
```

> Telegraf expands `${VAR}` from **its own** process environment. For a service, set variables at machine level or in the service environment — not only in your interactive session. No `.bat` edit is needed to change servers, only output paths/settings.
</details>

---

## 🧪 Test it

Test in this order — each step isolates one layer.

| Step | Action | Pass condition |
|:--:| --- | --- |
| 1 | Connect in OPC Explorer and add items | Values change every second |
| 2 | Run `opcda.exe` alone (below) | It prints `opcda_source ...` lines |
| 3 | `telegraf config check --config ./opcda_to_csv.conf` (repeat for every config, incl. multi) | Exit code 0 |
| 4 | Run `opcda_to_csv.bat` for ~10 s, then `Ctrl+C` | CSVs grow, no errors in the log |
| 5 | Check health / database / MQTT | `OK`, rows or messages present |

```powershell
cd C:/ProgramData/Telegraf/OPC-DA
./opcda.exe -config opcda.conf -poll_interval 1s
# Ctrl+C to stop
```

Expected output:

```text
2026/11/24 19:32:59 I! Connecting to Matrikon.OPC.Simulation.1[localhost]
opcda_source BB_UInt2=0i 1795548780000000000
opcda_source BB_Real4=0 1795548780000000000
opcda_source BB_String="" 1795548780000000000
```

> [!WARNING]
> **Do not use `telegraf --test`** with these configs. With `[[inputs.execd]]` it starts the external process and keeps running without printing a batch (verified on 1.40.3). Use a short real run.

<details>
<summary><b>Full checklist + expected files, SQL/MQTT/health commands and common test traps</b></summary>

**Standalone failure?** `TryConnect was not successful: Connection failed` means the server/ProgID/node/DCOM layer is wrong — fix that before Telegraf. Run it in a real console: a detached process with closed stdin (e.g. `Start-Process -RedirectStandardOutput`) can exit immediately. **Config-check warnings:** all shipped configs pass; two harmless future-default notices may appear (strict env handling, `skip_processors_after_aggregators`).

**CSV output** (default folder): `opcda_wide_<stamp>.csv` (one row/second, one column per tag), `opcda_narrow_<stamp>.csv` (one row per tag), log `C:/ProgramData/Telegraf/telegraf-opcda-csv.log`. Direct `telegraf --config` runs (no `.bat`) leave `OPCDA_CSV_STAMP` unset and write `opcda_wide_nostamp.csv` / `opcda_narrow_nostamp.csv`. The serializer always writes `timestamp,measurement,...` first:

```text
timestamp,measurement,id,name,value
1795524886,opcda_narrow,OPCDA_narrow,Sqr_UInt2,0
```

**SQLite:** open `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_data.db`, check `opcda_wide` / `opcda_narrow`.

**MQTT / health:**

```powershell
mosquitto_sub -h 127.0.0.1 -t "plant/opcda/json" -v
mosquitto_sub -h 127.0.0.1 -t "plant/opcda/raw/#" -v   # after enabling RAW mode
Invoke-WebRequest http://127.0.0.1:8290/health -UseBasicParsing | Select-Object -Expand Content
# OK
```

</details>

---

## 📤 Outputs

| Config | Launcher | Destination | Layout |
| --- | --- | --- | --- |
| `opcda_to_csv.conf` | `opcda_to_csv.bat` | rotating CSV | wide + narrow |
| `opcda_to_sqlite.conf` | `opcda_to_sqlite.bat` | SQLite (`opcda_data.db`) | wide + narrow |
| `opcda_to_mysql.conf` | `opcda_to_mysql.bat` | MySQL | wide + narrow |
| `opcda_to_mssql.conf` | `opcda_to_mssql.bat` | SQL Server | wide + narrow |
| `opcda_to_postgres.conf` | `opcda_to_postgres.bat` | PostgreSQL | wide + narrow |
| `opcda_to_influxdb.conf` | `opcda_to_influxdb.bat` | InfluxDB v2 | wide + narrow |
| `opcda_to_mqtt.conf` | `opcda_to_mqtt.bat` | MQTT (JSON active, RAW alternative) | one message/poll |
| `opcda_multi_server.conf` | `telegraf --config` | CSV (one file, `server` column) | narrow |

**Wide** = `opcda_wide`, one row/second with one column per item. **Narrow** = `opcda_narrow`, one row/item (`id`, `name`, `value`). Both are written by each CSV/SQL logger (not duplicates); comment out one `[[outputs.*]]` block to keep only the other. The wide path clones metrics, clears tags, renames to `opcda_wide` and merges one second with `aggregators.merge`; narrow keeps one metric per field.

### 📡 MQTT

`opcda_to_mqtt.conf` has two output blocks; exactly one is active. **JSON** (default): `layout = "batch"`, `data_format = "json"`, topic `plant/opcda/json`. **RAW** (alternative): `layout = "field"`, topic `plant/opcda/raw/<field>`, one scalar per tag. QoS 1, no retain, `client_id` random unless set; credentials/TLS are commented placeholders.

<details>
<summary><b>JSON payload example + switching modes</b></summary>

One message per poll, wrapped in a `metrics` array with one entry per tag:

```json
{
  "metrics": [
    {"fields":{"BB_Boolean":false},"name":"opcda_raw","tags":{},"timestamp":1795548780},
    {"fields":{"BB_UInt2":0},"name":"opcda_raw","tags":{},"timestamp":1795548780}
  ]
}
```

Consumers iterate `metrics[]`, read `fields` (one tag per entry) plus `name`/`tags`/`timestamp`. Switch modes by commenting out the active block and uncommenting the other.

</details>

**Fusion Automate / SCADA hand-off:** point Fusion Automate (FusionAutomate), Node-RED, FUXA, Ignition, Grafana or any MQTT dashboard at the broker and subscribe to `plant/opcda/json` (or one topic per server). Every JSON entry already carries the tag name/value, so no Telegraf-side mapping is needed. Set `MQTT_USERNAME` / `MQTT_PASSWORD` (and TLS variables) in the Telegraf service environment.

<details>
<summary><b>What each <code>.bat</code> does + running notes</b></summary>

Each launcher `cd`s to its folder; creates `%ProgramData%/Telegraf/OPC-DA` if missing and copies `opcda.conf` **only if absent**; creates the CSV output folder (CSV launcher only); fails clearly if `opcda.exe` is missing; finds Telegraf in `%LOCALAPPDATA%/Telegraf` or PATH, then a helpful error; runs `telegraf --config <matching conf>` (`check` as first argument runs `config check`); stamps CSV filenames with the run start (`OPCDA_CSV_STAMP`) and pauses on exit.

Each pipeline starts **its own** `opcda.exe`; CSV + MQTT side by side polls twice — fine for a simulator, size the plant server load accordingly. Do not run two configs with the same health port, output file or DB table. Logs: `C:/ProgramData/Telegraf/telegraf-opcda-<destination>.log`. For unattended use, run Telegraf as a Windows service/Scheduled Task and ensure the account can read `C:/ProgramData/Telegraf/OPC-DA`, write outputs and use the OPC/DCOM registration.

</details>

---

## 🔀 Multiple OPC DA servers

> [!IMPORTANT]
> **One `opcda.conf` = one server.** The plugin shim decodes only `primitives[0]`, so a second `[[inputs.opcda]]` block is silently ignored — verified 2026-11-24 with a two-block config (only the first block's measurement/tags appeared). `nodes = [...]` is a fallback list, not multi-server. **N servers = N `opcda.exe` processes + N `[[inputs.execd]]` blocks with unique `name_override` values.**

`opcda_multi_server.conf` (private repo) is the ready sample: **server 1 active**, **server 2 commented**. It lives in one reference file rather than in every pipeline — copy the pattern into whichever `opcda_to_*.conf` you standardise on.

**Five steps:** copy `opcda.conf` → `opcda_server2.conf` and edit it; uncomment the **SERVER 2** block with a unique `name_override`; create the output folder; run `config check` then Telegraf; confirm `opcda_multi.csv` shows both `server` values.

<details>
<summary><b>Copy/paste commands for the five steps</b></summary>

1. Copy and edit the plugin config:
   ```powershell
   copy "C:/ProgramData/Telegraf/OPC-DA/opcda.conf" "C:/ProgramData/Telegraf/OPC-DA/opcda_server2.conf"
   notepad "C:/ProgramData/Telegraf/OPC-DA/opcda_server2.conf"
   ```
   Change `server`, `nodes` and `items` for the second server.
2. Uncomment the **SERVER 2** `[[inputs.execd]]` block; keep `name_override = "opcda_server2"` unique.
3. Create the output folder if missing:
   ```powershell
   New-Item -ItemType Directory -Force -Path "C:/Users/Parrot/Desktop/OPCDA_Outputs" | Out-Null
   ```
4. Validate and run:
   ```powershell
   telegraf config check --config ./opcda_multi_server.conf
   telegraf --config ./opcda_multi_server.conf
   ```
5. Confirm `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_multi.csv` shows both servers:
   ```text
   timestamp,measurement,id,name,server,value
   ...,opcda_narrow,OPCDA_narrow,Tri_Real8_s2,opcda_server2,72.25663174395999
   ```

</details>

The sample's processors are **generic**: they derive `server` from `name_override` and rename metrics to `opcda_narrow`. For server 3, copy the block, give it a unique `name_override`, point `-config` at `opcda_server3.conf` — no processor/output change.

<details>
<summary><b>Failure isolation, per-server routing and live evidence</b></summary>

**Failure isolation:** each server has its own process, so a dead server does not stop the others. Tested with a bad ProgID for server 2:

```text
[inputs.execd] stderr: "Connecting to No.Such.OPC.Server.1[localhost]"
[inputs.execd] stderr: "Err: RunInput error: failed to start input: TryConnect was not successful: Connection failed"
[inputs.execd] Process ... exited: exit status 1
[inputs.execd] Restarting in 10s...
```

Server 1 kept writing (**765 rows** in the same window); server 2 retried every `restart_delay = "10s"` and reconnects on its own when the server is back.

**Per-server output:** filter with the `server` tag:

```toml
[[outputs.file]]
  namepass = ["opcda_narrow"]
  tagpass = { server = ["opcda_server1"] }
  files = ["C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_server1.csv"]
  data_format = "csv"
  csv_header = true
```

Use the same `tagpass` for a per-server `[[outputs.mqtt]]` topic, SQL table or InfluxDB bucket. For fully separate failure domains/restarts, run one Telegraf instance per server with unique health ports.

**Live evidence:** two execd inputs wrote **720 rows** (45-tag config) + **36 rows** (3-tag config) into one CSV with distinct `server` values. The test used the same Matrikon simulator under two configs; a second physical server follows the identical pattern.

If you add a non-OPC input to this file, add `namepass = ["opcda_server1", ...]` to both starlark processors so it is not converted.

</details>

---

## 🩺 Troubleshooting

**Logs first:** `C:/ProgramData/Telegraf/telegraf-opcda-<destination>.log`. `opcda.exe` stderr is prefixed `[inputs.execd] stderr:`.

<details>
<summary><b>🔎 Symptom → cause → fix (17 common failures)</b></summary>

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Telegraf was not found` | Not installed / PATH not refreshed | Run `install-telegraf.ps1`, open a new terminal; launchers also check `%LOCALAPPDATA%/Telegraf` |
| `OPC DA external plugin not found` | No `opcda.exe` in ProgramData | Run `setup_opcda.ps1`, or copy the bundled exe |
| `TryConnect was not successful: Connection failed` | Server down, wrong ProgID/node, DCOM or bitness | Start the server, verify in OPC Explorer, check `dcomcnfg.exe`, match 32/64-bit |
| `No such interface supported` while adding items | `OPC.Automation.1` points at a broken/missing wrapper | Run `setup_opcda_wrapper.ps1`; install Matrikon/OPC Core Components wrapper |
| `Class not registered` / `0x80040154` | Wrapper not registered for the exe bitness | `regsvr32` the matching DLL (SysWOW64 for 32-bit, System32 for 64-bit), rerun setup |
| `OPC.Automation.1 points to a missing DLL` | Stale registration from an uninstalled product | Run `setup_opcda_wrapper.ps1`, or repair OPC Core Components |
| Only the first server's tags appear | Second `[[inputs.opcda]]` block in one config | One exe per server; use `opcda_multi_server.conf` |
| Some tags never appear | Quality not Good, or unsupported VARIANT | Verify in OPC Explorer; keep scalar tags only |
| All values zero / empty strings | Simulator items idle or server returns Bad | Add/read the tag in OPC Explorer first |
| No new CSV rows | Missing folder/permission, Telegraf stopped, aggregation window | Create the folder, read the log, keep starlark time normalization |
| Timestamps offset by hours | OPC server clock/timezone differs | Shipped starlark resets to the agent clock — do not remove it |
| `bind: Only one usage of each socket address` | Two configs share a health port | Stop the other or give each a unique port |
| `config check` warnings | Future Telegraf default changes | Harmless; optionally set explicit flags |
| Console works, service gets no data | HKCU redirect invisible to service; ACL; DCOM identity | Fix machine-wide registration, run service under the same user, grant folder access |
| Remote works in OPC Explorer, not Telegraf | Service vs interactive account DCOM difference | Configure DCOM launch/access for the Telegraf account |
| `opcda.exe` exits immediately with no output | Launched detached with closed stdin | Run in a normal console; let execd own it |
| CSV/SQLite still points at `C:/Users/Parrot/...` | Demo defaults | Edit output paths (and `CSV_DIR`) |

</details>

---

## 🧠 Research notes

<details>
<summary><b>13 non-obvious findings that shaped these configs (open when something behaves oddly)</b></summary>

1. **One input block only.** The shim decodes the first primitive; extra `[[inputs.opcda]]` blocks are ignored without an error. Multi-server = multiple processes.
2. **OPC timestamps are not local time.** On this machine, Matrikon reported timestamps **5h30m ahead**; the wide `aggregators.merge` discarded everything as outside its 1-second window. Every config starts with a `processors.starlark` block that sets `metric.time` to the Telegraf clock. Removing it breaks the wide layout and skews timestamps.
3. **45 of 55 simulator tags.** The read loop aborts on some VARIANT types (`ArrayOfReal8`, `ArrayOfString`, `Money`, `Time`, `Qualities`). Start from the working list and add tags incrementally, testing with `opcda.exe` alone.
4. **Quality filter.** Only `OPCQualityGood` items reach `AddFields`. A briefly Bad tag disappears for that poll; it is not a Telegraf error.
5. **`--test` is not a test for execd.** It keeps the external process running and prints nothing useful. Use `config check` + a short real run.
6. **Standalone stdin.** `opcda.exe` runs until stdin closes or it is interrupted. A detached launch with no stdin exits at once.
7. **The `.bat` copy rule.** Launchers copy `opcda.conf` only when the ProgramData copy is missing. Edit the runtime copy (preferred) or delete it before relaunching.
8. **The wrapper fix is per-user.** `setup_opcda_wrapper.ps1` writes HKCU; services and other users do not see it.
9. **Each pipeline polls independently.** Every `.bat` starts a new `opcda.exe`; two pipelines = two OPC subscriptions. Avoid running all seven against a production server.
10. **All paths are absolute.** Configs reference `C:/ProgramData/Telegraf/OPC-DA/...` literally. If you move the runtime, update the `command` in every `[[inputs.execd]]`.
11. **CSV always has a measurement column.** The serializer writes `timestamp,measurement,...` before tags/fields. The multi-server file adds a `server` tag column so two servers can share one CSV.
12. **Windows-only.** OPC DA relies on COM/DCOM; the login account, bitness and registration matter more than any Telegraf setting.
13. **The float converter drops string tags.** The single-server narrow path includes `processors.converter` with `float = ["value"]`; string items fail conversion every second and are discarded. The multi-server sample omits it. Remove it (or keep strings on a separate path) if you need textual tags.

</details>

---

## 🔐 Security

- Never commit real passwords, tokens or DSNs. Configs use `CHANGE_ME` plus commented `${VAR}` alternatives; put real values in the machine/service environment.
- Use read-only OPC access and least-privilege DB users. The plugin only reads tags (no writes), but the account can see the whole namespace it is granted.
- MQTT: enable authentication and TLS (`ssl://`, `tls_ca`/`tls_cert`/`tls_key`) beyond a lab broker.
- Restrict write access to the CSV/SQLite output folder.
- Register only the bundled Graybox or vendor-supplied wrapper DLLs; treat them as privileged code.
- For remote OPC, configure DCOM narrowly (specific user, launch/access only) instead of widening machine-wide permissions.

---

## 🔗 References

<details>
<summary><b>Plugin, Telegraf docs, wrappers and simulators</b></summary>

- [External plugin: lpc921/telegraf-execd-opcda](https://github.com/lpc921/telegraf-execd-opcda)
- [Plugin releases (32/64-bit binaries)](https://github.com/lpc921/telegraf-execd-opcda/releases)
- [Underlying Go OPC library: konimarti/opc](https://github.com/konimarti/opc)
- [Telegraf execd input](https://github.com/influxdata/telegraf/blob/master/plugins/inputs/execd/README.md)
- [Telegraf SQL output](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/sql/README.md)
- [Telegraf MQTT output](https://github.com/influxdata/telegraf/blob/master/plugins/outputs/mqtt/README.md)
- [Telegraf CSV serializer](https://github.com/influxdata/telegraf/blob/master/plugins/serializers/csv/README.md)
- [Telegraf download](https://www.influxdata.com/downloads/)
- [Graybox DA Automation Wrapper](http://gray-box.net/download_daawrapper.php?lang=en)
- [OPC Foundation Core Components](https://opcfoundation.org/developer-tools/samples-and-tools-classic/core-components)
- [MatrikonOPC Simulation Server](https://www.matrikonopc.com/products/opc-drivers/opc-simulation-server.aspx)
- [MatrikonOPC Simulation Server download](https://www.matrikonopc.com/downloads/178/index.aspx)

</details>

---

<div align="center">

**If this saved you an afternoon, ⭐ star the repo and share it.**

</div>
