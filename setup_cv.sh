#!/bin/bash
echo "[SafeRide] Setting up Computer Vision Environment..."

# 0. Find a supported Python version (3.10 or 3.11)
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

# 1. Check/Install uv
if ! command -v uv &> /dev/null; then
    echo "[!] 'uv' tool not found. Installing via pip..."
    $PYTHON_CMD -m pip install uv
    if [ $? -ne 0 ]; then
        echo "[X] Failed to install uv. Please ensure pip is available for $PYTHON_CMD."
        exit 1
    fi
fi

# 2. Create Venv using the detected Python version
echo "[+] Creating Virtual Environment..."
uv venv cv/.venv --python "$PYTHON_CMD"

# 3. Install Requirements
echo "[+] Installing Dependencies..."
# Detect path for python executable inside venv (Linux/Mac standard)
uv pip install -p cv/.venv/bin/python -r cv/requirements.txt

echo ""
echo "[SUCCESS] Environment Setup Complete!"
echo "You can now run: ./run_cv.sh"