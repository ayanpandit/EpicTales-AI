# EpicTales-AI Backend

Lightning-fast AI-powered storybook backend with optimized image generation and caching.

## Quick Start

### 1. Environment Setup

Create a `.env` file in the backend directory:

```bash
# Required: Get from https://huggingface.co/settings/tokens
HUGGINGFACEHUB_API_TOKEN=your_token_here

# Optional Configuration
FLASK_ENV=development
FLASK_DEBUG=true
PORT=5000
HOST=localhost
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
HTTP_TIMEOUT=15
MAX_WORKERS=4
```

### 2. Installation & Running

#### Option A: Auto Setup (Recommended)

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status.

### Generate Story
```
POST /generate
Content-Type: application/json

{
  "story_idea": "A brave knight and a friendly dragon",
  "genre": "fantasy",
  "tone": "lighthearted",
  "art_style": "cartoon",
  "audience": "children",
  "characters": ["Knight", "Dragon"]
}
```

### Static Files
```
GET /static/<filename>
```
Serves generated images.

## Features

- ⚡ **Ultra-fast**: < 5 seconds story generation
- 🎨 **Parallel image generation**: Multiple images at once
- 💾 **Smart caching**: Memory + disk caching
- 🧹 **Auto cleanup**: Manages storage automatically
- 🔒 **Secure**: Environment variable configuration
- 🌐 **CORS enabled**: Works with any frontend
- 📱 **Responsive**: Optimized for all devices

## Configuration

All configuration is done via environment variables in the `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `HUGGINGFACEHUB_API_TOKEN` | Required | Your Hugging Face API token |
| `FLASK_ENV` | `development` | Flask environment |
| `FLASK_DEBUG` | `true` | Enable/disable debug mode |
| `PORT` | `5000` | Server port |
| `HOST` | `localhost` | Server host |
| `CORS_ORIGINS` | `http://localhost:3000,http://localhost:5173` | Allowed CORS origins |
| `HTTP_TIMEOUT` | `15` | API request timeout in seconds |
| `MAX_WORKERS` | `4` | Maximum parallel workers |

## Troubleshooting

### Common Issues

1. **Missing API Token**
   - Get your token from https://huggingface.co/settings/tokens
   - Add it to your `.env` file

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Update frontend `VITE_API_BASE_URL` accordingly

3. **CORS Issues**
   - Add your frontend URL to `CORS_ORIGINS` in `.env`

4. **Slow Performance**
   - Increase `MAX_WORKERS` in `.env`
   - Check your internet connection
   - Verify Hugging Face API limits

### Debug Mode

Enable detailed logging by setting:
```
FLASK_DEBUG=true
```

## Development

The backend is optimized for:
- Fast story generation using templates
- Efficient image generation with parallel processing
- Minimal resource usage for free-tier deployments
- Easy integration with any frontend framework

## Deployment

For production deployment, consider:
- Setting `FLASK_DEBUG=false`
- Using a production WSGI server like Gunicorn
- Configuring proper CORS origins
- Setting up proper logging
