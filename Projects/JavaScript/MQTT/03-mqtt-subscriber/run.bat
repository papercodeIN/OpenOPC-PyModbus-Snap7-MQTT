@echo off
rem ============================================================
rem  MQTT Control Room / 03 MQTT Subscriber
rem  Interactive launcher: asks for the service port, verifies the
rem  prerequisites, then starts the local web service in this window.
rem  Keep this file ASCII-only: cmd.exe reads .bat in the OEM codepage.
rem ============================================================
setlocal EnableExtensions EnableDelayedExpansion
title MQTT Control Room - Subscriber
cd /d "%~dp0"

set "APP_TITLE=03  MQTT SUBSCRIBER"
set "APP_NAME=MQTT Subscriber"
set "DEFAULT_PORT=8082"
set "ENTRY=server.js"
set "PORT_FLAG=--http-port"
set "PORT_HINT=http://127.0.0.1:PORT"

echo.
echo  ==============================================================
echo    MQTT CONTROL ROOM  /  !APP_TITLE!
echo  ==============================================================
echo    Subscribes to MQTT topics over TCP and streams them live.
echo    This launcher starts a local web service and asks you which
echo    port it should listen on.
echo.

rem --- 1. Prerequisites -----------------------------------------
where node >nul 2>nul
if errorlevel 1 goto :no_node
where npm >nul 2>nul
if errorlevel 1 goto :no_npm

for /f "delims=" %%V in ('node -p "process.versions.node"') do set "NODE_VERSION=%%V"
node -e "process.exit(Number(process.versions.node.split('.')[0]) >= 22 ? 0 : 1)"
if errorlevel 1 goto :old_node
echo   [ok] Node.js !NODE_VERSION! detected.

if not exist ".env" if exist ".env.example" (
  copy /y ".env.example" ".env" >nul
  echo   [ok] Created .env from .env.example - edit it for broker defaults.
)

if not exist "node_modules\mqtt\package.json" (
  echo   [..] Installing dependencies - first run only, this can take a minute...
  call npm install --no-audit --no-fund
  if errorlevel 1 goto :install_failed
)
echo   [ok] Dependencies present.

rem --- 2. Which port? -------------------------------------------
if "%~1"=="" goto :ask_port
echo(%~1| findstr /r /c:"^[0-9][0-9]*$" >nul
if errorlevel 1 (
  echo.
  echo   [X] "%~1" is not a valid port number.
  goto :ask_port
)
set "SERVICE_PORT=%~1"
goto :validate_port

:ask_port
echo.
echo   Which port should this service use?
echo   The page will be served at !PORT_HINT!  -  press Enter for !DEFAULT_PORT!.
echo.
set "SERVICE_PORT="
<nul set /p "=  Port [!DEFAULT_PORT!]: "
set /p "SERVICE_PORT="
if not defined SERVICE_PORT set "SERVICE_PORT=!DEFAULT_PORT!"
for /f "tokens=* delims= " %%P in ("!SERVICE_PORT!") do set "SERVICE_PORT=%%P"
echo(!SERVICE_PORT!| findstr /r /c:"^[0-9][0-9]*$" >nul
if errorlevel 1 (
  echo   [X] "!SERVICE_PORT!" is not a number. Try a port such as !DEFAULT_PORT!.
  goto :ask_port
)

:validate_port
if !SERVICE_PORT! LSS 1 goto :bad_range
if !SERVICE_PORT! GTR 65535 goto :bad_range

set "PORT_IN_USE="
for /f "tokens=*" %%L in ('netstat -ano -p tcp ^| findstr /r /c:":!SERVICE_PORT! .*LISTENING"') do set "PORT_IN_USE=1"
if not defined PORT_IN_USE goto :launch

echo.
echo   [!] Port !SERVICE_PORT! already has a listener on this machine.
choice /c YN /n /m "      Start anyway? [Y = yes, N = choose another port] "
if errorlevel 2 goto :ask_port

rem --- 3. Run ---------------------------------------------------
:launch
echo.
echo  --------------------------------------------------------------
echo    Service : !APP_NAME!
echo    URL     : http://127.0.0.1:!SERVICE_PORT!
echo    Broker  : TCP, configured in the page or in .env
echo    Stop    : press Ctrl+C in this window (or close it)
echo  --------------------------------------------------------------
echo.
set "MQTT_OPEN=1"
node !ENTRY! !PORT_FLAG! !SERVICE_PORT!
set "EXITCODE=!ERRORLEVEL!"
echo.
if not "!EXITCODE!"=="0" (
  echo   [X] The service stopped with exit code !EXITCODE!.
  echo       Read the message above. Common causes:
  echo         - the port is already used by another program
  echo         - a value in .env failed validation
  echo         - the broker refused the MQTT connection
) else (
  echo   Service stopped.
)
echo.
pause
exit /b !EXITCODE!

rem --- Error handlers -------------------------------------------
:no_node
echo.
echo   [X] Node.js was not found on PATH.
echo       Install Node.js 22 LTS or newer from https://nodejs.org/
echo       then close this window and run this file again.
echo.
pause
exit /b 1

:no_npm
echo.
echo   [X] npm was not found on PATH.
echo       npm ships with Node.js - reinstall Node.js 22 LTS or newer.
echo.
pause
exit /b 1

:old_node
echo.
echo   [X] Node.js !NODE_VERSION! is too old; this project requires 22 or newer.
echo       Install the current LTS from https://nodejs.org/ and try again.
echo.
pause
exit /b 1

:install_failed
echo.
echo   [X] npm install failed, so the service cannot start.
echo       Check your network/proxy settings, then run:  npm install
echo.
pause
exit /b 1

:bad_range
echo   [X] !SERVICE_PORT! is out of range. Use a port between 1 and 65535.
goto :ask_port
