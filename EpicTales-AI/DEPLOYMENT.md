# 🚀 EpicTales AI - Production Deployment Guide

## 📋 Overview
This guide will help you deploy EpicTales AI to production hosting platforms like Render, Netlify, or Vercel.

## 🏗️ Architecture
- **Frontend**: React + Vite static site
- **Backend**: Flask API with memory optimization
- **Features**: Story generation, PDF creation, image generation

## 🌐 Deployment Options

### Option 1: Render (Recommended - Full Stack)

#### Backend Deployment on Render
1. **Create Web Service**:
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Environment: `Python 3.11`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn --config gunicorn.conf.py app:app`

2. **Environment Variables**:
   ```
   FLASK_ENV=production
   FLASK_DEBUG=false
   HOST=0.0.0.0
   PORT=10000
   HUGGINGFACEHUB_API_TOKEN=your_token_here
   CORS_ORIGINS=https://your-frontend-app.onrender.com
   ```

3. **Health Check**: `/health`

#### Frontend Deployment on Render
1. **Create Static Site**:
   - Connect your GitHub repository
   - Select `frontend` folder as root directory
   - Build Command: `npm ci && npm run build:static`
   - Publish Directory: `dist`

2. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   NODE_VERSION=18
   ```

### Option 2: Netlify (Frontend) + Render (Backend)

#### Backend on Render (same as above)

#### Frontend on Netlify
1. **Deploy**:
   - Connect GitHub repository
   - Base directory: `frontend`
   - Build command: `npm run build:static`
   - Publish directory: `frontend/dist`

2. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend-app.onrender.com
   ```

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel
1. **Deploy**:
   - Import GitHub repository
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build:static`
   - Output Directory: `dist`

## 🔧 Pre-Deployment Checklist

### Frontend Setup
- [ ] Update `VITE_API_BASE_URL` in `.env.production`
- [ ] Test build with `npm run build:static`
- [ ] Verify all assets load correctly
- [ ] Check responsive design

### Backend Setup
- [ ] Add HuggingFace API token to environment variables
- [ ] Update CORS origins with your frontend URL
- [ ] Test API endpoints
- [ ] Verify PDF generation works
- [ ] Check memory usage

## 🚀 Deployment Steps

### 1. Prepare Repository
```bash
# Build and test frontend
cd frontend
npm install
npm run build:static
npm run preview

# Test backend
cd ../backend
pip install -r requirements.txt
python app.py
```

### 2. Backend Deployment
1. Create Render web service
2. Configure environment variables
3. Deploy and test health endpoint
4. Note the backend URL

### 3. Frontend Deployment
1. Update `.env.production` with backend URL
2. Create static site deployment
3. Configure environment variables
4. Deploy and test

### 4. Post-Deployment Testing
- [ ] Test story generation
- [ ] Test PDF download
- [ ] Test all form options
- [ ] Verify smooth scrolling
- [ ] Check mobile responsiveness

## 📊 Monitoring & Maintenance

### Health Checks
- Backend: `GET /health` - Returns memory usage and status
- Frontend: Monitor build logs and performance

### Memory Management
The backend includes automatic:
- Memory cleanup every 10 minutes
- Old file removal (1 hour)
- Cache size limiting
- Performance monitoring

### Logs and Debugging
- Backend logs available at `/stats` endpoint
- Frontend build logs in deployment platform
- Monitor memory usage via health endpoint

## 🔒 Security Features
- CORS protection
- Memory limits
- File cleanup
- Security headers
- Rate limiting ready

## 🎨 Performance Optimizations

### Frontend
- ✅ Static asset caching
- ✅ Code splitting
- ✅ Image optimization
- ✅ Smooth scrolling
- ✅ GPU acceleration

### Backend
- ✅ Memory management
- ✅ File cleanup
- ✅ Caching system
- ✅ Optimized imports
- ✅ Gunicorn with workers

## 🆘 Troubleshooting

### Common Issues
1. **CORS Errors**: Update backend CORS_ORIGINS
2. **API Connection**: Check VITE_API_BASE_URL
3. **Memory Issues**: Monitor /stats endpoint
4. **PDF Generation**: Verify ReportLab installation
5. **Image Generation**: Check HuggingFace token

### Environment Variables
Make sure these are set correctly:
- `VITE_API_BASE_URL` (frontend)
- `HUGGINGFACEHUB_API_TOKEN` (backend)
- `CORS_ORIGINS` (backend)

## 🎉 Success!
Your EpicTales AI application is now deployed and ready for users!

Visit your frontend URL to start creating magical stories! ✨
