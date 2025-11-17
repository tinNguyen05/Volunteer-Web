@echo off
REM VolunteerHub-Combined - Quick Start Script for Windows

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     VolunteerHub-Combined - Startup Script                 ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Change to frontend directory
cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ❌ Installation failed!
        pause
        exit /b 1
    )
)

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Starting development server...
echo    Open: http://localhost:5173
echo.
echo 📝 Tip: You can now test the application:
echo    1. Click "Sign Up" to create an account
echo    2. Select a role (Volunteer/Manager/Admin)
echo    3. You'll be redirected to the dashboard
echo.

REM Start dev server
call npm run dev

pause
