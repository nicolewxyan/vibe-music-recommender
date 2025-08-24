import React, { useState } from 'react';

const VibeApp = () => {
  // State management
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Handle file upload
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Process uploaded image
  const processImage = (file) => {
    setUploadedImage(file);
    setError('');
    setResults(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Analyze image colors
  const analyzeImageColors = (imageData) => {
    const data = imageData.data;
    let totalR = 0, totalG = 0, totalB = 0;
    let brightness = 0;
    let saturation = 0;
    
    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      totalR += r;
      totalG += g;
      totalB += b;
      
      brightness += (r + g + b) / 3;
      
      // Calculate saturation
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      saturation += max - min;
    }
    
    const pixelCount = data.length / 40;
    
    return {
      avgR: totalR / pixelCount,
      avgG: totalG / pixelCount,
      avgB: totalB / pixelCount,
      brightness: brightness / pixelCount,
      saturation: saturation / pixelCount
    };
  };

  // Determine vibe based on analysis
  const determineVibe = (analysis) => {
    const { avgR, avgG, avgB, brightness, saturation } = analysis;
    
    if (brightness > 180 && saturation > 100) {
      return {
        name: "Energetic & Bright",
        description: "High energy, vibrant colors detected",
        mood: "upbeat",
        emoji: "⚡"
      };
    } else if (brightness < 100) {
      return {
        name: "Moody & Dark",
        description: "Dark, contemplative atmosphere",
        mood: "chill",
        emoji: "🌙"
      };
    } else if (avgR > avgG && avgR > avgB) {
      return {
        name: "Warm & Passionate",
        description: "Warm tones, passionate vibes",
        mood: "romantic",
        emoji: "🔥"
      };
    } else if (avgB > avgR && avgB > avgG) {
      return {
        name: "Cool & Calm",
        description: "Cool blue tones, peaceful energy",
        mood: "relaxed",
        emoji: "🌊"
      };
    } else {
      return {
        name: "Balanced & Harmonious",
        description: "Well-balanced colors and tones",
        mood: "balanced",
        emoji: "⚖️"
      };
    }
  };

  // Get song recommendation
  const getSongRecommendation = (vibe) => {
    const songDatabase = {
      upbeat: [
        { title: "Good 4 U", artist: "Olivia Rodrigo", reason: "High energy matches your vibrant image!" },
        { title: "Levitating", artist: "Dua Lipa", reason: "Bright and energetic like your photo!" },
        { title: "Blinding Lights", artist: "The Weeknd", reason: "Electric energy for your bright vibe!" }
      ],
      chill: [
        { title: "Skinny Love", artist: "Bon Iver", reason: "Moody and introspective like your image" },
        { title: "Mad World", artist: "Gary Jules", reason: "Dark atmosphere matches your photo" },
        { title: "Black", artist: "Pearl Jam", reason: "Deep and contemplative vibes" }
      ],
      romantic: [
        { title: "Golden", artist: "Harry Styles", reason: "Warm tones deserve a warm song" },
        { title: "Adorn", artist: "Miguel", reason: "Passionate vibes for passionate colors" },
        { title: "Best Part", artist: "Daniel Caesar ft. H.E.R.", reason: "Smooth warmth for your image" }
      ],
      relaxed: [
        { title: "Ocean Eyes", artist: "Billie Eilish", reason: "Cool and calming like your blue tones" },
        { title: "Holocene", artist: "Bon Iver", reason: "Peaceful energy for peaceful colors" },
        { title: "Lost in the Light", artist: "Bahamas", reason: "Serene vibes for your calm image" }
      ],
      balanced: [
        { title: "Circles", artist: "Post Malone", reason: "Well-balanced song for balanced colors" },
        { title: "Sunflower", artist: "Post Malone & Swae Lee", reason: "Harmonious vibes" },
        { title: "Watermelon Sugar", artist: "Harry Styles", reason: "Perfect balance of energy and chill" }
      ]
    };
    
    const songs = songDatabase[vibe.mood] || songDatabase.balanced;
    return songs[Math.floor(Math.random() * songs.length)];
  };

  // Analyze image function
  const analyzeImage = async () => {
    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    // Simulate processing time
    setTimeout(() => {
      try {
        // Create image element for analysis
        const img = new Image();
        img.onload = () => {
          // Create canvas to analyze image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const analysis = analyzeImageColors(imageData);
          const vibe = determineVibe(analysis);
          const song = getSongRecommendation(vibe);
          
          setResults({ vibe, song });
          setIsAnalyzing(false);
        };
        
        img.src = imagePreview;
        
      } catch (err) {
        setError('Error analyzing image. Please try again.');
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <h1 className="app-title">🎵 Vibe</h1>
      <p className="app-subtitle">Upload a photo, get a song that matches your vibe</p>

      {/* Upload Area */}
      <div 
        className="upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('fileInput').click()}
      >
        <div className="upload-icon">📸</div>
        <div className="upload-text">Click or drag an image here</div>
        <input 
          type="file" 
          id="fileInput" 
          accept="image/*" 
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div>
          <img 
            src={imagePreview} 
            alt="Uploaded preview" 
            className="image-preview"
          />
        </div>
      )}

      {/* Analyze Button */}
      {imagePreview && !isAnalyzing && (
        <button 
          onClick={analyzeImage}
          className="analyze-button"
        >
          Find My Vibe 🎶
        </button>
      )}

      {/* Loading */}
      {isAnalyzing && (
        <div className="loading">
          Analyzing your vibe... 🎨
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="results">
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
              {results.vibe.emoji}
            </div>
            <h3 className="vibe-title">
              Vibe Detected: {results.vibe.name}
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
              {results.vibe.description}
            </p>
          </div>
          
          <div className="song-recommendation">
            <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '5px' }}>
              🎵 {results.song.title}
            </h4>
            <p style={{ color: '#666', fontWeight: '500', marginBottom: '8px' }}>
              by {results.song.artist}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#888', fontStyle: 'italic' }}>
              {results.song.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VibeApp;