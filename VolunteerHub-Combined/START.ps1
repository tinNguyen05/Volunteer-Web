#!/usr/bin/env pwsh
# VolunteerHub-Combined - Quick Start Script for PowerShell

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗"
Write-Host "║     VolunteerHub-Combined - Startup Script                 ║"
Write-Host "╚════════════════════════════════════════════════════════════╝"
Write-Host ""

# Change to frontend directory
$frontendPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "frontend"
Set-Location $frontendPath

# Check if node_modules exists
$nodeModulesPath = Join-Path $frontendPath "node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "📦 Installing dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Installation failed!"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Setup complete!"
Write-Host ""
Write-Host "🚀 Starting development server..."
Write-Host "   Open: http://localhost:5173"
Write-Host ""
Write-Host "📝 Tip: You can now test the application:"
Write-Host "   1. Click 'Sign Up' to create an account"
Write-Host "   2. Select a role (Volunteer/Manager/Admin)"
Write-Host "   3. You'll be redirected to the dashboard"
Write-Host ""

# Start dev server
npm run dev

Read-Host "Press Enter to exit"
