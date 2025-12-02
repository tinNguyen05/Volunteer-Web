# ========================================
#   VOLUNTEER HUB - PROJECT LAUNCHER (PowerShell)
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VOLUNTEER HUB - PROJECT LAUNCHER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "[1/5] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js: OK ($nodeVersion)" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host ""

# Check MongoDB
Write-Host "[2/5] Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version 2>&1 | Select-String "db version"
    Write-Host "MongoDB: OK" -ForegroundColor Green
} catch {
    Write-Host "WARNING: MongoDB not found in PATH" -ForegroundColor Yellow
    Write-Host "Please ensure MongoDB is running on mongodb://localhost:27017" -ForegroundColor Yellow
}
Write-Host ""

# Setup Backend
Write-Host "[3/5] Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
        Set-Location ..
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Backend dependencies: OK" -ForegroundColor Green
}

# Generate VAPID keys if needed
$envContent = Get-Content .env -Raw
if ($envContent -notmatch "VAPID_PUBLIC_KEY=BM") {
    Write-Host ""
    Write-Host "Generating VAPID keys for Web Push notifications..." -ForegroundColor Cyan
    
    $vapidScript = @"
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('VAPID_PUBLIC_KEY=' + keys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);
"@
    
    Set-Content -Path "generate-vapid.js" -Value $vapidScript
    $vapidKeys = node generate-vapid.js
    
    Write-Host ""
    Write-Host "Generated VAPID Keys:" -ForegroundColor Green
    Write-Host $vapidKeys -ForegroundColor White
    Write-Host ""
    
    # Auto-append to .env
    Add-Content -Path ".env" -Value "`n# Web Push Notifications (VAPID)"
    Add-Content -Path ".env" -Value $vapidKeys[0]
    Add-Content -Path ".env" -Value $vapidKeys[1]
    Add-Content -Path ".env" -Value "VAPID_SUBJECT=mailto:admin@volunteerhub.com"
    
    Write-Host "VAPID keys added to .env file!" -ForegroundColor Green
    
    Remove-Item "generate-vapid.js" -ErrorAction SilentlyContinue
}

Write-Host ""

# Setup Frontend
Write-Host "[4/5] Setting up Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        Set-Location ..
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "Frontend dependencies: OK" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "[5/5] Starting servers..." -ForegroundColor Yellow

# Start MongoDB if not running
Write-Host "Starting MongoDB (if not already running)..." -ForegroundColor Cyan
Start-Process mongod -WindowStyle Hidden -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   LAUNCHING APPLICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on: http://localhost:5000" -ForegroundColor White
Write-Host "Frontend will start on: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "Starting Backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'BACKEND SERVER' -ForegroundColor Green; npm start"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'FRONTEND SERVER' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Default login credentials:" -ForegroundColor Yellow
Write-Host "- Admin: admin@example.com / Admin@123" -ForegroundColor White
Write-Host "- Manager: manager@example.com / Manager@123" -ForegroundColor White
Write-Host "- Volunteer: volunteer@example.com / Volunteer@123" -ForegroundColor White
Write-Host ""
Write-Host "Opening browser in 5 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "Application launched successfully!" -ForegroundColor Green
Write-Host "Check the opened terminal windows for server logs." -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit this window (servers will keep running)"
