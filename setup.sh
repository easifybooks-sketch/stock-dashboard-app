#!/bin/bash
# ─────────────────────────────────────────────────────
# Stock Dashboard — One-command local setup
# Run:  bash setup.sh
# ─────────────────────────────────────────────────────
set -e

echo ""
echo "=============================="
echo "  Stock Dashboard Setup"
echo "=============================="
echo ""

# ── 1. Check prerequisites ──────────────────────────
echo "▸ Checking prerequisites..."

if ! command -v python3 &>/dev/null; then
  echo "✗ python3 not found. Install from https://www.python.org/downloads/"
  exit 1
fi
echo "  ✓ python3 $(python3 --version 2>&1 | awk '{print $2}')"

if ! command -v node &>/dev/null; then
  echo "✗ Node.js not found."
  echo "  Install it from https://nodejs.org/ (download the LTS version)"
  echo "  Or run:  brew install node"
  exit 1
fi
echo "  ✓ node $(node --version)"

if ! command -v npm &>/dev/null; then
  echo "✗ npm not found. It should come with Node.js."
  exit 1
fi
echo "  ✓ npm $(npm --version)"

echo ""

# ── 2. Set up .env file ─────────────────────────────
if [ ! -f .env ]; then
  echo "▸ Creating .env from .env.example..."
  cp .env.example .env
  echo ""
  echo "╔══════════════════════════════════════════════════════╗"
  echo "║  IMPORTANT: Add your Alpha Vantage API key to .env  ║"
  echo "║                                                      ║"
  echo "║  Free key: https://www.alphavantage.co/support/      ║"
  echo "║  Then edit .env and replace the placeholder value.   ║"
  echo "╚══════════════════════════════════════════════════════╝"
  echo ""
else
  echo "▸ .env already exists — skipping"
fi

# ── 3. Install backend dependencies ─────────────────
echo "▸ Installing Python backend dependencies..."
cd backend
python3 -m pip install -r requirements.txt --quiet
cd ..
echo "  ✓ Backend dependencies installed"

# ── 4. Install frontend dependencies ────────────────
echo "▸ Installing React frontend dependencies..."
cd frontend
npm install --silent 2>/dev/null
cd ..
echo "  ✓ Frontend dependencies installed"

echo ""
echo "=============================="
echo "  Setup complete!"
echo "=============================="
echo ""
echo "To start the app, open TWO terminal windows:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    python3 -m uvicorn main:app --reload --port 8000"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser."
echo ""
