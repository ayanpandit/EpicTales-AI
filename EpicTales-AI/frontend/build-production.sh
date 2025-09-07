#!/bin/bash
# Frontend Build Script for Production Deployment

echo "🚀 Starting EpicTales AI Frontend Production Build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Make sure you're in the frontend directory."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Install dependencies
echo "📥 Installing dependencies..."
npm ci --production=false

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Load environment variables
if [ -f ".env.production" ]; then
  echo "🔧 Loading production environment variables..."
  export $(cat .env.production | grep -v '^#' | xargs)
else
  echo "⚠️  Warning: .env.production file not found"
fi

# Build the application
echo "🏗️  Building application for production..."
npm run build:static

# Check if build was successful
if [ -d "dist" ]; then
  echo "✅ Build successful!"
  echo "📊 Build size analysis:"
  du -sh dist/
  echo "📁 Build contents:"
  ls -la dist/
else
  echo "❌ Build failed!"
  exit 1
fi

# Optional: Test the build locally
if command -v python3 &> /dev/null; then
  echo "🧪 Starting local test server..."
  echo "Visit http://localhost:8000 to test the build"
  cd dist && python3 -m http.server 8000
else
  echo "✅ Build complete! Upload the 'dist' folder to your hosting platform."
fi
