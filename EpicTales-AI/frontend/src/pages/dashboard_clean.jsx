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
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">EpicTales</h1>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4">
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-600 text-white">
              <Image className="w-5 h-5" />
              <span className="font-medium">Story to Image</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer">
              <PenTool className="w-5 h-5" />
              <span className="font-medium">Text to Story</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer">
              <Wand2 className="w-5 h-5" />
              <span className="font-medium">AI Effects</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 cursor-pointer">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">My Creations</span>
            </div>
          </nav>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800">
          <div className="text-center">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-2 px-4 rounded-lg font-semibold transition-all mb-3">
              ⭐ Upgrade Now
            </button>
            <div className="text-gray-400 text-sm">
              <div>Feedback? DM us!</div>
              <div className="flex justify-center space-x-4 mt-2 text-xs">
                <span className="hover:text-white cursor-pointer">📱 Telegram</span>
                <span className="hover:text-white cursor-pointer">💬 Discord</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
              {/* Left Panel - Input */}
              <div className="space-y-6">
                {/* Prompt Card */}
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <PenTool className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Prompt</h2>
                  </div>
                  
                  <textarea
                    placeholder="Describe the story you want to create, e.g., A majestic eagle soaring through mountain peaks at golden hour..."
                    value={storyIdea}
                    onChange={(e) => setStoryIdea(e.target.value)}
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Settings Card */}
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">Settings</h3>
                  
                  {/* Model Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Model</label>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-orange-500 rounded-full"></div>
                          <span className="text-white font-medium">Story Generator</span>
                          <span className="text-purple-400 text-sm">⚡ 2 credits</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Genre Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Genre</label>
                    <div className="space-y-2">
                      {genres.map((g) => (
                        <button
                          key={g.value}
                          onClick={() => setGenre(g.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                            genre === g.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-lg">{g.icon}</span>
                          <span className="font-medium">{g.label}</span>
                          {genre === g.value && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Tone</label>
                    <div className="space-y-2">
                      {tones.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setTone(t.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                            tone === t.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-lg">{t.icon}</span>
                          <span className="font-medium">{t.label}</span>
                          {tone === t.value && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Art Style Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Art Style</label>
                    <div className="space-y-2">
                      {artStyles.map((a) => (
                        <button
                          key={a.value}
                          onClick={() => setArtStyle(a.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                            artStyle === a.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-lg">{a.icon}</span>
                          <span className="font-medium">{a.label}</span>
                          {artStyle === a.value && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audience Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Target Audience</label>
                    <div className="space-y-2">
                      {audiences.map((a) => (
                        <button
                          key={a.value}
                          onClick={() => setAudience(a.value)}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                            audience === a.value
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-lg">{a.icon}</span>
                          <span className="font-medium">{a.label}</span>
                          {audience === a.value && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Characters Selection */}
                  <div className="mb-6">
                    <label className="text-gray-300 text-sm font-medium mb-3 block">Characters</label>
                    <div className="grid grid-cols-2 gap-2">
                      {characters.map((character) => (
                        <button
                          key={character.id}
                          onClick={() => handleCharacterSelect(character)}
                          className={`p-3 rounded-lg transition-all text-center ${
                            selectedCharacters.find(c => c.id === character.id)
                              ? 'bg-purple-500 text-white'
                              : 'bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <div className="text-2xl mb-1">{character.emoji}</div>
                          <div className="text-xs font-medium">{character.name}</div>
                        </button>
                      ))}
                    </div>
                    
                    {selectedCharacters.length > 0 && (
                      <div className="mt-3 p-3 bg-purple-500/20 rounded-lg">
                        <div className="text-xs text-gray-300 mb-2">Selected:</div>
                        <div className="flex flex-wrap gap-1">
                          {selectedCharacters.map((character) => (
                            <span
                              key={character.id}
                              className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-500 text-white"
                            >
                              {character.emoji} {character.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Credits Info */}
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between text-gray-300 text-sm mb-3">
                      <span>Credits: -</span>
                      <span>Cost: 2 ⚡</span>
                    </div>
                    <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-sm transition-colors">
                      Recharge
                    </button>
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateStory}
                  disabled={!storyIdea.trim() || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Generate Story</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span>Generate Story</span>
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Right Panel - Results */}
              <div className="space-y-6">
                <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6 min-h-[700px]">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Explore Examples</h2>
                  </div>

                  {loading && (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mb-6"></div>
                      <h3 className="text-xl font-semibold text-white mb-2">Creating Your Story</h3>
                      <p className="text-gray-400 mb-4">{loadingProgress || 'Please wait while we generate your story...'}</p>
                      <p className="text-gray-500 text-sm">This may take up to 2 minutes</p>
                    </div>
                  )}

                  {!loading && !generatedStory && (
                    <div className="flex flex-col items-center justify-center h-96 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-300 mb-2">Please sign in</h3>
                      <p className="text-gray-400 mb-6">Sign in to view your generated stories</p>
                      <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">
                        Sign In
                      </button>
                    </div>
                  )}

                  {generatedStory && (
                    <div className="space-y-6">
                      {/* Story Title */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-white mb-2">{generatedStory.story.title}</h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                      </div>

                      {/* Story Sections */}
                      {["Introduction", "Rising Action", "Climax", "Resolution"]
                        .filter(scene => generatedStory.story[scene])
                        .map((scene) => (
                          <div key={scene} className="bg-gray-800 rounded-lg border border-gray-600 p-6">
                            <h4 className="text-lg font-semibold text-purple-300 mb-4">{scene}</h4>
                            <p className="text-gray-300 leading-relaxed mb-6">{generatedStory.story[scene]}</p>
                            
                            {generatedStory.images[scene] && (
                              <div className="flex justify-center">
                                <img 
                                  src={`${API_BASE_URL}${generatedStory.images[scene]}`}
                                  alt={`${scene} illustration`}
                                  className="max-w-md w-full rounded-lg border border-gray-600"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))}

                      {/* Download Button */}
                      <div className="flex justify-center pt-6">
                        <button 
                          onClick={handleDownloadPDF}
                          disabled={downloadingPDF}
                          className={`bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                            downloadingPDF ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {downloadingPDF ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              <span>Creating PDF...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5" />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
