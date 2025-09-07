#!/bin/bash

# Production deployment script for EpicTales AI Backend
# Optimized for hosting platforms like Render, Railway, etc.

echo "🚀 Starting EpicTales AI Backend..."

# Set production environment
export FLASK_ENV=production
export FLASK_DEBUG=False

# Memory optimization
export PYTHONUNBUFFERED=1
export PYTHONDONTWRITEBYTECODE=1

# Default port (override with environment variable)
export PORT=${PORT:-5000}

echo "🌍 Environment: production"
echo "🔧 Port: $PORT"
echo "📦 Python: $(python --version)"

# Install dependencies if needed
if [ -f requirements.txt ]; then
    echo "📋 Installing dependencies..."
    pip install -r requirements.txt
fi

# Create necessary directories
mkdir -p static
chmod 755 static

# Start the server with Gunicorn
echo "🎯 Starting Gunicorn server..."
exec gunicorn \
    --config gunicorn.conf.py \
    --bind 0.0.0.0:$PORT \
    --workers 3 \
    --timeout 120 \
    --worker-class sync \
    --max-requests 1000 \
    --max-requests-jitter 100 \
    --preload \
    --access-logfile - \
    --error-logfile - \
    app:app
