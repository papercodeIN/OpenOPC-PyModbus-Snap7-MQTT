# Telegraf + OPC DA (Windows) — Complete Setup & Research Notes

> **Documentation-only copy.** The runnable files — `opcda.exe`, `opcda.conf`,
> `opcda_to_*.conf`/`.bat`, setup scripts and the wrapper DLL — are maintained in the
> private repository. This public copy keeps the full setup, architecture and research
> guide; the `C:/ProgramData/...` paths below still describe the runtime layout.

Telegraf reads **OPC DA (OPC Classic)** tags through the community external input
plugin [`lpc921/telegraf-execd-opcda`](https://github.com/lpc921/telegraf-execd-opcda).
The project contains the Windows runtime (`opcda.exe`), its config (`opcda.conf`),
seven ready-to-run pipelines (CSV, SQLite, MySQL, SQL Server, PostgreSQL, InfluxDB v2,
MQTT) and a reference config for **multiple OPC DA servers**
(`opcda_multi_server.conf`).

Everything below was validated on Windows x64 with **Telegraf 1.40.3** and the free
**Matrikon OPC Simulation Server** (`Matrikon.OPC.Simulation.1`), including live CSV,
SQLite and MQTT (JSON and RAW) output. The MySQL, SQL Server, PostgreSQL and InfluxDB
configs pass `config check`; their DSNs/tokens are `CHANGE_ME` placeholders until you
point them at your own servers. The multi-server pattern was validated with two
simultaneous `opcda.exe` processes writing to one CSV.

**In a hurry?** Install Telegraf (§3) → install an OPC DA server (§4) → run
`setup_opcda.ps1` (§5) → edit `opcda.conf` (§6, skip for the simulator: the shipped
list already targets it) → run `opcda_to_csv.bat` and inspect the CSV (§7).

---

## Contents

1. [How it works](#1-how-it-works)
2. [What must be installed](#2-what-must-be-installed)
3. [Step 1 — Install Telegraf](#3-step-1--install-telegraf)
4. [Step 2 — Install an OPC DA server](#4-step-2--install-an-opc-da-server)
5. [Step 3 — Register the OPC wrapper and stage the runtime](#5-step-3--register-the-opc-wrapper-and-stage-the-runtime)
6. [Step 4 — Point Telegraf at your OPC DA server](#6-step-4--point-telegraf-at-your-opc-da-server)
7. [Step 5 — Test the setup](#7-step-5--test-the-setup)
8. [Running the pipelines](#8-running-the-pipelines)
9. [Data layouts, MQTT and Fusion Automate](#9-data-layouts-mqtt-and-fusion-automate)
10. [Multiple OPC DA servers](#10-multiple-opc-da-servers)
11. [Troubleshooting](#11-troubleshooting)
12. [Research notes and hard-won details](#12-research-notes-and-hard-won-details)
13. [Security](#13-security)
14. [References](#14-references)

---

## 1. How it works

```text
OPC DA server (COM/DCOM, 32- or 64-bit)
        ^
        | OPC DA Automation Wrapper (gbda_aut.dll / OPCDAAuto.dll)
        |
   opcda.exe  <- C:/ProgramData/Telegraf/OPC-DA/opcda.conf  (server + items)
        |
        | stdout: Influx Line Protocol, one line per tag per poll
        v
Telegraf  [[inputs.execd]]
        |
        +-- processors: time normalization, wide clone/merge, narrow layout
        |
        +-- outputs: CSV | SQLite | MySQL | MSSQL | PostgreSQL | InfluxDB v2 | MQTT
```

- `opcda.exe` is a long-running external input daemon. It connects to the OPC DA
  server, reads the configured items every poll and prints Influx Line Protocol to
  stdout. Example:

  ```text
  opcda_source BB_UInt2=0i 1795548780000000000
  opcda_source BB_String="" 1795548780000000000
  ```

- Telegraf starts it with `[[inputs.execd]]`, parses stdout (`data_format = "influx"`)
  and applies the processors/outputs. **Telegraf never parses `opcda.conf`** — it only
  passes its path to the exe.

- All seven single-server pipelines share the same `opcda.exe` + `opcda.conf`; only the
  output blocks differ. Change the server or tags once and every pipeline follows.

- The plugin only emits items whose OPC quality is **Good**. Bad/uncertain tags simply
  do not appear for that poll.

- **One `opcda.conf` = one OPC DA server.** The external plugin loads only the first
  `[[inputs.opcda]]` block (see [section 10](#10-multiple-opc-da-servers)).

### What is in the project

| File | Role |
| --- | --- |
| `opcda.exe` | 32-bit external input plugin; reads OPC DA and writes line protocol |
| `opcda.conf` | External-plugin config: server ProgID, node and item list (source copy) |
| `opcda_to_*.conf` / `.bat` | Seven Telegraf pipelines and their launchers |
| `opcda_multi_server.conf` | Reference config for several OPC DA servers (section 10) |
| `setup_opcda.ps1` | Elevated staging: wrapper registration, runtime folder, exe + conf |
| `setup_opcda_wrapper.ps1` | Per-user COM redirect workaround (only if needed) |
| `lib/gbda_aut.dll` | Bundled 32-bit Graybox wrapper DLL |

---

## 2. What must be installed

| Component | Required? | Why / notes |
| --- | --- | --- |
| Windows 10 / 11 x64 | yes | OPC DA is COM/DCOM; there is no Linux/macOS build of the plugin |
| [Telegraf](https://www.influxdata.com/downloads/) 1.40.3 (tested) | yes | runtime; user install is enough, no admin |
| An OPC DA **server** | yes | source of the data; Telegraf and this project only provide the client side |
| OPC DA Automation Wrapper 2.02 (`gbda_aut.dll` or `OPCDAAuto.dll`) | yes | COM bridge used by `opcda.exe`; `lib/gbda_aut.dll` is bundled |
| `OpcEnum` service | for remote servers / browsing | the local simulation server also installs and starts it |
| OPC client (e.g. Matrikon OPC Explorer) | strongly recommended | verify ProgID and ItemIDs before debugging Telegraf |
| Administrator rights | only for setup | machine-wide `regsvr32`; the pipelines themselves run as a normal user |

### 32-bit vs 64-bit (the most common failure)

The **bitness of `opcda.exe`, the wrapper DLL and the OPC server must match**.

- The bundled `opcda.exe` and `lib/gbda_aut.dll` are **32-bit**. They talk to 32-bit
  OPC servers, which is what most OPC DA servers (including the Matrikon simulator) are.
- For a **64-bit** OPC server: download `opcda_amd64.exe` (the bundled binary is the
  32-bit `opcda_i386.exe`) from the
  [plugin releases](https://github.com/lpc921/telegraf-execd-opcda/releases), register a
  64-bit `gbda_aut.dll`/`OPCDAAuto.dll` in `System32`, and point the execd `command` at
  that exe. A 32-bit exe cannot load a 64-bit wrapper, and vice versa.
- On a 64-bit OS, a 32-bit wrapper is registered with
  `C:\Windows\SysWOW64\regsvr32.exe`, a 64-bit wrapper with
  `C:\Windows\System32\regsvr32.exe`.

### Wrapper choices

- **Graybox** `gbda_aut.dll` (bundled in `lib/`, free) — registered by
  `setup_opcda.ps1`. Official wrapper:
  [gray-box.net](http://gray-box.net/download_daawrapper.php?lang=en).
- **Matrikon** `OPCDAAuto.dll` — proprietary, usually installed with Matrikon products
  (the simulation server installs it under
  `C:/Program Files (x86)/Common Files/MatrikonOPC/Common/`). Not bundled here.
- **OPC Core Components Redistributable** — the OPC Foundation package that ships
  `OPCEnum` and the OPC proxy/stub DLLs; download from
  [opcfoundation.org](https://opcfoundation.org/developer-tools/samples-and-tools-classic/core-components).

> The plugin tries `OPC.Automation.1`, then `Graybox.OPC.DAWrapper.1`, then
> `Matrikon.OPC.Automation.1`. On some PCs `OPC.Automation.1` points at a DLL from an
> uninstalled product and the Graybox wrapper cannot add items ("No such interface
> supported"). `setup_opcda_wrapper.ps1` fixes exactly that case (section 5).

---

## 3. Step 1 — Install Telegraf

### Option A — the one-command installer (recommended)

The parent Telegraf folder ships `install-telegraf.ps1`. From the project folder:

```powershell
powershell -ExecutionPolicy Bypass -File "..\install-telegraf.ps1"
```

It downloads the latest official Windows ZIP, installs to
`%LOCALAPPDATA%\Telegraf`, adds that folder to the **user PATH** and verifies
`telegraf --version`. It needs the GitHub CLI (`gh`) for the release lookup:

```powershell
winget install GitHub.cli
gh auth login
```

### Option B — manual install

1. Download `telegraf-<version>_windows_amd64.zip` from
   <https://www.influxdata.com/downloads/>.
2. Extract it to `%LOCALAPPDATA%\Telegraf` so `telegraf.exe` sits directly there.
3. Add that folder to PATH (or rely on the launchers, which look in
   `%LOCALAPPDATA%\Telegraf\telegraf.exe` first, then PATH).
4. Open a **new** terminal and verify:

   ```powershell
   telegraf --version
   # Telegraf 1.40.3 (git: HEAD@41b45388)
   ```

All `.bat` launchers use this lookup order:
`%LOCALAPPDATA%\Telegraf\telegraf.exe` → `telegraf.exe` on PATH → helpful error.

---

## 4. Step 2 — Install an OPC DA server

Telegraf does not include an OPC DA server. The plugin is a **client**; you must
install the server that owns the tags. Use a simulator first and switch to the plant
server later — the Telegraf side is identical.

### 4.1 Free test server: Matrikon OPC Simulation Server

1. Download the free **MatrikonOPC Simulation Server** (v2.0.0.8878, free for
   non-production use) from
   <https://www.matrikonopc.com/products/opc-drivers/opc-simulation-server.aspx>
   (direct download page: <https://www.matrikonopc.com/downloads/178/index.aspx>).
   It also installs **MatrikonOPC Explorer**, a free OPC client used to verify tags.
2. Run the MSI **as Administrator**, accept the defaults, and keep both the
   simulation server and OPC Explorer selected.
3. Confirm the server is running: `OPCSim.exe` in Task Manager (it starts with
   Windows) and the `OpcEnum` service is running.
4. Open **MatrikonOPC Explorer**, connect to **Local** →
   `Matrikon.OPC.Simulation.1`, expand `Bucket Brigade`, `Random`, `Saw-toothed Waves`,
   `Square Waves`, `Triangle Waves` and add a few items to a group. Values must change
   every second. If this step fails, fix the OPC install before touching Telegraf.

The ProgID `Matrikon.OPC.Simulation.1` and the default `opcda.conf` tag list target
this server. The shipped list logs **45 of the simulator's 55 tags**; the array,
`Money`, `Time` and `Qualities` items are excluded because the plugin's read loop
aborts on those VARIANT types (section 12).

### 4.2 Production OPC DA server

Use whatever OPC DA server your plant already runs (Kepware KEPServerEX, Siemens
SIMATIC NET, Rockwell FactoryTalk, ABB, Yokogawa, …). You need two things from its
configuration tool:

- the **ProgID** (for example `Kepware.KEPServerEX.V6`, `Matrikon.OPC.Simulation.1`),
- the **ItemID** of every tag you want (for example `Channel1.Device1.Tag1`).

ItemIDs may contain spaces and dots; copy them exactly. Confirm them in the vendor's
OPC client first.

### 4.3 Remote OPC server

For a server on another PC:

- both machines need DCOM configured (`dcomcnfg.exe`), the same local account (or a
  dedicated domain account) with launch/access permissions on the OPC server,
- `OpcEnum` running on the remote machine for browsing,
- Windows Firewall / RPC ports open between the machines,
- the **account that runs Telegraf** (interactive user or service account) must have
  those DCOM permissions — a working OPC Explorer session under your login does not
  automatically mean a Windows service can connect.

For a local server, keep `nodes = ["localhost"]`. The plugin uses the first node that
connects successfully; a list is a fallback order, not a load-balancer.

---

## 5. Step 3 — Register the OPC wrapper and stage the runtime

### 5.1 One-shot setup (elevated)

Open **PowerShell as Administrator**, `cd` to the project folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_opcda.ps1
```

What it does:

1. Starts the `OpcEnum` service if it exists (warns if it does not).
2. Finds a wrapper DLL: `lib/gbda_aut.dll` first, then local `OPCDAAuto.dll`, then the
   standard Matrikon paths, then `SysWOW64`/`System32`.
3. Stages the DLL at `C:/ProgramData/Telegraf/OPC-DA/gbda_aut.dll` and registers it
   machine-wide with the bitness-appropriate `regsvr32`.
4. Creates `C:/ProgramData/Telegraf/OPC-DA` and copies `opcda.exe` + `opcda.conf` there
   (existing files are kept unless you pass `-Force`).
5. Verifies the `OPC.Automation.1` ProgID and its `InprocServer32` target.
6. Prints the next actions (edit the config, test the exe, run a pipeline).

Options:

```powershell
.\setup_opcda.ps1 -DllPath "C:\path\to\OPCDAAuto.dll"  # use a specific wrapper
.\setup_opcda.ps1 -Force                              # overwrite existing files
.\setup_opcda.ps1 -SkipRegister                       # DLL already registered
```

> The script is built around the bundled 32-bit wrapper. For a 64-bit OPC server,
> register a 64-bit wrapper manually and use the `amd64` exe (section 2).

### 5.2 Fix a broken `OPC.Automation.1` (only if step 5.1 warns or reads fail)

Run **without** elevation:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup_opcda_wrapper.ps1
```

This writes a **per-user** (HKCU) redirect of `OPC.Automation.1` and
`OPC.Automation` to the Matrikon wrapper CLSID, because the machine-wide
`OPC.Automation.1` on some PCs points to a missing Schneider DLL and the Graybox
wrapper cannot add items. Undo with:

```powershell
.\setup_opcda_wrapper.ps1 -Remove
```

> This fix is per Windows user and needs the Matrikon wrapper installed (it points
> `OPC.Automation.1` at Matrikon's CLSID). If Telegraf runs as a **Windows service**
> (LocalSystem or another account), the HKCU redirect does not apply — fix the
> machine-wide registration instead or run the service under the same user account.

### 5.3 Manual alternative

If you prefer not to run the script:

```powershell
mkdir "C:\ProgramData\Telegraf\OPC-DA"
copy "opcda.exe"        "C:\ProgramData\Telegraf\OPC-DA\opcda.exe"
copy "opcda.conf"       "C:\ProgramData\Telegraf\OPC-DA\opcda.conf"
copy "lib\gbda_aut.dll" "C:\ProgramData\Telegraf\OPC-DA\gbda_aut.dll"
C:\Windows\SysWOW64\regsvr32.exe "C:\ProgramData\Telegraf\OPC-DA\gbda_aut.dll"
```

Then start `OpcEnum` (`Start-Service OpcEnum`) and, if needed, run the wrapper script.

---

## 6. Step 4 — Point Telegraf at your OPC DA server

### 6.1 The only file to edit for server/tags

Edit the **runtime copy**:

```text
C:/ProgramData/Telegraf/OPC-DA/opcda.conf
```

`opcda.conf` is the single source of truth for the OPC server and tag list. All seven
`opcda_to_*.conf` files point at that path, so you do **not** edit the server or tags
in each pipeline.

```toml
[[inputs.opcda]]
  name = "opcda_source"                 # only used when running opcda.exe standalone
  server = "Your.Server.ProgID"         # exact OPC DA ProgID
  nodes = ["localhost"]                 # or ["192.168.1.50"] for a remote server
  items = [
    { item = "Plant.Line1.Temperature", name = "L1_Temp" },
    { item = "Plant.Line1.Pressure",    name = "L1_Press",
      tags = [["line", "1"], ["unit", "bar"]] },
  ]
```

- `item` = OPC ItemID (case and spaces matter).
- `name` = field name in the output; optional, defaults to the ItemID. Keep names
  unique — duplicate names collide in the wide layout.
- `tags` = optional extra tags added to every metric produced by that item.
- To change only some tags, keep the rest of the list. The shipped list is the 45
  simulator tags used for the live tests.

**Editing workflow:** either edit the ProgramData copy directly, or edit the copy in
this repo and delete `C:/ProgramData/Telegraf/OPC-DA/opcda.conf` before launching —
the `.bat` files copy the repo file only when the runtime file is **missing**, so a
stale runtime copy silently wins.

`opcda.exe` reads its config at startup: **restart Telegraf** after editing
`opcda.conf`. execd does not reload the file on its own.

### 6.2 What to change per destination

Server/tag changes stop at `opcda.conf`; destination settings live in each
`opcda_to_*.conf`:

| Config | Change before first use | Health port | Log |
| --- | --- | --- | --- |
| `opcda_to_csv.conf` | both `files = [...]` paths (and `CSV_DIR` in the `.bat`) | 8290 | `telegraf-opcda-csv.log` |
| `opcda_to_sqlite.conf` | both `data_source_name` paths; output folder must exist | 8296 | `telegraf-opcda-sqlite.log` |
| `opcda_to_mysql.conf` | both DSNs (or `${MYSQL_DSN}`) + database/table permissions | 8294 | `telegraf-opcda-mysql.log` |
| `opcda_to_mssql.conf` | both DSNs (or `${MSSQL_DSN}`) | 8293 | `telegraf-opcda-mssql.log` |
| `opcda_to_postgres.conf` | both DSNs (or `${POSTGRES_DSN}`) | 8295 | `telegraf-opcda-postgres.log` |
| `opcda_to_influxdb.conf` | `urls`, `token`, `organization`, `bucket` (or `${INFLUX_*}`) | 8291 | `telegraf-opcda-influxdb.log` |
| `opcda_to_mqtt.conf` | `servers`, `topic`, optional credentials/TLS | 8292 | `telegraf-opcda-mqtt.log` |
| `opcda_multi_server.conf` | reference only: uncomment server 2 block (section 10) | 8297 | `telegraf-opcda-multi.log` |

Secrets are literal `CHANGE_ME` placeholders with commented `${VAR}` alternatives.
Set variables with, for example:

```powershell
[Environment]::SetEnvironmentVariable("MYSQL_DSN", "telegraf:secret@tcp(127.0.0.1:3306)/telegraf", "User")
```

Telegraf expands `${VAR}` from its own process environment; the **service** account
needs the variables set at machine level (or in the service environment), not just in
your interactive session.

No `.bat` edit is needed to change servers — only the output path/settings, and only
if you keep the default `C:/Users/Parrot/Desktop/OPCDA_Outputs` location.

---

## 7. Step 5 — Test the setup

Test in this order; each step isolates one layer.

### 7.1 Verify the OPC server itself

In MatrikonOPC Explorer (or the vendor client), connect to the ProgID, add items and
confirm live values. This proves the COM/DCOM layer before Telegraf is involved.

### 7.2 Verify `opcda.exe` alone

Open a normal Command Prompt or PowerShell window and run:

```powershell
cd C:/ProgramData/Telegraf/OPC-DA
.\opcda.exe -config opcda.conf -poll_interval 1s
```

Expected output within a second or two (one line per tag per poll):

```text
2026/11/24 19:32:59 I! Connecting to Matrikon.OPC.Simulation.1[localhost]
opcda_source BB_UInt2=0i 1795548780000000000
opcda_source BB_Real4=0 1795548780000000000
opcda_source BB_String="" 1795548780000000000
```

Press `Ctrl+C` to stop. If you see `Connecting to …` and then
`Err: RunInput error: failed to start input: TryConnect was not successful:
Connection failed`, the server/ProgID/node/DCOM layer is wrong — fix that before
Telegraf. Launch it in a real console: a detached process with closed stdin can exit
immediately, which looks like a silent failure.

### 7.3 Check every Telegraf config

```powershell
"%LOCALAPPDATA%\Telegraf\telegraf.exe" config check --config .\opcda_to_csv.conf
```

Use the same command for every `opcda_to_*.conf` and for
`opcda_multi_server.conf`. All shipped configs pass. You may see two harmless
warnings (strict env handling, future `skip_processors_after_aggregators` default);
they are about future Telegraf defaults, not errors.

### 7.4 A short live run

Double-click `opcda_to_csv.bat` (or run
`telegraf --config .\opcda_to_csv.conf`), wait ~10 seconds, then press `Ctrl+C`.
Check:

- `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_wide_<stamp>.csv` (one row/second, one
  column per tag),
- `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_narrow_<stamp>.csv` (one row per tag),
- `C:/ProgramData/Telegraf/telegraf-opcda-csv.log`.

If you run `telegraf --config` directly (without the `.bat` launcher), `OPCDA_CSV_STAMP`
is unset and the files are named `opcda_wide_nostamp.csv` / `opcda_narrow_nostamp.csv`.

CSV header example:

```text
timestamp,measurement,id,name,value
1795524886,opcda_narrow,OPCDA_narrow,Sqr_UInt2,0
```

With the default column set, the CSV serializer writes `timestamp` and `measurement`
first.

For SQLite, open `C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_data.db` and check the
`opcda_wide` / `opcda_narrow` tables. For MQTT:

```powershell
mosquitto_sub -h 127.0.0.1 -t "plant/opcda/json" -v
mosquitto_sub -h 127.0.0.1 -t "plant/opcda/raw/#" -v   # after enabling RAW mode
```

Check the health endpoint too:

```powershell
Invoke-WebRequest http://127.0.0.1:8290/health -UseBasicParsing | Select-Object -Expand Content
# OK
```

Do **not** use `telegraf --test` to test these configs: with `[[inputs.execd]]` it
starts the external process and keeps running without printing a batch (verified on
1.40.3). Use a real short run instead.

---

## 8. Running the pipelines

| Config | Launcher | Destination | Layout |
| --- | --- | --- | --- |
| `opcda_to_csv.conf` | `opcda_to_csv.bat` | rotating CSV | wide + narrow |
| `opcda_to_sqlite.conf` | `opcda_to_sqlite.bat` | SQLite (`opcda_data.db`) | wide + narrow |
| `opcda_to_mysql.conf` | `opcda_to_mysql.bat` | MySQL | wide + narrow |
| `opcda_to_mssql.conf` | `opcda_to_mssql.bat` | SQL Server | wide + narrow |
| `opcda_to_postgres.conf` | `opcda_to_postgres.bat` | PostgreSQL | wide + narrow |
| `opcda_to_influxdb.conf` | `opcda_to_influxdb.bat` | InfluxDB v2 | wide + narrow |
| `opcda_to_mqtt.conf` | `opcda_to_mqtt.bat` | MQTT (JSON active, RAW alternative) | one message/poll |
| `opcda_multi_server.conf` | `telegraf --config` (no `.bat`) | CSV (one file, `server` column) | narrow |

Each `.bat` launcher:

1. `cd`s to its own folder.
2. Creates `%ProgramData%\Telegraf\OPC-DA` if missing and copies `opcda.conf` there
   **only if it is absent**.
3. Creates the CSV output folder (CSV launcher only).
4. Fails with a clear message if `opcda.exe` is missing.
5. Finds Telegraf in `%LOCALAPPDATA%\Telegraf` or PATH.
6. Runs `telegraf --config <matching conf>`; pass `check` as the first argument to run
   `telegraf config check` instead of the daemon.
7. Stamps the CSV filenames with the run start time (`OPCDA_CSV_STAMP`) and pauses on
   exit so you can read the error.

Notes:

- Each pipeline starts **its own** `opcda.exe`. Running CSV and MQTT side by side
  polls the OPC server twice — fine for a simulator, but size the plant server load
  accordingly.
- Do not run two configs that use the same health port, output file or database table
  at the same time.
- Logs are written to `C:/ProgramData/Telegraf/telegraf-opcda-<destination>.log`.
- For unattended operation, run Telegraf as a Windows service (or Scheduled Task at
  startup) and make sure the account can read `C:/ProgramData/Telegraf/OPC-DA`, write
  the outputs and use the OPC/DCOM registration.

---

## 9. Data layouts, MQTT and Fusion Automate

### 9.1 Wide and narrow

Each CSV/SQL logger writes **two complementary layouts** (not duplicates), matching
the OPC UA / Modbus reference projects:

| Layout | Measurement / table | Shape |
| --- | --- | --- |
| Wide | `opcda_wide` | one row per second, one column per item |
| Narrow | `opcda_narrow` | one row per item: `id`, `name`, `value` |

To log only one layout, comment out the corresponding `[[outputs.*]]` block. The wide
path clones the input metrics, clears their tags, renames them to `opcda_wide` and
merges one second with `aggregators.merge`; the narrow path keeps one metric per field.

### 9.2 MQTT payloads

`opcda_to_mqtt.conf` contains two output blocks; exactly one is active:

- **JSON (default)** — `layout = "batch"`, `data_format = "json"`, topic
  `plant/opcda/json`. One message per poll, wrapped in a `metrics` array with one
  entry per tag:

  ```json
  {
    "metrics": [
      {"fields":{"BB_Boolean":false},"name":"opcda_raw","tags":{},"timestamp":1795548780},
      {"fields":{"BB_UInt2":0},"name":"opcda_raw","tags":{},"timestamp":1795548780}
    ]
  }
  ```

  Consumers iterate `metrics[]`, read `fields` (one tag per entry) and `name`/`tags`
  as needed.

- **RAW (alternative)** — `layout = "field"`, topic `plant/opcda/raw/<field>`, one
  scalar message per tag (commented by default).

Switch modes by commenting/uncommenting the two blocks. QoS 1, no retain, client ID
random unless you set `client_id`; credentials and TLS lines are commented
placeholders.

### 9.3 Fusion Automate / MQTT SCADA

MQTT is the integration hand-off: point Fusion Automate (FusionAutomate), Node-RED,
FUXA, Ignition, Grafana or any MQTT dashboard at the broker and subscribe to
`plant/opcda/json` (or one
topic per server — see section 10). Every entry in the JSON `metrics` array already
carries one tag name/value (plus `name`, `tags` and `timestamp`), so no Telegraf-side
mapping is needed. Keep `CHANGE_ME` credentials out of
the file: set `MQTT_USERNAME` / `MQTT_PASSWORD` (and the TLS variables) in the
Telegraf service environment.

---

## 10. Multiple OPC DA servers

### 10.1 Why one process per server

The external plugin reads its config with the Telegraf **shim**, which decodes only
`primitives[0]` of each plugin table. A second `[[inputs.opcda]]` block in the same
`opcda.conf` is silently ignored — no warning, just no data. Verified 2026-11-24 with
a two-block config: only the first block's measurement and tags appeared.

`nodes = [...]` is **not** multi-server either: it is a fallback list and the first
node that connects wins.

Therefore: **N OPC DA servers = N `opcda.exe` processes**, each with its own
external-plugin config file, wired into Telegraf as N `[[inputs.execd]]` blocks with
unique `name_override` values.

### 10.2 The reference config

`opcda_multi_server.conf` is the working sample. By default
it runs **server 1 only** (the shipped `opcda.conf`). The MULTI-SERVER EXAMPLE block
for server 2 is commented out; enable it when needed. The example lives in this one
reference file rather than being duplicated into every pipeline — copy the pattern into
whichever `opcda_to_*.conf` you standardise on:

1. Copy the plugin config and edit the copy:

   ```powershell
   copy "C:\ProgramData\Telegraf\OPC-DA\opcda.conf" "C:\ProgramData\Telegraf\OPC-DA\opcda_server2.conf"
   notepad "C:\ProgramData\Telegraf\OPC-DA\opcda_server2.conf"
   ```

   Change `server`, `nodes` and `items` to the second server and its tags.
2. Open `opcda_multi_server.conf` and uncomment the `[[inputs.execd]]` block labelled
   SERVER 2. Its `name_override = "opcda_server2"` must stay unique.
3. Create the output folder if it is missing:

   ```powershell
   New-Item -ItemType Directory -Force -Path "C:/Users/Parrot/Desktop/OPCDA_Outputs" | Out-Null
   ```

4. Validate and run:

   ```powershell
   telegraf config check --config .\opcda_multi_server.conf
   telegraf --config .\opcda_multi_server.conf
   ```

5. Confirm the CSV (`C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_multi.csv`) contains
   rows tagged with both servers:

   ```text
   timestamp,measurement,id,name,server,value
   ...,opcda_narrow,OPCDA_narrow,Tri_Real8_s2,opcda_server2,72.25663174395999
   ```

The processors and the output in the sample are **generic**: they derive the `server`
tag from `name_override` and rename every metric to `opcda_narrow`. Adding server 3
means creating `opcda_server3.conf`, copying the commented block, giving it a unique
`name_override` and pointing `-config` at the new file — no processor or output change.
(If you later add a non-OPC input to this file, add
`namepass = ["opcda_server1", ...]` to both starlark processors so it is not
converted.)

Validated live with two execd inputs: one wrote 720 rows from the 45-tag config, the
other 36 rows from a 3-tag config, both into the same CSV with distinct `server`
values. (The test used the same Matrikon simulator under two configs; a second
physical server follows the identical pattern.)

### 10.3 Failure isolation

Because each server has its own process, a dead server does not stop the others. Tested
with a valid server 1 and a non-existent ProgID for server 2:

```text
[inputs.execd] stderr: "Connecting to No.Such.OPC.Server.1[localhost]"
[inputs.execd] stderr: "Err: RunInput error: failed to start input: TryConnect was not successful: Connection failed"
[inputs.execd] Process ... exited: exit status 1
[inputs.execd] Restarting in 10s...
```

Server 1 kept writing (765 rows in the same window); server 2 retried every
`restart_delay = "10s"`, so it reconnects on its own once the server is back.

### 10.4 Routing each server separately

The `server` tag is available after processing, so per-server outputs are a filter:

```toml
[[outputs.file]]
  namepass = ["opcda_narrow"]
  tagpass = { server = ["opcda_server1"] }
  files = ["C:/Users/Parrot/Desktop/OPCDA_Outputs/opcda_server1.csv"]
  data_format = "csv"
  csv_header = true
```

Use the same `tagpass` for a per-server `[[outputs.mqtt]]` topic, SQL table or InfluxDB
bucket. Alternatively run one Telegraf instance per server (one `.conf` each, unique
health ports) when you need fully separate failure domains and restarts.

---

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `Telegraf was not found` | not installed, or PATH not refreshed | run `install-telegraf.ps1`, open a new terminal; the launcher also checks `%LOCALAPPDATA%\Telegraf` |
| `OPC DA external plugin not found` | no `opcda.exe` in ProgramData | run `setup_opcda.ps1`, or copy the bundled exe there |
| `TryConnect was not successful: Connection failed` | server not running, wrong ProgID/node, DCOM or bitness | start the server, verify ProgID in OPC Explorer, `dcomcnfg.exe`, check 32/64-bit match |
| `No such interface supported` while adding items | `OPC.Automation.1` points at a broken/missing wrapper | run `setup_opcda_wrapper.ps1`; install Matrikon/OPC Core Components wrapper |
| `Class not registered` / `0x80040154` | wrapper not registered for the exe bitness | `regsvr32` the matching DLL (SysWOW64 for 32-bit, System32 for 64-bit), rerun setup |
| `OPC.Automation.1 points to a missing DLL` | stale registration from an uninstalled product | `setup_opcda_wrapper.ps1`, or repair OPC Core Components |
| Only the first server's tags appear | second `[[inputs.opcda]]` block in one `opcda.conf` | one exe per server; use `opcda_multi_server.conf` |
| Some tags never appear | quality is not Good, or unsupported VARIANT (array, Money, Time, Qualities) | verify in OPC Explorer; restrict the item list to scalar tags |
| All values zero / empty strings | simulator items idle or server returns Bad | add/read the tag in OPC Explorer first |
| No new CSV rows | output folder missing/no permission, Telegraf stopped, time-window aggregation | create the folder, read the Telegraf log, keep the starlark time normalization |
| Timestamps offset by hours | OPC server clock/timezone differs from the Telegraf host | the shipped starlark processor already resets to the agent clock — do not remove it |
| `bind: Only one usage of each socket address` | two configs share a health port | stop the other config or give each a unique port |
| `config check` warnings | future Telegraf default changes | harmless; optionally set explicit flags |
| Console works, Windows service gets no data | HKCU wrapper redirect invisible to the service; output ACL; DCOM identity | fix machine-wide registration, run the service under a user with the redirect, grant folder access |
| Remote server works in OPC Explorer but not Telegraf | the service/interactive account difference in DCOM | configure DCOM launch/access for the Telegraf account |
| `opcda.exe` exits immediately with no output | launched detached with closed stdin (e.g. `Start-Process -RedirectStandardOutput`) | run it in a normal console; let Telegraf execd own it |
| CSV/SQLite points at `C:/Users/Parrot/...` | default demo paths | edit the output paths (and `CSV_DIR` in the CSV `.bat`) |

Logs are the first place to look:
`C:/ProgramData/Telegraf/telegraf-opcda-<destination>.log`. `opcda.exe` stderr is
prefixed `[inputs.execd] stderr:` in that log.

---

## 12. Research notes and hard-won details

These are the non-obvious behaviours that shaped the configs; keep them in mind when
adapting the files.

1. **One input block only.** The Telegraf shim used by `opcda.exe` decodes the first
   primitive of each plugin type. Extra `[[inputs.opcda]]` blocks are ignored without
   an error. Multi-server = multiple processes (section 10).
2. **OPC timestamps are not local time.** On this machine the Matrikon server reported
   timestamps 5h30m ahead. The wide `aggregators.merge` then discarded everything as
   outside its 1-second window. Every config therefore starts with a
   `processors.starlark` block that sets `metric.time` to the Telegraf clock. Removing
   it breaks the wide layout (and skews timestamps).
3. **45 of 55 simulator tags.** The plugin's read loop aborts on some VARIANT types
   (`ArrayOfReal8`, `ArrayOfString`, `Money`, `Time`, `Qualities`). The shipped list
   deliberately excludes them. Start from the working list and add tags incrementally,
   testing with `opcda.exe` alone.
4. **Quality filter.** The plugin only calls `AddFields` for `OPCQualityGood` items. A
   tag that is briefly Bad disappears for that poll; it is not an error reported by
   Telegraf.
5. **`--test` is not a test for execd.** It keeps the external process running and
   prints nothing useful. Use `config check` + a short real run.
6. **Standalone stdin.** `opcda.exe` runs until its stdin closes or it is interrupted.
   A detached launch with no stdin exits at once; run it from a console for the
   standalone test.
7. **The `.bat` copy rule.** The launchers copy `opcda.conf` only when the ProgramData
   copy is missing. Edit the runtime copy (preferred) or delete it before relaunching
   after editing the repo copy.
8. **The wrapper fix is per-user.** `setup_opcda_wrapper.ps1` writes HKCU. Services and
   other users do not see it.
9. **Each pipeline polls independently.** Every `.bat` starts a new `opcda.exe`; two
   pipelines = two OPC subscriptions. That is intended for one-destination-per-config,
   but avoid running all seven at once against a production server.
10. **All paths are absolute.** The Telegraf configs reference
    `C:/ProgramData/Telegraf/OPC-DA/...` literally. If you move the runtime, update
    the `command` in every `[[inputs.execd]]`.
11. **CSV always has a measurement column.** The Telegraf CSV serializer writes
    `timestamp,measurement,...` before tags/fields. This is why the multi-server
    sample can use one file and distinguish servers with the `server` tag.
12. **Windows-only.** OPC DA relies on COM/DCOM; the login account, bitness and
    registration matter more than any Telegraf setting.
13. **The float converter drops string tags.** The single-server narrow path in
    `opcda_to_*.conf` includes `processors.converter` with `float = ["value"]`; OPC
    string items fail that conversion every second and are discarded. The multi-server
    sample omits the converter on purpose. Remove it (or keep strings on a separate
    path) if you need textual tags.

---

## 13. Security

- Never commit real passwords, tokens or DSNs. The configs use `CHANGE_ME` and
  commented `${VAR}` alternatives; put real values in the machine/service environment.
- Use read-only OPC access and least-privilege database users. The plugin only reads
  tags (no writes), but the account can still read the whole namespace it is granted.
- MQTT: enable authentication and TLS (`ssl://`, `tls_ca`/`tls_cert`/`tls_key`) for
  anything beyond a lab broker.
- Restrict write access to the CSV/SQLite output folder.
- Treat OPC wrapper DLLs as privileged code: register only the bundled Graybox or the
  vendor-supplied wrapper.
- For remote OPC, configure DCOM narrowly (specific user, launch/access only) instead
  of widening machine-wide permissions.

---

## 14. References

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
