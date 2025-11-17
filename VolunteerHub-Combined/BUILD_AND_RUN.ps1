#!/usr/bin/env pwsh
# VolunteerHub - Build and Run Script

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗"
Write-Host "║     VolunteerHub - Build & Run                            ║"
Write-Host "╚════════════════════════════════════════════════════════════╝"
Write-Host ""

# Get the project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "📁 Project Root: $projectRoot"
Write-Host ""

# ==================== BACKEND SETUP ====================
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host "🔧 BACKEND SETUP"
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host ""

Set-Location $backendPath

# Check and install dependencies
Write-Host "📦 Checking backend dependencies..."
if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "📥 Installing backend packages..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Backend installation failed!"
        exit 1
    }
} else {
    Write-Host "✅ Backend dependencies already installed"
}

Write-Host ""

# ==================== FRONTEND SETUP ====================
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host "🎨 FRONTEND SETUP"
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host ""

Set-Location $frontendPath

# Check and install dependencies
Write-Host "📦 Checking frontend dependencies..."
if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "📥 Installing frontend packages..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Frontend installation failed!"
        exit 1
    }
} else {
    Write-Host "✅ Frontend dependencies already installed"
}

# Build frontend
Write-Host ""
Write-Host "🔨 Building frontend..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!"
    exit 1
}
Write-Host "✅ Frontend build successful"
Write-Host ""

# ==================== STARTUP SUMMARY ====================
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host "✅ BUILD COMPLETE!"
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "📝 Next Steps:"
Write-Host ""
Write-Host "1️⃣  START MONGODB (in a new terminal):"
Write-Host "   mongod"
Write-Host ""
Write-Host "2️⃣  START BACKEND (in a new terminal):"
Write-Host "   cd backend"
Write-Host "   npm run dev"
Write-Host "   Server: http://localhost:5000"
Write-Host ""
Write-Host "3️⃣  START FRONTEND (in a new terminal):"
Write-Host "   cd frontend"
Write-Host "   npm run dev"
Write-Host "   App: http://localhost:5173"
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════"
Write-Host ""
Write-Host "🚀 Ready to launch! Follow the steps above to start the app."
Write-Host ""

Read-Host "Press Enter to exit"
