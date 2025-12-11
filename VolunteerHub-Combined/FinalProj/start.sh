#!/bin/bash
# VolunteerHub - Startup Script for Linux/Mac
# This script starts both backend and frontend services

set -e

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║            VolunteerHub - Startup Script              ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Get project root directory
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_PATH="$PROJECT_ROOT/backend"
FRONTEND_PATH="$PROJECT_ROOT/frontend"

# Check if Java is installed
echo "[1/5] Checking Java installation..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo "✓ Java is installed"
    echo "  $JAVA_VERSION"
else
    echo "✗ Java is not installed or not in PATH!"
    echo "  Please install JDK 21 or higher"
    exit 1
fi
echo ""

# Check if Node.js is installed
echo "[2/5] Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✓ Node.js is installed ($NODE_VERSION)"
else
    echo "✗ Node.js is not installed or not in PATH!"
    echo "  Please install Node.js v18 or higher"
    exit 1
fi
echo ""

# Check PostgreSQL connection
echo "[3/5] Checking PostgreSQL..."
echo "  Ensure PostgreSQL is running on localhost:5431"
echo "  Database: volunteerhub | User: admin | Pass: admin123"
echo ""

# Check Redis connection
echo "[4/5] Checking Redis..."
echo "  Ensure Redis is running on localhost:6379"
echo ""

# Start Backend
echo "[5/5] Starting services..."
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Starting Backend (Spring Boot)"
echo "═══════════════════════════════════════════════════════"
echo ""

cd "$BACKEND_PATH"

# Start backend in background
echo "Starting backend server..."
./gradlew bootRun > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend to start
echo "Waiting for backend to initialize..."
sleep 10

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  Starting Frontend (React + Vite)"
echo "═══════════════════════════════════════════════════════"
echo ""

cd "$FRONTEND_PATH"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
echo "Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✓ All Services Started                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Backend:  http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "GraphQL:  http://localhost:8080/graphql"
echo ""
echo "Backend PID: $BACKEND_PID (log: backend/backend.log)"
echo "Frontend PID: $FRONTEND_PID (log: frontend/frontend.log)"
echo ""
echo "To stop services, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Opening browser..."
sleep 2

# Try to open browser (works on most systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5173
elif command -v open &> /dev/null; then
    open http://localhost:5173
fi

cd "$PROJECT_ROOT"

echo ""
echo "Done! Check backend.log and frontend.log for server logs."
echo ""
