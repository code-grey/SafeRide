#!/bin/bash
# Mac/Linux Helper to run Project Hawkeye
if [ ! -d "cv/.venv" ]; then
    echo "Creating Virtual Environment..."
    # Find a supported Python version (3.10 or 3.11)
    PYTHON_CMD=""
    if command -v python3.10 &> /dev/null; then
        PYTHON_CMD="python3.10"
    elif command -v python3.11 &> /dev/null; then
        PYTHON_CMD="python3.11"
    fi

    if [ -z "$PYTHON_CMD" ]; then
        echo "[X] Python 3.10 or 3.11 is required but not found."
        echo "    mediapipe does not support Python 3.13 or later."
        echo "    Please install Python 3.10 or 3.11."
        exit 1
    fi
    echo "[+] Found compatible Python: $PYTHON_CMD"
    uv venv cv/.venv --python "$PYTHON_CMD"
    uv pip install -p cv/.venv/bin/python -r cv/requirements.txt
fi

echo "Starting SafeRide CV Agent..."
source cv/.venv/bin/activate
python cv/main.py
