@echo off
REM VolunteerHub - Start Frontend Development Server

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     VolunteerHub Frontend                                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"
cd frontend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)

echo.
echo Starting frontend development server...
echo App will run on: http://localhost:5173
echo.

npm run dev

pause
