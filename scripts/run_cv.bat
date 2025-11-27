@echo off
echo Starting SafeRide CV Agent (Project Hawkeye)...
if not exist "cv\.venv" (
    echo Creating Virtual Environment...
    uv venv cv\.venv --python 3.10
    uv pip install -p cv\.venv\Scripts\python.exe -r cv\requirements.txt
)

call cv\.venv\Scripts\activate
python cv\main.py
pause

