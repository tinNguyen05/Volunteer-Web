#!/bin/bash
# VolunteerHub - Build and Run Script

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     VolunteerHub - Build & Run                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PATH="$PROJECT_ROOT/backend"
FRONTEND_PATH="$PROJECT_ROOT/frontend"

echo "📁 Project Root: $PROJECT_ROOT"
echo ""

# ==================== BACKEND SETUP ====================
echo "═══════════════════════════════════════════════════════════"
echo "🔧 BACKEND SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd "$BACKEND_PATH"

echo "📦 Checking backend dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📥 Installing backend packages..."
    npm install
else
    echo "✅ Backend dependencies already installed"
fi

echo ""

# ==================== FRONTEND SETUP ====================
echo "═══════════════════════════════════════════════════════════"
echo "🎨 FRONTEND SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""

cd "$FRONTEND_PATH"

echo "📦 Checking frontend dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📥 Installing frontend packages..."
    npm install
else
    echo "✅ Frontend dependencies already installed"
fi

echo ""
echo "🔨 Building frontend..."
npm run build

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ BUILD COMPLETE!"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  START MONGODB (in a new terminal):"
echo "   mongod"
echo ""
echo "2️⃣  START BACKEND (in a new terminal):"
echo "   cd backend"
echo "   npm run dev"
echo "   Server: http://localhost:5000"
echo ""
echo "3️⃣  START FRONTEND (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo "   App: http://localhost:5173"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🚀 Ready to launch!"
echo ""
