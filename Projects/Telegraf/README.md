# ⚡ Telegraf 2-Point Data Collection 📊

Welcome! 🚀 This guide helps newcomers collect **2-point industrial data** (such as 2 sensor values or Modbus registers) quickly and easily using [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) on Windows.

---

## 🛠️ Requirements
- **Windows 10 / 11** (64-bit) 🖥️
- **PowerShell** (pre-installed) ⚡

---

## 📥 1. Install Telegraf (One Command)
Open PowerShell in this folder and run:

```powershell
powershell -ExecutionPolicy Bypass -File ".\install-telegraf.ps1"
```

Verify the installation in a **new** terminal:
```powershell
telegraf --version
```

---

## 🚀 2. Quick Start: Read 2 Data Points
This project is configured to read **2 data points** (`HR_0` and `HR_1`) from a Modbus TCP server (e.g., local simulator on `127.0.0.1:502`).

Test a single collection cycle (reads data, writes nothing to disk):

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf" --test
```

### What you will see:
```text
> modbus,name=Device HR_0=42,HR_1=100 1716200000000000000
```
*(Only your 2 data points are collected!)*

---

## 🏃 3. Run Continuously & Save to CSV
To run continuously and save your 2 data points to a daily-rotating CSV file, remove `--test`:

```powershell
telegraf --config ".\Modbus\Modbus TCP Outputs\modbus_tcp.conf"
```

---

## 📁 4. Files & Structure
- [`install-telegraf.ps1`](install-telegraf.ps1) — One-command installer
- [`Modbus/Modbus TCP Outputs/modbus_tcp.conf`](Modbus/Modbus%20TCP%20Outputs/modbus_tcp.conf) — Configured for 2-point Modbus TCP reading

---

## 📚 Reference
- [Telegraf Documentation](https://docs.influxdata.com/telegraf/v1/)
- [Modbus Input Plugin](https://docs.influxdata.com/telegraf/v1/input-plugins/modbus/)
