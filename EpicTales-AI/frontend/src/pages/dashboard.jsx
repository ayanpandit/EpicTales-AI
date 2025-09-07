import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Users, Star, PenTool, Image, Download, ArrowLeft, Wand2, Heart, Palette } from 'lucide-react';
import Loader from '../components/loader';

const Dashboard = () => {
  // State for form inputs
  const [storyIdea, setStoryIdea] = useState('');
  const [genre, setGenre] = useState('');
  const [tone, setTone] = useState('');
  const [artStyle, setArtStyle] = useState('');
  const [audience, setAudience] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  
  // State for API response and loading
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState(null);
  const [error, setError] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('checking'); // 'checking', 'connected', 'disconnected'
  const [loadingProgress, setLoadingProgress] = useState('');
  // State for PDF download
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Backend API URL - configurable via environment
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 120000; // Increased to 2 minutes

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('disconnected');
        }
      } catch (err) {
        console.error('Connection test failed:', err);
        setConnectionStatus('disconnected');
      }
    };

    testConnection();
  }, [API_BASE_URL]);

  const characters = [
    { id: 1, name: 'Princess', emoji: '👸', description: 'A brave and kind princess' },
    { id: 2, name: 'Knight', emoji: '🛡️', description: 'A valiant knight on a quest' },
    { id: 3, name: 'Dragon', emoji: '🐲', description: 'A friendly dragon companion' },
    { id: 4, name: 'Wizard', emoji: '🧙‍♂️', description: 'A wise and magical wizard' },
    { id: 5, name: 'Fairy', emoji: '🧚‍♀️', description: 'A magical fairy helper' },
    { id: 6, name: 'Owl', emoji: '🦉', description: 'A wise owl guide' },
  ];

  const genres = [
    { value: 'fantasy', label: 'Fantasy', icon: '🏰' },
    { value: 'adventure', label: 'Adventure', icon: '🗺️' },
    { value: 'mystery', label: 'Mystery', icon: '🔍' },
    { value: 'comedy', label: 'Comedy', icon: '😄' },
    { value: 'fairy-tale', label: 'Fairy Tale', icon: '✨' },
  ];

  const tones = [
    { value: 'lighthearted', label: 'Lighthearted', icon: '😊' },
    { value: 'adventurous', label: 'Adventurous', icon: '⚡' },
    { value: 'magical', label: 'Magical', icon: '🔮' },
    { value: 'educational', label: 'Educational', icon: '📚' },
  ];

  const artStyles = [
    { value: 'cartoon', label: 'Cartoon', icon: '🎨' },
    { value: 'watercolor', label: 'Watercolor', icon: '🖌️' },
    { value: 'digital', label: 'Digital Art', icon: '💻' },
    { value: 'storybook', label: 'Classic Storybook', icon: '📖' },
  ];

  const audiences = [
    { value: 'preschool', label: 'Preschool (3-5)', icon: '👶' },
    { value: 'elementary', label: 'Elementary (6-10)', icon: '🎒' },
    { value: 'middle', label: 'Middle Grade (11-13)', icon: '📝' },
    { value: 'all', label: 'All Ages', icon: '👨‍👩‍👧‍👦' },
  ];

  const handleCharacterSelect = (character) => {
    if (selectedCharacters.find(c => c.id === character.id)) {
      setSelectedCharacters(selectedCharacters.filter(c => c.id !== character.id));
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  // Function to handle story generation
  const handleGenerateStory = async () => {
    // Validation
    if (!storyIdea.trim()) {
      setError('Please enter a story idea');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedStory(null);
    setLoadingProgress('Preparing your story...');

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    // Progress simulation
    const progressSteps = [
      { delay: 1000, message: 'Generating story text...' },
      { delay: 3000, message: 'Creating magical illustrations...' },
      { delay: 8000, message: 'Adding artistic touches...' },
      { delay: 15000, message: 'Almost ready! Finalizing images...' },
      { delay: 25000, message: 'Just a few more seconds...' }
    ];

    let progressTimeout;
    const updateProgress = (stepIndex = 0) => {
      if (stepIndex < progressSteps.length && loading) {
        const step = progressSteps[stepIndex];
        progressTimeout = setTimeout(() => {
          setLoadingProgress(step.message);
          updateProgress(stepIndex + 1);
        }, step.delay);
      }
    };

    updateProgress();

    try {
      // Prepare request data
      const requestData = {
        story_idea: storyIdea.trim(),
        genre: genre || 'fantasy',
        tone: tone || 'lighthearted',
        art_style: artStyle || 'cartoon',
        audience: audience || 'all',
        characters: selectedCharacters.map(char => char.name)
      };

      console.log('Sending request to:', `${API_BASE_URL}/generate`);
      console.log('Request data:', requestData);

      const response = await fetch(`${API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      clearTimeout(progressTimeout);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Response received:', data);
      
      if (data.success) {
        setGeneratedStory(data);
        setLoadingProgress('Story generated successfully!');
        
        // Show success message briefly
        setTimeout(() => setLoadingProgress(''), 2000);
        
        // Display warning if some images failed
        if (data.warning) {
          console.warn('Generation warning:', data.warning);
        }
      } else {
        setError(data.error || 'Failed to generate story');
      }

    } catch (err) {
      clearTimeout(timeoutId);
      clearTimeout(progressTimeout);
      console.error('Error generating story:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timed out. The story is taking longer than expected. Please try with a simpler idea or try again later.');
      } else if (err.message.includes('Failed to fetch')) {
        setError(`Cannot connect to server at ${API_BASE_URL}. Make sure the backend is running.`);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
      setLoadingProgress('');
      clearTimeout(progressTimeout);
    }
  };

  // Function to download story as PDF
  const handleDownloadPDF = async () => {
    if (!generatedStory) {
      setError('No story to download');
      return;
    }

    setDownloadingPDF(true);
    setError('');

    try {
      const requestData = {
        story: generatedStory.story,
        images: generatedStory.images,
        options: {
          genre: genre || 'fantasy',
          tone: tone || 'lighthearted',
          art_style: artStyle || 'cartoon',
          audience: audience || 'all',
          characters: selectedCharacters.map(char => char.name),
          story_idea: storyIdea
        }
      };

      console.log('Downloading PDF with data:', requestData);

      const response = await fetch(`${API_BASE_URL}/download-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(60000) // 1 minute timeout for PDF generation
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Download the PDF file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename from story title or fallback
      const storyTitle = generatedStory.story.title || storyIdea || 'My_Story';
      const filename = `${storyTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      link.download = filename;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('PDF downloaded successfully');

    } catch (err) {
      console.error('Error downloading PDF:', err);
      
      if (err.name === 'AbortError') {
        setError('PDF generation timed out. Please try again.');
      } else if (err.message.includes('Failed to fetch')) {
        setError(`Cannot connect to server. Make sure the backend is running.`);
      } else {
        setError(err.message || 'Failed to generate PDF. Please try again.');
      }
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 smooth-scroll-container gpu-accelerated">
      <div className="max-w-7xl mx-auto content-performance">
          {/* Header */}
          <div className="text-center mb-12 pt-20 smooth-fade-in">
            {/* Back to Home Button */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => window.location.hash = '#'}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-800 font-semibold text-lg ultra-smooth-transition bg-white/80 backdrop-blur-optimized px-4 py-2 rounded-full shadow-lg smooth-hover"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>

              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' :
                  connectionStatus === 'disconnected' ? 'bg-red-500' :
                  'bg-yellow-500 animate-pulse'
                }`}></div>
                <span className="text-white text-sm">
                  {connectionStatus === 'connected' ? 'Backend Connected' :
                   connectionStatus === 'disconnected' ? 'Backend Disconnected' :
                   'Checking Connection...'}
                </span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="bg-orange-100 text-orange-600 px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider">
                Story Creator
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-4">
              <span className="font-['Brush_Script_MT',_cursive] italic text-orange-600">
                Create Your Story
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Bring your imagination to life! Tell us about your story idea and watch as our AI crafts a unique tale with beautiful illustrations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Story Input */}
            <div className="space-y-8">
              {/* Story Idea Section */}
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 smooth-hover">
                    <PenTool className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Your Story Idea</h2>
                </div>
                <textarea
                  placeholder="Describe your story... What happens? Who are the characters? Where does it take place? Let your imagination run wild!"
                  value={storyIdea}
                  onChange={(e) => setStoryIdea(e.target.value)}
                  rows={6}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg resize-none bg-white/80 backdrop-blur-optimized ultra-smooth-transition"
                />
              </div>

              {/* Genre Selection */}
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 smooth-hover">
                    <BookOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Story Genre</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {genres.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => setGenre(g.value)}
                      className={`p-4 rounded-xl border-2 ultra-smooth-transition smooth-hover gpu-accelerated ${
                        genre === g.value
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 bg-white/70'
                      }`}
                    >
                      <div className="text-2xl mb-2">{g.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone & Style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tone */}
                <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-6 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                  <div className="flex items-center mb-4">
                    <Heart className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-black text-gray-900">Tone</h3>
                  </div>
                  <div className="space-y-2">
                    {tones.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`w-full p-3 rounded-xl border ultra-smooth-transition smooth-hover gpu-accelerated flex items-center ${
                          tone === t.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 bg-white/70'
                        }`}
                      >
                        <span className="mr-3">{t.icon}</span>
                        <span className="font-medium text-gray-900 text-sm">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Art Style */}
                <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-6 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                  <div className="flex items-center mb-4">
                    <Palette className="w-5 h-5 text-orange-600 mr-2" />
                    <h3 className="text-lg font-black text-gray-900">Art Style</h3>
                  </div>
                  <div className="space-y-2">
                    {artStyles.map((a) => (
                      <button
                        key={a.value}
                        onClick={() => setArtStyle(a.value)}
                        className={`w-full p-3 rounded-xl border ultra-smooth-transition smooth-hover gpu-accelerated flex items-center ${
                          artStyle === a.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-orange-300 bg-white/70'
                        }`}
                      >
                        <span className="mr-3">{a.icon}</span>
                        <span className="font-medium text-gray-900 text-sm">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Characters & Settings */}
            <div className="space-y-8">
              {/* Character Selection */}
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4 smooth-hover">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Choose Characters</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {characters.map((character) => (
                    <div
                      key={character.id}
                      onClick={() => handleCharacterSelect(character)}
                      className={`p-4 rounded-xl border-2 cursor-pointer ultra-smooth-transition smooth-hover gpu-accelerated ${
                        selectedCharacters.find(c => c.id === character.id)
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 bg-white/70'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{character.emoji}</div>
                        <h3 className="font-bold text-gray-900 mb-1 text-sm">{character.name}</h3>
                        <p className="text-xs text-gray-600">{character.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedCharacters.length > 0 && (
                  <div className="p-4 bg-orange-50 rounded-xl smooth-fade-in">
                    <h3 className="font-semibold text-orange-900 mb-2 text-sm">Selected Characters:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCharacters.map((character) => (
                        <span
                          key={character.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-200 text-orange-800 ultra-smooth-transition"
                        >
                          {character.emoji} {character.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Audience Selection */}
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                    <Star className="w-6 h-6 text-orange-600" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Target Audience</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {audiences.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => setAudience(a.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        audience === a.value
                          ? 'border-orange-500 bg-orange-50 shadow-lg'
                          : 'border-gray-200 hover:border-orange-300 bg-white/70'
                      }`}
                    >
                      <div className="text-xl mb-2">{a.icon}</div>
                      <div className="font-semibold text-gray-900 text-sm">{a.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features Overview */}
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 smooth-fade-in gpu-accelerated">
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center">
                  <Wand2 className="w-6 h-6 text-orange-600 mr-3" />
                  What You'll Get
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-green-50 rounded-xl ultra-smooth-transition smooth-hover">
                    <BookOpen className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-gray-700 font-medium">AI-generated personalized story</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-xl ultra-smooth-transition smooth-hover">
                    <Image className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700 font-medium">Beautiful custom illustrations</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-xl ultra-smooth-transition smooth-hover">
                    <Download className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-gray-700 font-medium">Downloadable PDF storybook</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-12 text-center smooth-fade-in">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 max-w-2xl mx-auto">
                {error}
              </div>
            )}
            
            <button
              onClick={handleGenerateStory}
              disabled={!storyIdea.trim() || loading}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl ultra-smooth-transition uppercase tracking-wide hover:shadow-2xl disabled:cursor-not-allowed smooth-hover gpu-accelerated"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-center mb-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Creating Your Story...
                  </div>
                  {loadingProgress && (
                    <div className="text-sm opacity-80 font-normal">
                      {loadingProgress}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Sparkles className="w-6 h-6 mr-3" />
                  Generate My Story
                </div>
              )}
            </button>
          </div>

          {/* Loading Progress Indicator */}
          {loading && (
            <div className="mt-12">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <Loader />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Creating Your Magical Story
                </h3>
                <p className="text-gray-600 mb-4">
                  {loadingProgress || 'Please wait while we generate your story...'}
                </p>
                <p className="text-sm text-gray-500">
                  This may take up to 2 minutes. Please don't close this page.
                </p>
              </div>
            </div>
          )}

          {/* Generated Story Display */}
          {generatedStory && (
            <div className="mt-12 smooth-fade-in">
              <div className="bg-white/90 backdrop-blur-optimized rounded-3xl p-8 shadow-2xl border border-orange-100 gpu-accelerated">
                <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
                  <span className="font-['Brush_Script_MT',_cursive] italic text-orange-600">
                    Your Story is Ready!
                  </span>
                </h2>
                
                <div className="space-y-8">
                  {["Introduction", "Rising Action", "Climax", "Resolution"]
                    .filter(scene => generatedStory.story[scene]) // Only show scenes that exist
                    .map((scene) => (
                    <div key={scene} className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl border border-orange-200 smooth-fade-in gpu-accelerated observe-intersection">
                      <h3 className="text-2xl font-bold text-orange-700 mb-4 capitalize">{scene.replace('_', ' ')}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg mb-6">{generatedStory.story[scene]}</p>
                      
                      {/* Display image if available */}
                      {generatedStory.images[scene] && (
                        <div className="flex justify-center">
                          <img 
                            src={`${API_BASE_URL}${generatedStory.images[scene]}`}
                            alt={`${scene} illustration`}
                            className="max-w-md w-full rounded-2xl shadow-xl border-4 border-white ultra-smooth-transition smooth-hover gpu-accelerated"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Show placeholder if image failed to generate */}
                      {!generatedStory.images[scene] && (
                        <div className="flex justify-center">
                          <div className="bg-gray-100 p-8 rounded-2xl text-center text-gray-500 max-w-md w-full border-2 border-dashed border-gray-300">
                            <Image className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>Illustration for this scene is being generated...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Download Button */}
                <div className="text-center mt-8">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    className={`bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl ultra-smooth-transition smooth-hover gpu-accelerated backdrop-blur-optimized uppercase tracking-wide hover:shadow-2xl transform hover:scale-105 ${
                      downloadingPDF ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      {downloadingPDF ? (
                        <>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                          Creating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="w-6 h-6 mr-3" />
                          Download Your Storybook
                        </>
                      )}
                    </div>
                  </button>
                  <p className="text-gray-600 text-sm mt-4">
                    Download your complete story as a beautiful PDF book with all illustrations
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default Dashboard;
