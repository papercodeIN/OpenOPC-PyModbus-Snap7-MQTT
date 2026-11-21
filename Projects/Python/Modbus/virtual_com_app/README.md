# Virtual COM Port Lab

A small FastAPI web app that creates and removes **real paired virtual COM
ports** on Windows using the free [com0com](https://sourceforge.net/projects/com0com/)
null-modem driver.

```
Application A (COM2)  ⇄  null-modem link  ⇄  Application B (COM1)
```

Create as many independent pairs as you need — COM1↔COM2, COM3↔COM4, and so on.
Bytes written to one port appear on the other, so any normal Windows program
can use the link as if a physical null-modem cable were connected.

**Scope:** This project only creates/removes pairs. It deliberately contains
**no Modbus simulator and no test client** — connect your own software to either
port. The separate `modbus_app` project in this repository provides the Modbus
simulator.

## Run

```bat
run.bat
```

`run.bat` self-elevates (one UAC prompt) because creating COM ports and
installing a driver require administrator rights. It then starts the server at
**http://127.0.0.1:8090**.

## Automatic driver install

Windows cannot create COM ports without a kernel driver. The signed, SHA-256
verified com0com package is bundled in `vendor/com0com/`:

- `Setup_com0com_v3.0.0.0_W7_x64_signed.exe`
- `Setup_com0com_v3.0.0.0_W7_x86_signed.exe`
- `com0com.inf`, `cncport.inf`, `comport.inf` (required by the installer)

On first launch the app verifies the checksum and runs the installer silently
with `/S`. Since `run.bat` starts elevated, there is no extra prompt. If needed,
use **Install / retry driver** under **Setup & About**. Set
`backend.auto_install = false` in `data/settings.json` to disable this.

## Known problem: Error 52 / "Port not available"

On some Windows 11/10 machines — especially with **Secure Boot**, **VBS** or
**Memory Integrity (Core isolation / HVCI)** enabled — Microsoft blocks the
2017 cross-signed com0com driver with **Code 52**. The pair is then listed in
the UI but Windows reports the device as failed and applications say the COM
port is "not available".

This is **not** the app holding the port. Verify in Device Manager: `com0com -
bus for serial port pair emulator 0` → error code 52.

### Why there is no "temporary" toggle

Memory Integrity is a **boot-time kernel setting**. It can only be changed via
the registry **plus a restart**. Windows does not allow toggling it live per
application, so it cannot be enabled automatically on app exit. Any claim of a
session-only toggle would be false.

### Explicit opt-in button

**Setup & About → Memory Integrity compatibility** provides:

- current status of the setting,
- a mandatory confirmation checkbox and a second confirmation dialog,
- **Disable Memory Integrity** — writes
  `HKLM\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity\Enabled = 0`
  (admin required), then asks you to restart,
- **Re-enable Memory Integrity** — sets it back to `1` (restart required).

The app never calls this automatically. Disabling it lowers protection for
**every program on the PC**, so it is opt-in only. After disabling and
restarting, click **Install / retry driver** and recreate the pair.

Alternative without weakening security: use a virtual COM driver with a current
Microsoft attestation/WHQL signature — no setting change or reboot needed.

## UI

- **Overview** — driver status, pair count, active pairs.
- **Port Pairs** — pick two ports and create a pair; remove pairs.
- **Setup & About** — bundled installer, Memory Integrity opt-in, architecture.

Pairs are persisted in `data/pairs.json` and restored on restart. Pair creation
and removal require administrator rights; the app shows a clear message if it
is not elevated.

## Files

| File | Purpose |
|------|---------|
| `main.py` | FastAPI app, REST API, WebSocket |
| `manager.py` | Pair lifecycle and persistence |
| `com_ports.py` | com0com detection, `setupc.exe` wrapper (runs from its own folder so `com0com.inf` is found) |
| `installer.py` | Bundled, checksum-verified silent install + Memory Integrity opt-in |
| `models.py` / `config.py` | Request models, JSON settings/persistence |
| `templates/` / `static/` | Web UI (theme shared with the MQTT Control Room project) |
| `vendor/com0com/` | Unmodified signed com0com package (GPL) |
| `data/` | Runtime settings and `pairs.json` |

## Requirements

```
fastapi>=0.110
uvicorn>=0.27
pyserial>=3.5
jinja2>=3.1
pydantic>=2.0
```
