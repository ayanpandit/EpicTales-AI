# ✨ EpicTales AI - Magical Story Generator

> Create enchanting children's stories with AI-powered narrative generation and beautiful illustrations

## 🌟 Features

### ✨ Enhanced UI/UX
- **Bright Animated Title**: "Once Upon a Time" with fade-in effects and bright gradient colors
- **Large Hero Image**: Enhanced reading family image in testimonials section
- **Butter Smooth Scrolling**: GPU-accelerated smooth scrolling with zero lag
- **Custom Loader**: Beautiful branded loading animation
- **Glass Morphism**: Modern translucent design elements

### 📖 Story Generation
- **Personalized Stories**: Choose characters, genre, target audience, tone, and art style
- **4-Part Structure**: Introduction → Rising Action → Climax → Resolution
- **AI-Powered Content**: Stories reflect all selected options and preferences
- **Real-time Generation**: Fast template-based story creation

### 🎨 Image Generation
- **AI Illustrations**: Real Hugging Face API integration for scene illustrations
- **Beautiful Fallbacks**: Elegant placeholder images when generation is in progress
- **Smart Caching**: Memory-efficient image caching system

### 📄 PDF Export
- **Storybook Download**: Export complete stories as beautifully formatted PDFs
- **Decorative Design**: Colored pages, borders, and professional layout
- **Auto Cleanup**: Automatic file cleanup after download

### 🚀 Production Ready
- **Memory Management**: Advanced memory optimization and cleanup
- **Static Hosting**: Optimized for Render, Netlify, Vercel deployment
- **Performance Monitoring**: Built-in health checks and stats endpoints
- **Security Headers**: CORS, XSS protection, and security best practices

## 🏗️ Architecture

```
EpicTales-AI/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Main page components
│   │   └── assets/          # Images and static files
│   ├── dist/                # Built static files (generated)
│   └── netlify.toml         # Deployment configuration
├── backend/                  # Flask API server
│   ├── app.py               # Main application with optimizations
│   ├── gunicorn.conf.py     # Production server configuration
│   ├── requirements.txt     # Python dependencies
│   └── static/              # Generated files (temporary)
└── DEPLOYMENT.md            # Comprehensive deployment guide
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+ and pip
- **HuggingFace API Token** (for image generation)

### Local Development

#### 1. Clone Repository
```bash
git clone https://github.com/ayanpandit/EpicTales-AI.git
cd EpicTales-AI
```

#### 2. Setup Backend
```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "HUGGINGFACEHUB_API_TOKEN=your_token_here" > .env

# Start server
python app.py
```

#### 3. Setup Frontend
```bash
cd frontend
npm install

# Start development server
npm run dev
```

#### 4. Open Application
Visit `http://localhost:3000` to start creating stories!

## 🌐 Production Deployment

### Render (Recommended)

#### Backend
1. Create Web Service on Render
2. Connect GitHub repository
3. Set root directory to `backend`
4. Configure environment variables:
   ```
   FLASK_ENV=production
   HUGGINGFACEHUB_API_TOKEN=your_token
   CORS_ORIGINS=https://your-frontend.onrender.com
   ```

#### Frontend
1. Create Static Site on Render
2. Set root directory to `frontend`
3. Build command: `npm run build:static`
4. Environment variables:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```

### Other Platforms
- **Netlify**: Use `netlify.toml` configuration
- **Vercel**: Import GitHub repository with Vite framework
- **Railway**: Connect repository with auto-deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🎨 Recent Enhancements

### UI/UX Improvements
- ✅ **Animated Title**: "Once Upon a Time" with bright gradient and fade effects
- ✅ **Hero Image**: Enlarged reading family image with hover effects
- ✅ **Smooth Scrolling**: Comprehensive scroll optimization with GPU acceleration
- ✅ **Performance**: Hardware-accelerated transitions and interactions

### Backend Optimizations
- ✅ **Memory Management**: Automatic cleanup and memory monitoring
- ✅ **File Cleanup**: Auto-removal of old generated files
- ✅ **Health Monitoring**: Memory usage tracking and performance stats
- ✅ **Production Ready**: Gunicorn configuration and security headers

### Story Generation
- ✅ **Option Integration**: All story options properly reflected in content
- ✅ **Custom Loader**: Branded loading animation during generation
- ✅ **Scene Ordering**: Proper story structure and progression
- ✅ **PDF Export**: Decorative PDF generation with auto-cleanup

## 📊 API Endpoints

### Story Generation
- `POST /generate` - Generate story with options
- `GET /health` - Health check and memory stats
- `GET /stats` - Detailed server statistics

### PDF Export
- `POST /download-pdf` - Generate and download story PDF

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling with custom animations
- **Lucide React** - Icon library
- **GPU Acceleration** - Hardware-accelerated animations

### Backend
- **Flask** - Python web framework
- **Gunicorn** - Production WSGI server
- **HuggingFace** - AI image generation
- **ReportLab** - PDF generation
- **Psutil** - Memory monitoring

## 🎯 Performance Features

### Frontend Optimizations
- Static asset caching (1 year)
- Code splitting and lazy loading
- Image optimization and lazy loading
- GPU-accelerated smooth scrolling
- Optimized bundle size

### Backend Optimizations
- Memory usage monitoring
- Automatic file cleanup
- Response caching
- Connection pooling
- Production-grade logging

## 🔒 Security

- CORS protection with configurable origins
- XSS and CSRF protection headers
- File upload size limits
- Memory usage limits
- Input validation and sanitization

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🆘 Support

- 📖 [Deployment Guide](DEPLOYMENT.md)
- 🐛 [Issues](https://github.com/ayanpandit/EpicTales-AI/issues)
- 💬 [Discussions](https://github.com/ayanpandit/EpicTales-AI/discussions)

## 🎉 Acknowledgments

- HuggingFace for AI image generation
- React and Vite communities
- Flask and Python communities
- All contributors and users

---

**Made with ❤️ for creating magical stories that inspire young minds! ✨**
