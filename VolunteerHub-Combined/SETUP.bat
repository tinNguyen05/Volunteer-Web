@echo off
REM VolunteerHub - Quick Launch Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     VolunteerHub - Quick Start Guide                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo This script will prepare your environment.
echo After this completes, follow these steps:
echo.
echo 1. START MONGODB in a new terminal:
echo    mongod
echo.
echo 2. START BACKEND in a new terminal:
echo    cd backend
echo    npm run dev
echo    Server will run on: http://localhost:5000
echo.
echo 3. START FRONTEND in a new terminal:
echo    cd frontend
echo    npm run dev
echo    App will run on: http://localhost:5173
echo.
echo ════════════════════════════════════════════════════════════
echo.

cd /d "%~dp0"

echo Installing backend dependencies...
cd backend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo Failed to build frontend
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ Build Complete!
echo ════════════════════════════════════════════════════════════
echo.
echo You can now start the backend and frontend in separate terminals.
echo.
pause
