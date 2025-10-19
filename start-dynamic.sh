#!/bin/bash

# ProView Cadence - Dynamic Server Starter
# This script starts the dynamic Python server with real-time updates

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║        ProView Cadence - Dynamic Server Starter           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# Kill any existing Python server on port 8080
echo "🔍 Checking for existing servers on port 8080..."
lsof -ti:8080 | xargs kill -9 2>/dev/null && echo "   ✅ Stopped old server" || echo "   ℹ️  No existing server found"

echo ""
echo "🚀 Starting Dynamic Server..."
echo ""

# Start the dynamic server
python3 server-dynamic.py
