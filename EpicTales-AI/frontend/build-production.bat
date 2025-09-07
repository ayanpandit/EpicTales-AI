@echo off
REM Frontend Build Script for Production Deployment (Windows)

echo 🚀 Starting EpicTales AI Frontend Production Build...

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Make sure you're in the frontend directory.
  exit /b 1
)

REM Check Node.js version
for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo 📦 Node.js version: %NODE_VERSION%

REM Install dependencies
echo 📥 Installing dependencies...
npm ci --production=false

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist "dist" rmdir /s /q "dist"

REM Build the application
echo 🏗️ Building application for production...
npm run build:static

REM Check if build was successful
if exist "dist" (
  echo ✅ Build successful!
  echo 📁 Build contents:
  dir "dist"
) else (
  echo ❌ Build failed!
  exit /b 1
)

echo ✅ Build complete! Upload the 'dist' folder to your hosting platform.
pause
