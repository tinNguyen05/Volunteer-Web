@echo off
REM VolunteerHub - Start Backend Server
REM Make sure MongoDB is running before starting this!

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     VolunteerHub Backend Server                           ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"
cd backend

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)

echo.
echo Starting backend server...
echo Server will run on: http://localhost:5000
echo.
echo ⚠️  Make sure MongoDB is running!
echo.

npm run dev

pause
