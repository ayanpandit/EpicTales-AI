# EpicTales-AI Setup Guide

Complete setup guide for the EpicTales-AI storytelling application.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 16+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/ayanpandit/EpicTales-AI.git
cd EpicTales-AI
```

### 2. Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file and add your Hugging Face token
# Get token from: https://huggingface.co/settings/tokens
```

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Configuration

### Backend (.env)
```bash
HUGGINGFACEHUB_API_TOKEN=your_token_here
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000
HOST=localhost
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
VITE_DEBUG=true
```

## 🌐 API Integration

The frontend automatically connects to the backend using:

- **Health Check**: Verifies backend connection on load
- **Error Handling**: Detailed error messages for debugging
- **Timeout Management**: Configurable request timeouts
- **Status Indicator**: Visual connection status in dashboard

### API Endpoints

- `GET /health` - Backend health check
- `POST /generate` - Story generation
- `GET /static/<filename>` - Generated image files

## 🚨 Troubleshooting

### Backend Issues

1. **Missing API Token**
   ```bash
   ❌ HUGGINGFACEHUB_API_TOKEN environment variable is required
   ```
   **Solution**: Get token from https://huggingface.co/settings/tokens

2. **Port Already in Use**
   ```bash
   OSError: [Errno 98] Address already in use
   ```
   **Solution**: Change PORT in backend/.env

3. **Permission Denied**
   ```bash
   Permission denied: start.sh
   ```
   **Solution**: `chmod +x start.sh`

### Frontend Issues

1. **Backend Connection Failed**
   - Check backend is running on correct port
   - Verify VITE_API_BASE_URL matches backend
   - Check firewall/network settings

2. **CORS Errors**
   - Add frontend URL to CORS_ORIGINS in backend/.env
   - Restart backend after changes

### Common Solutions

1. **Reset Everything**
   ```bash
   # Backend
   cd backend
   rm -rf venv __pycache__ static
   
   # Frontend  
   cd ../frontend
   rm -rf node_modules dist
   npm install
   ```

2. **Check Service Status**
   ```bash
   # Backend health
   curl http://localhost:5000/health
   
   # Frontend
   curl http://localhost:5173
   ```

## 📱 Features

### Backend
- ⚡ Ultra-fast story generation (< 5 seconds)
- 🎨 Parallel image generation
- 💾 Smart caching system
- 🔒 Secure environment configuration
- 🧹 Automatic file cleanup

### Frontend
- 🎭 Interactive character selection
- 🎨 Customizable story parameters
- 📱 Responsive design
- 🔄 Real-time backend status
- ⚡ Smooth animations and transitions

## 🔄 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && python app.py
   ```

2. **Start Frontend**
   ```bash
   cd frontend && npm run dev
   ```

3. **Check Connection**
   - Visit http://localhost:5173
   - Look for "Backend Connected" status
   - Test story generation

## 🚀 Production Deployment

### Backend
- Set `FLASK_DEBUG=false`
- Use production WSGI server
- Configure proper CORS origins
- Set up environment variables on host

### Frontend
- Build: `npm run build`
- Deploy dist folder to web server
- Update VITE_API_BASE_URL to production backend

## 🆘 Support

If you encounter issues:
1. Check the backend logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check network connectivity between frontend and backend

Happy storytelling! ✨
