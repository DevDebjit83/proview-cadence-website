@echo off
REM ProView Cadence Launch Script for Windows
REM This script starts a local web server for development

echo.
echo ========================================
echo   ProView Cadence - Launching Website
echo ========================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Python detected
    echo [INFO] Starting server on http://localhost:8080
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    python -m http.server 8080
    goto :end
)

REM Check if Node.js is available
npx --version >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Node.js detected
    echo [INFO] Starting server on http://localhost:8080
    echo [INFO] Press Ctrl+C to stop the server
    echo.
    npx live-server --port=8080
    goto :end
)

echo [ERROR] No suitable server found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
echo Or open index.html directly in your web browser
echo.
pause

:end
