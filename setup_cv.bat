@echo off
echo [SafeRide] Setting up Computer Vision Environment...

:: 1. Check/Install uv
where uv >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] 'uv' tool not found. Installing via pip...
    pip install uv
    if %errorlevel% neq 0 (
        echo [X] Failed to install uv. Please install Python and Pip first.
        pause
        exit /b 1
    )
)

:: 2. Create Venv (Python 3.10)
echo [+] Creating Virtual Environment (Python 3.10)...
uv venv cv\.venv --python 3.10

:: 3. Install Requirements
echo [+] Installing Dependencies...
uv pip install -p cv\.venv\Scripts\python.exe -r cv\requirements.txt

echo.
echo [SUCCESS] Environment Setup Complete!
echo You can now run: run_cv.bat
pause
