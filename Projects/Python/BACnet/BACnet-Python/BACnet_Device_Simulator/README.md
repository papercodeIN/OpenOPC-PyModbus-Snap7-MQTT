# BACnet Device Simulator

A BACnet/IP device simulator for controlled laboratory, integration, regression, and training environments. Version 2.0 preserves the original BACnet object model and brightened dashboard while adding safer configuration handling, lifecycle coordination, health endpoints, and optional bearer-token protection for the web control plane.

> **Operational boundary:** This is a simulator, not a safety-certified BACnet controller. BACnet/IP itself is unauthenticated and unencrypted. Do not expose it to an untrusted network or use it as a live building-control device.

## Capabilities

| Feature | Availability |
| :--- | :---: |
| **Web UI Dashboard** (Live values & sparklines) | ✅ |
| **Web UI Point Editor** (Add, edit, remove points via browser) | ✅ |
| **Web UI Device Settings** (Device ID, bind address, port) | ✅ |
| **Traffic Inspection** (Real-time client request/write logs) | ✅ |
| **Live Value Simulation** (Bounded random walk for sensors) | ✅ |
| **Commandable Priority Arrays** (BACnet priority & relinquish default) | ✅ |
| **Live Stream Updates** (Server-Sent Events with browser reconnect) | ✅ |
| **Headless Script Mode** (CLI-driven without web dependencies) | ✅ |
| **Strict Config Validation** (Hosts, ports, ranges, states, finite values) | ✅ |
| **Atomic Config Persistence** (Temp-file write + `.bak` recovery copy) | ✅ |
| **Lifecycle Locking & Rollback** (Serialized start/stop/restart, revert on failure) | ✅ |
| **Health & Readiness Endpoints** (`/healthz`, `/readyz`) | ✅ |
| **Security Headers & Request Limits** (Hardened responses, bounded JSON bodies) | ✅ |
| **Graceful Shutdown** (Clean BACnet socket and task teardown) | ✅ |
| **Simulation Error Reporting** (Runtime error counters in `/api/state`) | ✅ |
| **Bearer-Token API Protection** (Optional, via `BACNET_SIM_ADMIN_TOKEN`) | ✅ |
| **Automated Tests & Packaging** (pytest suite, `pyproject.toml`) | ✅ |
| **Web UI Login / User Accounts** (Password login, sessions, per-user roles) | ❌ |
| **BBMD / Foreign Device Support** (Cross-subnet BACnet routing) | ❌ |
| **Encrypted BACnet Transport** (BACnet/SC) | ❌ |

## Quick start

Requires Python 3.10 or newer.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .
$env:BACNET_SIM_ADMIN_TOKEN = "replace-with-a-long-random-token"
python -m bacnet_sim --host 127.0.0.1 --port 8000
```

Open <http://127.0.0.1:8000>. When `BACNET_SIM_ADMIN_TOKEN` is set, use the same value as a bearer token for API/UI requests. For local-only development, leaving the variable unset keeps the original browser workflow.

The BACnet device defaults to `127.0.0.1:47809`. Use the Device tab or a controlled deployment configuration to deliberately select a LAN bind address. If you bind to a LAN address, apply firewall rules and isolate the simulator network.

## Supported BACnet scope

The simulator provides BACnet/IP device identity, Who-Is/I-Am discovery through BAC0, standard object reads, commandable writes for configured Value/Output objects, priority arrays and relinquish behavior, engineering units, descriptions, binary values, multistate text, and configurable simulation. BBMD/Foreign Device routing and safety certification are outside the current scope.

## Production-style deployment checklist

1. Bind the web UI to loopback or place it behind an authenticated TLS reverse proxy.
2. Set a strong `BACNET_SIM_ADMIN_TOKEN` through the service environment, never in source control.
3. Bind BACnet only to the required interface and allow only approved UDP peers/firewall rules.
4. Keep `config.json` and its `.bak` backup in a protected service data directory.
5. Run one simulator process per BACnet UDP binding; do not use multiple workers for one device.
6. Monitor `/healthz`, `/readyz`, logs, and the runtime error counters shown by `/api/state`.
7. Back up configuration before upgrades and verify the BACnet client integration after changes.

## Headless mode

```powershell
python bacnet_device_simulator_16112026.py --ip 127.0.0.1 --port 47809 --device-id 1001
```

This mode does not expose a web control plane and is useful for repeatable integration runs. Use `--seed` for deterministic simulation sequences.

## Verification

```powershell
python -m pytest
python -m ruff check bacnet_sim bacnet_device_simulator_16112026.py tests
python -m py_compile bacnet_sim/*.py bacnet_device_simulator_16112026.py
```

The simulator is considered ready for a production-like lab deployment only after the target BACnet client, firewall, backup, and rollback procedures have been tested in the intended environment.
