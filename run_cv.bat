@echo off
setlocal enabledelayedexpansion
echo Starting SafeRide CV Agent (Project Hawkeye)...
if not exist "cv\.venv" (
    echo Creating Virtual Environment...
    :: Find a supported Python version (3.10 or 3.11)
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
    uv venv cv\.venv --python !PYTHON_VER!
    uv pip install -p cv\.venv\Scripts\python.exe -r cv\requirements.txt
)

call cv\.venv\Scripts\activate
python cv\main.py
pause

