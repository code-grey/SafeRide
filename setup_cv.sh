#!/bin/bash
echo "[SafeRide] Setting up Computer Vision Environment..."

# 1. Check/Install uv
if ! command -v uv &> /dev/null; then
    echo "[!] 'uv' tool not found. Installing via pip..."
    pip install uv
    if [ $? -ne 0 ]; then
        echo "[X] Failed to install uv. Please ensure Python 3 and pip are installed."
        exit 1
    fi
fi

# 2. Create Venv (Python 3.10)
echo "[+] Creating Virtual Environment (Python 3.10)..."
uv venv cv/.venv --python 3.10

# 3. Install Requirements
echo "[+] Installing Dependencies..."
# Detect path for python executable inside venv (Linux/Mac standard)
uv pip install -p cv/.venv/bin/python -r cv/requirements.txt

echo ""
echo "[SUCCESS] Environment Setup Complete!"
echo "You can now run: ./run_cv.sh"