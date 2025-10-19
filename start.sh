#!/bin/bash

# ProView Cadence Launch Script
# This script starts a local web server for development

echo "🚀 ProView Cadence - Launching Website..."
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null
then
    echo "✅ Python 3 detected"
    echo "🌐 Starting server on http://localhost:8080"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8080
# Check if Python 2 is available
elif command -v python &> /dev/null
then
    echo "✅ Python 2 detected"
    echo "🌐 Starting server on http://localhost:8080"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8080
# Check if Node.js is available
elif command -v npx &> /dev/null
then
    echo "✅ Node.js detected"
    echo "🌐 Starting server on http://localhost:8080"
    echo "📝 Press Ctrl+C to stop the server"
    echo ""
    npx live-server --port=8080
else
    echo "❌ No suitable server found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - Python 2: https://www.python.org/downloads/"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    echo "Or open index.html directly in your web browser"
fi
