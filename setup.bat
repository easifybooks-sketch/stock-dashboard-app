@echo off
REM ─────────────────────────────────────────────────────
REM Stock Dashboard — Windows Setup
REM Double-click this file or run:  setup.bat
REM ─────────────────────────────────────────────────────

echo.
echo ==============================
echo   Stock Dashboard Setup
echo ==============================
echo.

REM ── 1. Check prerequisites ──────────────────────────
echo [1/4] Checking prerequisites...

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo X python not found.
    echo   Download from https://www.python.org/downloads/
    echo   IMPORTANT: Check "Add Python to PATH" during install!
    pause
    exit /b 1
)
python --version

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo X Node.js not found.
    echo   Download LTS from https://nodejs.org/
    pause
    exit /b 1
)
node --version

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo X npm not found. It should come with Node.js.
    pause
    exit /b 1
)
npm --version

echo.

REM ── 2. Set up .env file ─────────────────────────────
echo [2/4] Setting up .env file...
if not exist .env (
    copy .env.example .env >nul
    echo.
    echo ========================================================
    echo   IMPORTANT: Open .env in a text editor and replace
    echo   "your_alpha_vantage_key_here" with your real API key.
    echo.
    echo   Free key: https://www.alphavantage.co/support/
    echo ========================================================
    echo.
) else (
    echo   .env already exists — skipping
)

REM ── 3. Install backend dependencies ─────────────────
echo [3/4] Installing Python backend dependencies...
cd backend
python -m pip install -r requirements.txt --quiet
cd ..
echo   Done.

REM ── 4. Install frontend dependencies ────────────────
echo [4/4] Installing React frontend dependencies...
cd frontend
call npm install
cd ..
echo   Done.

echo.
echo ==============================
echo   Setup complete!
echo ==============================
echo.
echo To start the app, open TWO Command Prompt windows:
echo.
echo   Window 1 (Backend):
echo     cd backend
echo     python -m uvicorn main:app --reload --port 8000
echo.
echo   Window 2 (Frontend):
echo     cd frontend
echo     npm run dev
echo.
echo Then open http://localhost:5173 in your browser.
echo.
pause
