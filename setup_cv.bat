@echo off
setlocal enabledelayedexpansion
echo [SafeRide] Setting up Computer Vision Environment...

:: 0. Find a supported Python version (3.10 or 3.11)
set "PYTHON_VER="
py -3.10 --version >nul 2>nul
if !errorlevel! equ 0 set "PYTHON_VER=3.10"
if not defined PYTHON_VER (
    py -3.11 --version >nul 2>nul
    if !errorlevel! equ 0 set "PYTHON_VER=3.11"
)
if not defined PYTHON_VER (
    echo [X] Python 3.10 or 3.11 is required but not found.
    echo     mediapipe does not support Python 3.13 or later.
    echo     Please install Python 3.10 or 3.11 from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [+] Found compatible Python: !PYTHON_VER!

:: 1. Check/Install uv
where uv >nul 2>nul
if !errorlevel! neq 0 (
    echo [!] 'uv' tool not found. Installing via pip...
    py -!PYTHON_VER! -m pip install uv
    if !errorlevel! neq 0 (
        echo [X] Failed to install uv. Please ensure pip is available for Python !PYTHON_VER!.
        pause
        exit /b 1
    )
)

:: 2. Create Venv using the detected Python version
echo [+] Creating Virtual Environment...
uv venv cv\.venv --python !PYTHON_VER!

:: 3. Install Requirements
echo [+] Installing Dependencies...
uv pip install -p cv\.venv\Scripts\python.exe -r cv\requirements.txt

echo.
echo [SUCCESS] Environment Setup Complete!
echo You can now run: run_cv.bat
pause
