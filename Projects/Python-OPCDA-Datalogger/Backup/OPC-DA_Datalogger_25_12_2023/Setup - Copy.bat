@echo off

set PYTHON27_URL=https://www.python.org/ftp/python/2.7.18/python-2.7.18.msi
set PYTHON27_INSTALLER=python-2.7.18.msi

set PYTHON36_URL=https://www.python.org/ftp/python/3.6.7/python-3.6.7.exe
set PYTHON36_INSTALLER=python-3.6.7.exe

set PYWIN32_PY27_URL=https://github.com/mhammond/pywin32/releases/download/b228/pywin32-228.win32-py2.7.exe
set PYWIN32_PY27_INSTALLER=pywin32-228.win32-py2.7.exe

set PYWIN32_PY36_URL=https://github.com/mhammond/pywin32/releases/download/b228/pywin32-228.win32-py3.6.exe
set PYWIN32_PY36_INSTALLER=pywin32-228.win32-py3.6.exe

set OPENOPC_PY27_URL=https://downloads.sourceforge.net/project/openopc/openopc/1.3.1/OpenOPC-1.3.1.win32-py2.7.exe
set OPENOPC_PY27_INSTALLER=openopc-1.3.1.win32-py2.7.exe

echo Downloading Python 2.7.18...
curl -O %PYTHON27_URL% -L

echo Installing Python 2.7.18...
start /wait msiexec /i %PYTHON27_INSTALLER% /qn /norestart

echo Downloading Python 3.6.7...
curl -O %PYTHON36_URL% -L

echo Installing Python 3.6.7...
start /wait %PYTHON36_INSTALLER% /quiet /norestart

echo Downloading pywin32 for Python 2.7...
curl -O %PYWIN32_PY27_URL% -L

echo Installing pywin32 for Python 2.7...
start /wait %PYWIN32_PY27_INSTALLER% /quiet /norestart

echo Downloading pywin32 for Python 3.6...
curl -O %PYWIN32_PY36_URL% -L

echo Installing pywin32 for Python 3.6...
start /wait %PYWIN32_PY36_INSTALLER% /quiet /norestart

echo Downloading OpenOPC for Python 2.7...
curl -o %OPENOPC_PY27_INSTALLER% -L %OPENOPC_PY27_URL%

echo Installing OpenOPC for Python 2.7...
start /wait %OPENOPC_PY27_INSTALLER% /quiet /norestart

echo Installing pandas, pyodbc, OpenOPC-Python3x, pyqt5...
python -m pip install pandas pyodbc OpenOPC-Python3x pyqt5 sqlalchemy

echo Installation complete.
pause
