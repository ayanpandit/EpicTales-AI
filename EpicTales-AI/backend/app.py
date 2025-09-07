from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import logging
import time
import requests
import base64
import io
from PIL import Image, ImageDraw, ImageFont
import json
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib
from dotenv import load_dotenv
import gc
import psutil
import sys
from werkzeug.middleware.profiler import ProfilerMiddleware

# PDF generation imports
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, PageBreak
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas
    from reportlab.lib.utils import ImageReader
    HAS_REPORTLAB = True
except ImportError:
    HAS_REPORTLAB = False
    print("ReportLab not available - PDF functionality disabled")

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Memory management configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'static'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 300  # 5 minutes cache

# Enable profiling in development
if os.getenv('FLASK_ENV') == 'development':
    app.wsgi_app = ProfilerMiddleware(app.wsgi_app, restrictions=[30])

# Get CORS origins from environment
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
CORS(app, origins=cors_origins, methods=["GET", "POST"], allow_headers=["Content-Type"])

# Optimized logging
from logging.handlers import RotatingFileHandler

# Create handlers
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)

# Use RotatingFileHandler for file logging (only in production)
if os.getenv('FLASK_ENV') == 'production':
    file_handler = RotatingFileHandler('app.log', maxBytes=10485760, backupCount=5)
    file_handler.setLevel(logging.INFO)
    handlers = [console_handler, file_handler]
else:
    handlers = [console_handler]

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=handlers
)
logger = logging.getLogger(__name__)

# Create static directory with proper permissions
os.makedirs('static', exist_ok=True)
os.chmod('static', 0o755)

# LIGHTNING FAST CONFIG with memory optimization
TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
if not TOKEN:
    TOKEN = "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"  # Fallback token

HTTP_TIMEOUT = int(os.getenv('HTTP_TIMEOUT', '30'))  # Increased for real API calls
MAX_WORKERS = int(os.getenv('MAX_WORKERS', '4'))

# WORKING MODEL LIST (from your original code that worked)
MODEL_CANDIDATES = [
    "stabilityai/stable-diffusion-2-1",
    "stabilityai/stable-diffusion-xl-base-1.0", 
    "prompthero/openjourney-v4",
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
    "CompVis/stable-diffusion-v1-4",
]

# Import working image generation logic
try:
    from huggingface_hub import InferenceClient
    HAS_CLIENT = True
except Exception:
    HAS_CLIENT = False

# Global cache with memory limits
story_cache = {}
image_cache = {}
cache_max_size = 100  # Maximum cache entries

# Memory management utilities
def get_memory_usage():
    """Get current memory usage"""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # MB

def cleanup_memory():
    """Force garbage collection and memory cleanup"""
    gc.collect()
    
def cleanup_old_files():
    """Clean up old static files to prevent disk space issues"""
    static_dir = 'static'
    current_time = time.time()
    
    for filename in os.listdir(static_dir):
        if filename.endswith(('.png', '.jpg', '.jpeg', '.pdf')):
            file_path = os.path.join(static_dir, filename)
            file_age = current_time - os.path.getctime(file_path)
            
            # Remove files older than 1 hour
            if file_age > 3600:
                try:
                    os.remove(file_path)
                    logger.info(f"Cleaned up old file: {filename}")
                except Exception as e:
                    logger.error(f"Error cleaning file {filename}: {e}")

def manage_cache_size():
    """Limit cache size to prevent memory bloat"""
    global story_cache, image_cache
    
    if len(story_cache) > cache_max_size:
        # Remove oldest entries
        keys_to_remove = list(story_cache.keys())[:-cache_max_size//2]
        for key in keys_to_remove:
            del story_cache[key]
    
    if len(image_cache) > cache_max_size:
        keys_to_remove = list(image_cache.keys())[:-cache_max_size//2]
        for key in keys_to_remove:
            del image_cache[key]

# Periodic cleanup task
def periodic_cleanup():
    """Run periodic cleanup tasks"""
    cleanup_memory()
    cleanup_old_files()
    manage_cache_size()
    
    # Log memory usage
    memory_mb = get_memory_usage()
    logger.info(f"Memory usage: {memory_mb:.2f} MB")

# Schedule cleanup every 10 minutes
cleanup_timer = None
def schedule_cleanup():
    global cleanup_timer
    cleanup_timer = threading.Timer(600.0, schedule_cleanup)  # 10 minutes
    cleanup_timer.daemon = True
    cleanup_timer.start()
    periodic_cleanup()

# Start cleanup scheduler
schedule_cleanup()

# Pre-built story templates for INSTANT generation (keeping this optimization)
STORY_TEMPLATES = {
    "fantasy": {
        "Introduction": [
            "In a magical kingdom far away, lived a brave young hero named Alex who discovered they had special powers.",
            "Once upon a time, in an enchanted forest, a curious child found a mysterious glowing crystal.",
            "In the land of dragons and wizards, a young apprentice began their first magical adventure."
        ],
        "Rising Action": [
            "The hero faced their first challenge when an evil sorcerer threatened the peaceful village.",
            "Dark clouds gathered as ancient magic began to stir, and our hero must learn to control their new abilities.",
            "A dangerous quest began when the magical artifact was stolen by shadow creatures."
        ],
        "Climax": [
            "In an epic battle of good versus evil, the hero used all their courage and newfound powers.",
            "At the highest tower of the dark castle, the final confrontation with the villain began.",
            "The fate of the magical realm hung in balance as the ultimate test of bravery arrived."
        ],
        "Resolution": [
            "Peace was restored to the land, and the hero was celebrated by all the magical creatures.",
            "The kingdom was saved, and our hero learned that true magic comes from friendship and kindness.",
            "With evil defeated, the magical world flourished once again under the hero's protection."
        ]
    },
    "adventure": {
        "Introduction": [
            "Captain Maya set sail across the seven seas in search of the legendary treasure island.",
            "In the dense Amazon jungle, explorer Sam discovered clues to an ancient lost city.",
            "High in the mountain peaks, brave climber Alex found a hidden cave full of mysteries."
        ],
        "Rising Action": [
            "Dangerous storms and sea monsters challenged our brave adventurer's journey.",
            "Ancient traps and wild animals protected the secrets of the forgotten civilization.",
            "Treacherous paths and mysterious guardians tested the explorer's determination."
        ],
        "Climax": [
            "In the final chamber, the adventurer faced the ultimate puzzle that guarded the treasure.",
            "At the heart of the lost temple, our hero confronted the ancient guardian spirit.",
            "The most dangerous part of the journey led to the discovery of incredible secrets."
        ],
        "Resolution": [
            "The treasure was found, but the real reward was the wisdom gained along the way.",
            "The lost city's secrets were preserved, and our adventurer became a legendary explorer.",
            "The journey ended safely, with amazing stories to share with the world."
        ]
    },
    "mystery": {
        "Introduction": [
            "Detective Riley received a puzzling case about a missing jewel from the museum.",
            "In the quiet town of Willowbrook, strange things started happening every full moon.",
            "Young sleuth Alex noticed peculiar clues that others had completely overlooked."
        ],
        "Rising Action": [
            "More clues appeared, but each one led to even more confusing questions and dead ends.",
            "The mystery deepened when witnesses gave conflicting stories about what they saw.",
            "Secret passages and hidden messages revealed that someone was watching everything."
        ],
        "Climax": [
            "All the clues finally came together in a surprising revelation that no one expected.",
            "The truth was more shocking than anyone imagined, hidden in plain sight all along.",
            "In a dramatic confrontation, the real culprit was finally revealed to everyone."
        ],
        "Resolution": [
            "Justice was served, and the mystery was solved thanks to careful detective work.",
            "The truth brought peace to the community, and the detective earned great respect.",
            "With the case closed, everyone learned valuable lessons about truth and justice."
        ]
    },
    "scifi": {
        "Introduction": [
            "Commander Zara explored distant galaxies aboard the starship Discovery in the year 3024.",
            "On Mars colony, young scientist Kim discovered strange signals from deep space.",
            "In the underwater city of New Atlantis, engineer Pat built amazing robots."
        ],
        "Rising Action": [
            "Alien contact changed everything when mysterious visitors arrived from another dimension.",
            "The space station faced danger when systems began failing in impossible ways.",
            "Time itself seemed to bend when the experimental portal started malfunctioning."
        ],
        "Climax": [
            "Humans and aliens worked together to save both civilizations from a cosmic threat.",
            "The fate of Earth hung in the balance as our heroes raced against time.",
            "Advanced technology and human courage combined to face the ultimate challenge."
        ],
        "Resolution": [
            "Peace between worlds was established, opening new chapters in galactic history.",
            "The universe became safer thanks to the brave actions of our space heroes.",
            "New discoveries led to amazing advances that helped all living beings thrive."
        ]
    }
}

def get_story_hash(story_idea, genre, tone, audience, characters):
    """Create hash for caching"""
    character_names = ",".join(sorted(characters)) if characters else ""
    content = f"{story_idea}_{genre}_{tone}_{audience}_{character_names}"
    return hashlib.md5(content.encode()).hexdigest()[:12]

def generate_lightning_story(story_idea, genre, tone, audience, characters, art_style):
    """Enhanced story generation using all user options"""
    try:
        # Check cache first
        cache_key = get_story_hash(story_idea, genre, tone, audience, characters)
        if cache_key in story_cache:
            return story_cache[cache_key]
        
        # Get templates for genre
        templates = STORY_TEMPLATES.get(genre, STORY_TEMPLATES["fantasy"])
        
        # Prepare character information
        character_list = characters if characters else ["brave hero"]
        main_character = character_list[0] if character_list else "brave hero"
        supporting_chars = character_list[1:] if len(character_list) > 1 else []
        
        # Create dynamic story based on all options
        story = {}
        
        # Age-appropriate language based on audience
        age_modifiers = {
            "preschool": {"complexity": "simple", "words": "easy", "sentence_length": "short"},
            "elementary": {"complexity": "moderate", "words": "clear", "sentence_length": "medium"},
            "middle": {"complexity": "detailed", "words": "rich", "sentence_length": "varied"},
            "all": {"complexity": "engaging", "words": "accessible", "sentence_length": "balanced"}
        }
        
        age_style = age_modifiers.get(audience, age_modifiers["all"])
        
        # Tone-specific language
        tone_modifiers = {
            "lighthearted": {"mood": "cheerful and fun", "approach": "with a smile"},
            "adventurous": {"mood": "exciting and bold", "approach": "with courage"},
            "magical": {"mood": "mystical and enchanting", "approach": "with wonder"},
            "educational": {"mood": "informative and engaging", "approach": "with learning"}
        }
        
        tone_style = tone_modifiers.get(tone, tone_modifiers["lighthearted"])
        
        # Generate personalized story for each scene
        for scene in ["Introduction", "Rising Action", "Climax", "Resolution"]:
            base_template = templates[scene][hash(story_idea + scene) % len(templates[scene])]
            
            # Customize the story with user choices
            personalized_story = base_template
            
            # Replace generic character names with selected characters
            personalized_story = personalized_story.replace("hero", main_character)
            personalized_story = personalized_story.replace("Alex", main_character)
            personalized_story = personalized_story.replace("Maya", main_character)
            personalized_story = personalized_story.replace("Sam", main_character)
            
            # Add supporting characters if available
            if supporting_chars:
                if scene == "Introduction":
                    char_intro = f", accompanied by {', '.join(supporting_chars[:-1])}" + (f" and {supporting_chars[-1]}" if len(supporting_chars) > 1 else f" and {supporting_chars[0]}")
                    personalized_story = personalized_story.replace(".", char_intro + ".")
                elif scene == "Rising Action" and len(supporting_chars) > 0:
                    personalized_story += f" With help from {supporting_chars[0]}, they faced the challenge together."
            
            # Incorporate the specific story idea
            if story_idea.lower() not in personalized_story.lower():
                if scene == "Introduction":
                    personalized_story = personalized_story.replace("adventure", f"{story_idea} adventure")
                elif scene == "Rising Action":
                    personalized_story += f" The {story_idea} story becomes more intense."
                elif scene == "Climax":
                    personalized_story += f" The heart of the {story_idea} tale reaches its peak."
                else:  # Resolution
                    personalized_story += f" The {story_idea} adventure concludes beautifully."
            
            # Apply tone and audience modifications
            if audience == "preschool":
                personalized_story = personalized_story.replace("dangerous", "challenging")
                personalized_story = personalized_story.replace("evil", "not-so-nice")
                personalized_story = personalized_story.replace("battle", "face-off")
            
            # Add tone-specific elements
            if tone == "magical":
                personalized_story += f" Sparkles of magic fill the air {tone_style['approach']}."
            elif tone == "educational":
                if scene == "Resolution":
                    personalized_story += f" And everyone learned something new {tone_style['approach']}."
            elif tone == "adventurous":
                personalized_story += f" The adventure continues {tone_style['approach']}."
            
            story[scene] = personalized_story
        
        # Add title based on user choices
        title_parts = [story_idea.title()]
        if len(character_list) > 1:
            title_parts.append(f"and the {character_list[1].title()}")
        story["title"] = " ".join(title_parts)
        
        # Cache the result
        story_cache[cache_key] = story
        return story
        
    except Exception as e:
        logger.error(f"Story generation error: {e}")
        # Return fallback story with user's characters
        main_char = characters[0] if characters else "hero"
        return {
            "title": f"{story_idea} Adventure",
            "Introduction": f"A wonderful {story_idea} adventure begins with {main_char}...",
            "Rising Action": f"Exciting challenges await {main_char} in this {tone} tale...",
            "Climax": f"The most thrilling moment arrives for {main_char}...",
            "Resolution": f"Everything ends perfectly as {main_char} succeeds with joy and happiness."
        }

def sanitize_filename(model_id):
    """Helper for filename from original working code"""
    return model_id.replace("/", "_").replace(" ", "_")

def try_with_inference_client(prompt, model, scene_name):
    """Image generation using InferenceClient - FROM ORIGINAL WORKING CODE"""
    if not HAS_CLIENT:
        return False, "huggingface_hub.InferenceClient not installed"
    try:
        client = InferenceClient(token=TOKEN)
        logger.info(f"InferenceClient: requesting model '{model}' for {scene_name}...")
        
        # Generate image
        image = client.text_to_image(prompt, model=model)
        
        # Handle list response
        if isinstance(image, list):
            image = image[0]
        
        # Save with scene-specific filename
        timestamp = int(time.time())
        out_fname = f"hf_{scene_name.lower().replace(' ', '_')}_{sanitize_filename(model)}_{timestamp}.png"
        img_path = os.path.join("static", out_fname)
        image.save(img_path)
        
        logger.info(f"✅ Saved image: {out_fname}")
        return True, out_fname
        
    except Exception as e:
        return False, f"InferenceClient error: {repr(e)}"

def try_with_http_api(prompt, model, scene_name):
    """Image generation using HTTP API - FROM ORIGINAL WORKING CODE"""
    endpoint = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {TOKEN}"}
    payload = {
        "inputs": prompt,
        "options": {"wait_for_model": True}  # IMPORTANT: Wait for model to load
    }
    
    try:
        logger.info(f"HTTP: POST {endpoint} for {scene_name}...")
        r = requests.post(endpoint, headers=headers, json=payload, timeout=HTTP_TIMEOUT)
    except requests.exceptions.RequestException as e:
        return False, f"HTTP request failed: {e}"

    status = r.status_code
    ctype = r.headers.get("content-type", "")
    
    if status == 200 and ctype.startswith("image"):
        timestamp = int(time.time())
        out_fname = f"hf_http_{scene_name.lower().replace(' ', '_')}_{sanitize_filename(model)}_{timestamp}.png"
        img_path = os.path.join("static", out_fname)
        
        try:
            with open(img_path, "wb") as f:
                f.write(r.content)
            logger.info(f"✅ Saved image: {out_fname}")
            return True, out_fname
        except Exception as e:
            return False, f"Failed to write image file: {e}"

    # Handle JSON error response
    try:
        j = r.json()
        return False, f"Status {status}: {j}"
    except Exception:
        return False, f"Status {status}: {r.text[:400]}"

def generate_real_image_huggingface(prompt, scene_name, art_style="cartoon"):
    """Generate REAL images using Hugging Face API - FROM ORIGINAL WORKING CODE"""
    
    if TOKEN is None or TOKEN.strip() == "" or TOKEN.startswith("<PASTE"):
        logger.error("❌ No Hugging Face token found")
        return None
    
    # Clean and enhance the prompt
    clean_prompt = prompt.replace('\n', ' ').strip()
    if len(clean_prompt) > 100:
        clean_prompt = clean_prompt[:100]
    
    # Create style-specific prompt
    style_prompts = {
        "cartoon": "cartoon style, animated, colorful, simple, child-friendly",
        "realistic": "photorealistic, detailed, high quality, professional",
        "anime": "anime style, manga, vibrant colors, detailed",
        "watercolor": "watercolor painting, soft colors, artistic, painted"
    }
    
    style_text = style_prompts.get(art_style, "digital art, colorful")
    full_prompt = f"{clean_prompt}, {style_text}, storybook illustration, high quality"
    
    logger.info(f"🎨 REAL IMAGE GENERATION for {scene_name} with prompt: {full_prompt[:60]}...")
    
    # Try each model in sequence - FROM ORIGINAL WORKING METHOD
    for model in MODEL_CANDIDATES:
        logger.info(f"🔄 Trying model: {model}")
        
        # 1) Try InferenceClient first (preferred)
        if HAS_CLIENT:
            ok, result = try_with_inference_client(full_prompt, model, scene_name)
            if ok:
                logger.info(f"✅ InferenceClient SUCCESS for {scene_name}! File: {result}")
                return result
            else:
                logger.warning(f"⚠️ InferenceClient failed: {result}")

        # 2) Try HTTP API fallback
        ok, result = try_with_http_api(full_prompt, model, scene_name)
        if ok:
            logger.info(f"✅ HTTP API SUCCESS for {scene_name}! File: {result}")
            return result
        else:
            logger.warning(f"⚠️ HTTP API failed: {result}")
            time.sleep(2)  # Brief pause before trying next model
    
    # If all models failed
    logger.error(f"❌ All Hugging Face models failed for {scene_name}")
    return None

def create_beautiful_fallback(scene_name, story_text, art_style):
    """Create beautiful fallback image when API fails"""
    try:
        logger.info(f"🎨 Creating fallback image for {scene_name}...")
        
        # Create high-quality fallback
        img = Image.new('RGB', (512, 512), color='#1a1a2e')
        draw = ImageDraw.Draw(img)
        
        # Art style color schemes
        color_schemes = {
            "cartoon": {"bg": "#ff6b6b", "accent": "#4ecdc4", "text": "#ffffff"},
            "realistic": {"bg": "#2c3e50", "accent": "#3498db", "text": "#ecf0f1"},
            "anime": {"bg": "#8e44ad", "accent": "#f39c12", "text": "#ffffff"},
            "watercolor": {"bg": "#74b9ff", "accent": "#fd79a8", "text": "#2d3436"},
            "default": {"bg": "#4a5568", "accent": "#ed8936", "text": "#f7fafc"}
        }
        
        colors = color_schemes.get(art_style, color_schemes["default"])
        
        # Create gradient background
        bg_rgb = tuple(int(colors["bg"][i:i+2], 16) for i in (1, 3, 5))
        accent_rgb = tuple(int(colors["accent"][i:i+2], 16) for i in (1, 3, 5))
        
        for y in range(512):
            blend = y / 512
            r = int(bg_rgb[0] * (1-blend) + accent_rgb[0] * blend)
            g = int(bg_rgb[1] * (1-blend) + accent_rgb[1] * blend)
            b = int(bg_rgb[2] * (1-blend) + accent_rgb[2] * blend)
            draw.line([(0, y), (512, y)], fill=(r, g, b))
        
        # Add decorative elements
        scene_elements = {
            "Introduction": "✨ 🏰 ✨",
            "Rising Action": "⚡ 🗡️ ⚡", 
            "Climax": "💥 ⭐ 💥",
            "Resolution": "🌟 👑 🌟"
        }
        
        decoration = scene_elements.get(scene_name, "🎨 ✨ 🎨")
        
        # Load fonts
        try:
            title_font = ImageFont.truetype("arial.ttf", 32)
            text_font = ImageFont.truetype("arial.ttf", 16)
        except:
            title_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
        # Add text content
        lines = [
            decoration,
            "",
            scene_name.upper(),
            "",
            "🎨 AI Image Loading...", 
            "Real images coming soon",
            "",
            "📖 Story Preview:",
            story_text[:50] + "..." if len(story_text) > 50 else story_text,
            "",
            f"🎭 Style: {art_style.title()}",
            "✨ Please wait..."
        ]
        
        y_pos = 80
        for i, line in enumerate(lines):
            if line:
                font = title_font if i in [0, 2] else text_font
                color = accent_rgb if i in [0, 2] else (255, 255, 255)
                
                # Center text
                bbox = draw.textbbox((0, 0), line, font=font)
                text_width = bbox[2] - bbox[0]
                x_pos = (512 - text_width) // 2
                
                # Add shadow
                draw.text((x_pos + 1, y_pos + 1), line, fill=(0, 0, 0, 128), font=font)
                draw.text((x_pos, y_pos), line, fill=color, font=font)
            
            y_pos += 35 if i in [0, 2] else 25
        
        # Save fallback image
        timestamp = int(time.time())
        img_filename = f"fallback_{scene_name.lower().replace(' ', '_')}_{timestamp}.png"
        img_path = os.path.join("static", img_filename)
        img.save(img_path, "PNG", quality=95)
        
        logger.info(f"✅ Created fallback image: {img_filename}")
        return img_filename
        
    except Exception as e:
        logger.error(f"❌ Error creating fallback image: {e}")
        return None

def generate_image_with_fallback(prompt, scene_name, art_style="cartoon"):
    """Generate real image with fallback - RESTORED WORKING METHOD"""
    
    # Method 1: Try Hugging Face API (REAL IMAGES)
    try:
        logger.info(f"🎨 Method 1: Hugging Face API for {scene_name}...")
        result = generate_real_image_huggingface(prompt, scene_name, art_style)
        if result:
            logger.info(f"🎉 REAL IMAGE SUCCESS for {scene_name}!")
            return result
    except Exception as e:
        logger.warning(f"⚠️ Method 1 failed: {e}")
    
    # Method 2: Beautiful fallback image
    try:
        logger.info(f"🎨 Method 2: Creating beautiful fallback for {scene_name}...")
        result = create_beautiful_fallback(scene_name, prompt, art_style)
        if result:
            logger.info(f"✅ Fallback image created for {scene_name}!")
            return result
    except Exception as e:
        logger.warning(f"⚠️ Method 2 failed: {e}")
    
    # Method 3: Emergency fallback (shouldn't reach here)
    logger.error(f"❌ All methods failed for {scene_name}")
    return None

@app.route('/generate', methods=['POST'])
def generate():
    """FAST generation with REAL images"""
    start_time = time.time()
    
    try:
        # Quick validation
        if not request.is_json:
            return jsonify({"error": "JSON required"}), 400
            
        data = request.json
        story_idea = data.get("story_idea", "").strip()
        genre = data.get("genre", "fantasy")
        tone = data.get("tone", "lighthearted")
        art_style = data.get("art_style", "cartoon")
        audience = data.get("audience", "all")
        characters = data.get("characters", [])

        if not story_idea:
            return jsonify({"error": "Story idea required"}), 400

        # PHASE 1: INSTANT story generation
        story = generate_lightning_story(story_idea, genre, tone, audience, characters, art_style)
        
        # PHASE 2: PARALLEL image generation with REAL images
        scenes = ["Introduction", "Rising Action", "Climax", "Resolution"]
        images = {}
        
        def generate_scene_image(scene):
            try:
                # Create more specific prompts for each scene
                scene_prompts = {
                    "Introduction": f"opening scene, {story_idea}, beginning of adventure, {', '.join(characters) if characters else 'main character'}, {art_style} style",
                    "Rising Action": f"action scene, {story_idea}, challenges and obstacles, {', '.join(characters) if characters else 'heroes'}, {art_style} style",
                    "Climax": f"dramatic climax, {story_idea}, most exciting moment, {', '.join(characters) if characters else 'protagonist'}, {art_style} style",
                    "Resolution": f"happy ending, {story_idea}, celebration, {', '.join(characters) if characters else 'characters'}, {art_style} style"
                }
                
                # Use enhanced prompt or fallback to original
                enhanced_prompt = scene_prompts.get(scene, f"{story_idea}, {story[scene][:60]}, {scene.lower()}")
                result = generate_image_with_fallback(enhanced_prompt, scene, art_style)
                return scene, result
            except Exception as e:
                logger.error(f"Error in generate_scene_image for {scene}: {e}")
                return scene, None
        
        # Use ThreadPoolExecutor for parallel image generation
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            future_to_scene = {
                executor.submit(generate_scene_image, scene): scene 
                for scene in scenes
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_scene, timeout=60):  # Allow more time for real images
                try:
                    scene, img_filename = future.result()
                    if img_filename:
                        images[scene] = f"/static/{img_filename}"
                    else:
                        images[scene] = None
                except Exception as e:
                    scene = future_to_scene[future]
                    images[scene] = None
                    logger.error(f"Error generating image for {scene}: {e}")

        # Ensure all scenes have entries
        for scene in scenes:
            if scene not in images:
                images[scene] = None

        generation_time = time.time() - start_time
        successful_images = sum(1 for img in images.values() if img is not None)
        
        logger.info(f"⚡ GENERATION COMPLETE: {generation_time:.2f}s, {successful_images}/4 images")

        return jsonify({
            "success": True,
            "story": story,
            "images": images,
            "metadata": {
                "genre": genre,
                "tone": tone,
                "art_style": art_style,
                "audience": audience,
                "images_generated": successful_images,
                "total_scenes": len(scenes),
                "generation_time": f"{generation_time:.2f}s",
                "story_method": "lightning_templates",
                "image_method": "huggingface_api_real_images",
                "generation_method": "restored_working_method"
            }
        })

    except Exception as e:
        logger.error(f"Generation error: {e}")
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500

@app.route('/static/<filename>')
def serve_static(filename):
    """Serve static files with caching"""
    try:
        response = send_from_directory('static', filename)
        response.cache_control.max_age = 3600  # 1 hour cache
        return response
    except Exception:
        return jsonify({"error": "File not found"}), 404

@app.route('/health', methods=['GET'])
def health_check():
    """Health check"""
    return jsonify({
        "status": "⚡ REAL IMAGE GENERATION",
        "story_generation": "instant_templates",
        "image_generation": "huggingface_api_real_images",
        "cache_status": f"Stories: {len(story_cache)}, Images: {len(image_cache)}",
        "has_inference_client": HAS_CLIENT,
        "token_configured": bool(TOKEN)
    })

@app.route('/test', methods=['GET'])
def test_endpoint():
    """Test endpoint"""
    return jsonify({
        "message": "⚡ Real Image Generation Backend Ready!",
        "timestamp": time.time(),
        "huggingface_client": HAS_CLIENT,
        "models": len(MODEL_CANDIDATES),
        "method": "restored_original_working_code"
    })

# Cleanup old files to save space
def cleanup_old_files():
    """Enhanced cleanup with better file management"""
    try:
        static_dir = "static"
        if not os.path.exists(static_dir):
            return
            
        current_time = time.time()
        cleanup_count = 0
        
        for filename in os.listdir(static_dir):
            file_path = os.path.join(static_dir, filename)
            if os.path.isfile(file_path):
                # Delete files older than 1 hour
                file_age = current_time - os.path.getmtime(file_path)
                if file_age > 3600:  # 1 hour = 3600 seconds
                    try:
                        os.remove(file_path)
                        cleanup_count += 1
                        logger.info(f"🗑️ Cleaned up old file: {filename}")
                    except Exception as e:
                        logger.error(f"Error removing {filename}: {e}")
        
        if cleanup_count > 0:
            logger.info(f"✅ Cleanup completed: {cleanup_count} files removed")
    except Exception as e:
        logger.error(f"Cleanup error: {e}")

@app.route('/cleanup', methods=['POST'])
def manual_cleanup():
    """Manual cleanup endpoint for testing"""
    try:
        cleanup_old_files()
        return jsonify({"success": True, "message": "Cleanup completed"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_storybook_pdf(story_data, images_data, story_options):
    """Create a beautiful, branded storybook PDF with decorative elements and page borders"""
    try:
        if not HAS_REPORTLAB:
            return None, "PDF generation not available - reportlab not installed"
        
        # Create PDF filename
        timestamp = int(time.time())
        story_title = story_data.get('title', 'My Story').replace(' ', '_')
        pdf_filename = f"storybook_{story_title}_{timestamp}.pdf"
        pdf_path = os.path.join("static", pdf_filename)
        
        # Custom page template with decorative borders
        def add_page_border(canvas, doc):
            """Add decorative border to each page"""
            # Page dimensions
            width, height = A4
            margin = 30
            
            # Set line width for border
            canvas.setLineWidth(3)
            
            # Outer decorative border (thick)
            canvas.setStrokeColor(colors.HexColor('#f97316'))  # Orange
            canvas.rect(margin, margin, width - 2*margin, height - 2*margin, fill=0, stroke=1)
            
            # Inner decorative border (thin)
            canvas.setLineWidth(1)
            canvas.setStrokeColor(colors.HexColor('#2c5530'))  # Green
            canvas.rect(margin + 15, margin + 15, width - 2*(margin + 15), height - 2*(margin + 15), fill=0, stroke=1)
            
            # Corner decorations
            corner_size = 20
            corners = [
                (margin + 5, height - margin - 5),  # Top left
                (width - margin - 5, height - margin - 5),  # Top right
                (margin + 5, margin + 5),  # Bottom left
                (width - margin - 5, margin + 5),  # Bottom right
            ]
            
            canvas.setFillColor(colors.HexColor('#f97316'))
            for x, y in corners:
                canvas.circle(x, y, 8, fill=1, stroke=0)
                canvas.setFillColor(colors.HexColor('#2c5530'))
                canvas.circle(x, y, 4, fill=1, stroke=0)
                canvas.setFillColor(colors.HexColor('#f97316'))
        
        # Create the PDF document with custom template
        doc = SimpleDocTemplate(pdf_path, pagesize=A4, 
                              leftMargin=1*inch, rightMargin=1*inch,
                              topMargin=1*inch, bottomMargin=1*inch)
        
        # Get styles and create custom ones
        styles = getSampleStyleSheet()
        story = []
        
        # Brand colors for different page types
        colors_scheme = {
            'cover': {'bg': colors.HexColor('#f0f9f0'), 'border': colors.HexColor('#2c5530')},
            'introduction': {'bg': colors.HexColor('#fff7ed'), 'border': colors.HexColor('#f97316')},
            'rising_action': {'bg': colors.HexColor('#fef3f2'), 'border': colors.HexColor('#dc2626')},
            'climax': {'bg': colors.HexColor('#f3f4f6'), 'border': colors.HexColor('#374151')},
            'resolution': {'bg': colors.HexColor('#f0fdf4'), 'border': colors.HexColor('#16a34a')}
        }
        
        # Enhanced decorative styles
        title_style = ParagraphStyle(
            'BrandTitle',
            parent=styles['Heading1'],
            fontSize=36,
            spaceAfter=50,
            spaceBefore=30,
            alignment=1,  # Center
            textColor=colors.HexColor('#2c5530'),
            fontName='Helvetica-Bold',
            borderWidth=4,
            borderColor=colors.HexColor('#f97316'),
            borderPadding=20,
            backColor=colors.HexColor('#f0f9f0'),
            borderRadius=15
        )
        
        brand_subtitle = ParagraphStyle(
            'BrandSubtitle',
            parent=styles['Heading2'],
            fontSize=20,
            spaceAfter=25,
            spaceBefore=15,
            alignment=1,
            textColor=colors.HexColor('#f97316'),
            fontName='Helvetica-Bold'
        )
        
        chapter_style = ParagraphStyle(
            'DecorativeChapter',
            parent=styles['Heading2'], 
            fontSize=26,
            spaceAfter=25,
            spaceBefore=35,
            alignment=1,
            textColor=colors.HexColor('#2c5530'),
            fontName='Helvetica-Bold',
            borderWidth=3,
            borderColor=colors.HexColor('#f97316'),
            borderPadding=15,
            backColor=colors.HexColor('#fff7ed'),
            leftIndent=40,
            rightIndent=40,
            borderRadius=12
        )
        
        story_style = ParagraphStyle(
            'StoryText',
            parent=styles['Normal'],
            fontSize=16,
            spaceAfter=25,
            spaceBefore=15,
            leftIndent=40,
            rightIndent=40,
            leading=24,
            fontName='Helvetica',
            textColor=colors.HexColor('#1f2937'),
            backColor=colors.HexColor('#fefefe'),
            borderPadding=15
        )
        
        info_style = ParagraphStyle(
            'InfoText',
            parent=styles['Normal'],
            fontSize=13,
            spaceAfter=20,
            leftIndent=30,
            rightIndent=30,
            textColor=colors.HexColor('#6b7280'),
            backColor=colors.HexColor('#f8fafc'),
            borderWidth=2,
            borderColor=colors.HexColor('#e2e8f0'),
            borderPadding=15,
            borderRadius=10
        )
        
        # === COVER PAGE ===
        # Brand header with decorative elements
        story.append(Paragraph("✨📚 EpicTales AI 📚✨", brand_subtitle))
        story.append(Spacer(1, 0.4*inch))
        
        # Main title with enhanced decoration
        title_text = story_data.get('title', 'My Epic Story')
        story.append(Paragraph(f"🌟 {title_text} 🌟", title_style))
        story.append(Spacer(1, 0.5*inch))
        
        # Story information with enhanced formatting
        characters_text = ", ".join(story_options.get('characters', [])) if story_options.get('characters') else "Various Characters"
        
        info_html = f"""
        <b>� ✨ Story Information ✨ 📚</b><br/>
        <br/>
        🎭 <b>Genre:</b> {story_options.get('genre', 'Fantasy').title()}<br/>
        🎨 <b>Art Style:</b> {story_options.get('art_style', 'Cartoon').title()}<br/>
        😊 <b>Tone:</b> {story_options.get('tone', 'Lighthearted').title()}<br/>
        👥 <b>Target Audience:</b> {story_options.get('audience', 'All ages').title()}<br/>
        🎪 <b>Main Characters:</b> {characters_text}<br/>
        <br/>
        <i>🌟 Crafted with Magic by EpicTales AI 🌟</i><br/>
        <i>Where Stories Come to Life! ✨</i>
        """
        
        story.append(Paragraph(info_html, info_style))
        story.append(Spacer(1, 0.5*inch))
        
        # Add cover image with decorative frame
        if images_data.get('Introduction'):
            intro_image_url = images_data['Introduction']
            if intro_image_url.startswith('/static/'):
                intro_image_path = intro_image_url[8:]
                full_image_path = os.path.join("static", intro_image_path)
                if os.path.exists(full_image_path):
                    try:
                        story.append(Paragraph("🖼️ ✨ Cover Illustration ✨ 🖼️", brand_subtitle))
                        story.append(Spacer(1, 0.3*inch))
                        
                        # Create image with decorative frame effect
                        img = RLImage(full_image_path, width=5*inch, height=3.75*inch)
                        story.append(img)
                        story.append(Spacer(1, 0.4*inch))
                    except Exception as e:
                        logger.error(f"Error adding cover image: {e}")
        
        # Enhanced footer for cover page
        story.append(Spacer(1, 0.6*inch))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=12,
            alignment=1,
            textColor=colors.HexColor('#8B4513'),
            spaceAfter=15,
            borderWidth=2,
            borderColor=colors.HexColor('#f97316'),
            borderPadding=10,
            backColor=colors.HexColor('#fef3f2')
        )
        story.append(Paragraph("🌐 www.epictales-ai.com | Create Magical Stories with AI! 🌟", footer_style))
        story.append(PageBreak())
        
        # === STORY CHAPTERS WITH COLORED PAGES ===
        scenes = ["Introduction", "Rising Action", "Climax", "Resolution"]
        scene_titles = {
            "Introduction": "� Chapter 1: The Beginning",
            "Rising Action": "⚡ Chapter 2: The Adventure Unfolds", 
            "Climax": "🔥 Chapter 3: The Greatest Challenge",
            "Resolution": "🌟 Chapter 4: A Happy Ending"
        }
        
        scene_emojis = {
            "Introduction": "🌅",
            "Rising Action": "⚔️", 
            "Climax": "💥",
            "Resolution": "🎉"
        }
        
        for i, scene in enumerate(scenes):
            if not story_data.get(scene):
                continue
                
            # Enhanced decorative chapter header
            chapter_title = f"{scene_emojis[scene]} {scene_titles[scene]} {scene_emojis[scene]}"
            story.append(Paragraph(chapter_title, chapter_style))
            story.append(Spacer(1, 0.4*inch))
            
            # Scene image with beautiful decorative frame
            if images_data.get(scene):
                image_url = images_data[scene]
                if image_url.startswith('/static/'):
                    image_filename = image_url[8:]
                    full_image_path = os.path.join("static", image_filename)
                    if os.path.exists(full_image_path):
                        try:
                            # Add image title
                            img_title_style = ParagraphStyle(
                                'ImageTitle',
                                parent=styles['Normal'],
                                fontSize=14,
                                alignment=1,
                                textColor=colors.HexColor('#f97316'),
                                fontName='Helvetica-Bold',
                                spaceAfter=15
                            )
                            story.append(Paragraph(f"✨ {scene} Illustration ✨", img_title_style))
                            
                            # Enhanced image with frame effect
                            story.append(Spacer(1, 0.2*inch))
                            img = RLImage(full_image_path, width=6*inch, height=4.5*inch)
                            story.append(img)
                            story.append(Spacer(1, 0.4*inch))
                        except Exception as e:
                            logger.error(f"Error adding image for {scene}: {e}")
            
            # Scene text with enhanced decorative formatting
            scene_text = story_data.get(scene, "")
            if scene_text:
                # Enhanced first letter effect with scene-specific styling
                if len(scene_text) > 1:
                    first_letter = scene_text[0].upper()
                    rest_text = scene_text[1:]
                    scene_color = ['#f97316', '#dc2626', '#374151', '#16a34a'][i]
                    formatted_text = f"<font size='32' color='{scene_color}'><b>{first_letter}</b></font>{rest_text}"
                    
                    # Scene-specific story style
                    scene_story_style = ParagraphStyle(
                        f'SceneStory{i}',
                        parent=story_style,
                        backColor=colors_scheme[list(colors_scheme.keys())[i+1]]['bg'],
                        borderWidth=2,
                        borderColor=colors_scheme[list(colors_scheme.keys())[i+1]]['border'],
                        borderRadius=10
                    )
                    
                    story.append(Paragraph(formatted_text, scene_story_style))
                else:
                    story.append(Paragraph(scene_text, story_style))
                
                story.append(Spacer(1, 0.5*inch))
            
            # Add decorative separator except for last scene
            if i < len(scenes) - 1:
                separator_style = ParagraphStyle(
                    'Separator',
                    parent=styles['Normal'],
                    fontSize=20,
                    alignment=1,
                    textColor=colors.HexColor('#f97316'),
                    spaceAfter=30,
                    spaceBefore=30
                )
                story.append(Paragraph("✨ ⭐ 🌟 ⭐ ✨", separator_style))
                story.append(PageBreak())
        
        # === ENHANCED BACK PAGE ===
        story.append(PageBreak())
        story.append(Spacer(1, 1.5*inch))
        
        back_page_style = ParagraphStyle(
            'BackPage',
            parent=styles['Normal'],
            fontSize=16,
            alignment=1,
            textColor=colors.HexColor('#2c5530'),
            spaceAfter=25,
            borderWidth=2,
            borderColor=colors.HexColor('#f97316'),
            borderPadding=15,
            backColor=colors.HexColor('#f0f9f0'),
            borderRadius=10
        )
        
        story.append(Paragraph("🎉 ✨ Thank You for Reading! ✨ 🎉", title_style))
        story.append(Spacer(1, 0.6*inch))
        story.append(Paragraph("🌟 This magical story was lovingly created with EpicTales AI 🌟", back_page_style))
        story.append(Paragraph("✨ Where imagination meets artificial intelligence ✨", back_page_style))
        story.append(Spacer(1, 0.4*inch))
        story.append(Paragraph("🚀 Ready for your next adventure? 🚀", back_page_style))
        story.append(Paragraph("🌐 Visit: www.epictales-ai.com 🌐", brand_subtitle))
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("📚 Create • Imagine • Inspire 📚", back_page_style))
        
        # Build the PDF with custom page template
        doc.build(story, onFirstPage=add_page_border, onLaterPages=add_page_border)
        
        logger.info(f"✅ Enhanced decorative PDF created successfully: {pdf_filename}")
        return pdf_filename, None
        
    except Exception as e:
        logger.error(f"❌ Error creating enhanced PDF: {e}")
        return None, str(e)

@app.route('/download-pdf', methods=['POST'])
def download_pdf():
    """Generate and download story as PDF with automatic cleanup"""
    try:
        if not HAS_REPORTLAB:
            return jsonify({"error": "PDF generation not available"}), 500
            
        data = request.json
        story_data = data.get('story')
        images_data = data.get('images', {})
        story_options = data.get('options', {})
        
        if not story_data:
            return jsonify({"error": "Story data required"}), 400
        
        # Generate PDF
        pdf_filename, error = create_storybook_pdf(story_data, images_data, story_options)
        
        if error:
            return jsonify({"error": error}), 500
            
        if not pdf_filename:
            return jsonify({"error": "Failed to create PDF"}), 500
        
        # Return PDF file
        pdf_path = os.path.join("static", pdf_filename)
        
        def remove_file_after_send(response):
            """Remove PDF and image files after sending"""
            try:
                # Remove the PDF file
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
                    logger.info(f"🗑️ Cleaned up PDF: {pdf_filename}")
                
                # Also cleanup associated image files if they exist
                for scene in ["Introduction", "Rising Action", "Climax", "Resolution"]:
                    if images_data.get(scene):
                        image_url = images_data[scene]
                        if image_url.startswith('/static/'):
                            image_filename = image_url[8:]
                            image_path = os.path.join("static", image_filename)
                            if os.path.exists(image_path):
                                os.remove(image_path)
                                logger.info(f"🗑️ Cleaned up image: {image_filename}")
                                
            except Exception as e:
                logger.error(f"Error during cleanup: {e}")
            return response
        
        response = send_file(
            pdf_path,
            as_attachment=True,
            download_name=f"{story_data.get('title', 'My_Story').replace(' ', '_')}.pdf",
            mimetype='application/pdf'
        )
        
        # Schedule cleanup after response is sent
        response.call_on_close(lambda: remove_file_after_send(response))
        
        return response
        
    except Exception as e:
        logger.error(f"PDF download error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    import os
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    print("🎨" * 50)
    print("🎨 OPTIMIZED AI BACKEND FOR PRODUCTION")
    print("🎨" * 50)
    print("🚀 FEATURES:")
    print("   📖 Story: Lightning fast templates")
    print("   🎨 Images: REAL Hugging Face API generation")
    print("   💾 Caching: Smart memory cache with limits") 
    print("   🔄 Fallback: Beautiful fallback images")
    print("   ⚡ Speed: Optimized for real images")
    print("   🧹 Memory: Auto cleanup & management")
    print("   📊 Monitoring: Memory usage tracking")
    print("   🗂️ Files: Auto cleanup old files")
    print("🎨" * 50)
    
    # Initial memory report
    initial_memory = get_memory_usage()
    print(f"💾 Initial memory usage: {initial_memory:.2f} MB")
    
    # Get configuration from environment variables
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', '5000'))
    
    print(f"🌐 Server starting on {host}:{port}")
    print(f"🐛 Debug mode: {debug_mode}")
    print(f"🔑 HuggingFace token: {'✅ Configured' if TOKEN else '❌ Missing'}")
    print(f"📦 InferenceClient: {'✅ Available' if HAS_CLIENT else '❌ Install huggingface-hub'}")
    print(f"📄 PDF Generation: {'✅ Available' if HAS_REPORTLAB else '❌ Install reportlab'}")
    print(f"🧹 Memory Management: ✅ Active")
    print(f"📊 Process Monitoring: ✅ Active")
    
    try:
        app.run(debug=debug_mode, host=host, port=port, threaded=True)
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        periodic_cleanup()
        print("✅ Cleanup completed")
    except Exception as e:
        print(f"❌ Server error: {e}")
        periodic_cleanup()

# Memory monitoring middleware
@app.before_request
def before_request():
    """Monitor memory usage before each request"""
    memory_mb = get_memory_usage()
    if memory_mb > 500:  # If memory usage exceeds 500MB
        logger.warning(f"High memory usage detected: {memory_mb:.2f} MB")
        cleanup_memory()
        manage_cache_size()

@app.after_request
def after_request(response):
    """Memory cleanup after request if needed"""
    memory_mb = get_memory_usage()
    if memory_mb > 300:  # Cleanup if over 300MB
        cleanup_memory()
    return response

# Health check endpoint for monitoring
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint with memory stats"""
    memory_mb = get_memory_usage()
    return jsonify({
        "status": "healthy",
        "memory_usage_mb": round(memory_mb, 2),
        "cache_sizes": {
            "story_cache": len(story_cache),
            "image_cache": len(image_cache)
        },
        "timestamp": time.time()
    })

# Memory stats endpoint
@app.route('/stats', methods=['GET'])
def stats():
    """Get detailed server statistics"""
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    
    return jsonify({
        "memory": {
            "rss_mb": round(memory_info.rss / 1024 / 1024, 2),
            "vms_mb": round(memory_info.vms / 1024 / 1024, 2),
            "percent": round(process.memory_percent(), 2)
        },
        "cpu_percent": round(process.cpu_percent(), 2),
        "cache_stats": {
            "story_cache_size": len(story_cache),
            "image_cache_size": len(image_cache),
            "max_cache_size": cache_max_size
        },
        "static_files": len([f for f in os.listdir('static') if f.endswith(('.png', '.jpg', '.jpeg', '.pdf'))]),
        "uptime_seconds": round(time.time() - process.create_time(), 2)
    })