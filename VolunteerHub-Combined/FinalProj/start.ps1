# VolunteerHub - Startup Script
# This script starts both backend and frontend services

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "" -ForegroundColor Cyan
Write-Host "            VolunteerHub - Startup Script              " -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host ""

# Get project root directory
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

# Check if Java is installed
Write-Host "[1/5] Checking Java installation..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host " Java is installed" -ForegroundColor Green
    Write-Host "  $javaVersion" -ForegroundColor Gray
} catch {
    Write-Host " Java is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "  Please install JDK 21 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check if Node.js is installed
Write-Host "[2/5] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host " Node.js is installed ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host " Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "  Please install Node.js v18 or higher" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check PostgreSQL connection
Write-Host "[3/5] Checking PostgreSQL..." -ForegroundColor Yellow
Write-Host "  Ensure PostgreSQL is running on localhost:5431" -ForegroundColor Gray
Write-Host "  Database: volunteerhub | User: admin | Pass: admin123" -ForegroundColor Gray
Write-Host ""

# Check Redis connection
Write-Host "[4/5] Checking Redis..." -ForegroundColor Yellow
Write-Host "  Ensure Redis is running on localhost:6379" -ForegroundColor Gray
Write-Host ""

# Start Backend
Write-Host "[5/5] Starting services..." -ForegroundColor Yellow
Write-Host ""
Write-Host "" -ForegroundColor Cyan
Write-Host "  Starting Backend (Spring Boot)" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host ""

Set-Location $backendPath

# Start backend in a new window
Write-Host "Starting backend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Starting Spring Boot Backend...' -ForegroundColor Green; .\gradlew.bat bootRun"

# Wait a bit for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "" -ForegroundColor Cyan
Write-Host "  Starting Frontend (React + Vite)" -ForegroundColor Cyan
Write-Host "" -ForegroundColor Cyan
Write-Host ""

Set-Location $frontendPath

# Check if node_modules exists
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host " Failed to install dependencies!" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start frontend in a new window
Write-Host "Starting frontend server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Starting Vite Dev Server...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "" -ForegroundColor Green
Write-Host "               All Services Started                    " -ForegroundColor Green
Write-Host "" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "GraphQL:  http://localhost:8080/graphql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Wait for 2 seconds then open browser
Start-Sleep -Seconds 2
Write-Host "Opening browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

# Return to project root
Set-Location $projectRoot

Write-Host ""
Write-Host "Done! Check the new windows for server logs." -ForegroundColor Green
Write-Host ""
