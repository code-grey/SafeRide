#!/bin/bash
# Mac/Linux Helper to run Project Hawkeye
if [ ! -d "cv/.venv" ]; then
    echo "Creating Virtual Environment..."
    uv venv cv/.venv --python 3.10
    uv pip install -p cv/.venv/bin/python -r cv/requirements.txt
fi

echo "Starting SafeRide CV Agent..."
source cv/.venv/bin/activate
python cv/main.py
