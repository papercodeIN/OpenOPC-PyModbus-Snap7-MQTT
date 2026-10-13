BACnet to CSV/Data Logger

Overview

This repository contains simple PyQt5 GUI applications that connect to BACnet devices using the BAC0 library and log selected points to CSV, SQLite, or MySQL.

Included scripts

- `BACnet_to_CSV_Data_Logging_V1.0.py` — GUI app to select BACnet points and log them to a daily CSV file.
- `BACnet_to_MySQL_Data_Logging_V1.0.py` — GUI app to log a selected BACnet point into a MySQL database (via SQLAlchemy).
- `Development/test1.py`, `Development/test2.py` — experimental variants with CSV/SQLite options and UI changes.

Quick start

1. Create and activate a Python 3.11 virtual environment.

2. Install dependencies:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1; python -m pip install -r requirements.txt
```

3. Run the CSV logger:

```powershell
python .\BACnet_to_CSV_Data_Logging_V1.0.py
```

Notes and recommendations

- These scripts assume a working BACnet network and that `BAC0.connect()` discovers devices. If discovery fails, the app exits.
- Several UI and runtime robustness improvements are suggested in the review (see the `REVIEW.md` or the project issues).
- Use the `Development` files for reference; they contain more feature experiments (SQLite logging, radio buttons, improved layouts).

Security

- Do not commit plaintext database credentials. Use environment variables or a configuration file with restricted permissions.

License

- Add an appropriate license file if you plan to share this repository publicly.
