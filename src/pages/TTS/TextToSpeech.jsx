import React, { useState, useEffect } from "react";
import { Volume2, Play, Pause, Square, Loader } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { generateTTS, playAudio } from "../../utils/ttsApi";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleSpeak = async () => {
    if (!text.trim()) {
      alert("Please write something first!");
      return;
    }

    if (isSpeaking) {
      // Stop current playback
      setIsSpeaking(false);
      return;
    }

    setIsLoading(true);
    setIsSpeaking(true);

    try {
      const audioUrl = await generateTTS(text, "bella");
      await playAudio(audioUrl, text, "bella");
    } catch (error) {
      console.error('TTS failed:', error);
      alert('Failed to generate speech. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    setIsSpeaking(false);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-8 relative bg-slate-700">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-violet-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-2xl glass-card p-8 md:p-12 scale-in relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <Volume2 />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient">
                Text to Speech
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Transform your written words into natural, lifelike speech with Bella's premium voice
            </p>
          </div>

          {/* Text Input */}
          <div className="mb-8">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here... The AI will bring it to life with natural speech!"
              className="input-field w-full h-48 text-lg resize-none"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{text.length} characters</span>
              <span>English • Natural Voice</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSpeak}
              disabled={isLoading}
              className={`btn-primary text-lg px-8 py-4 btn-hover-lift flex items-center gap-2 ${
                isSpeaking ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600' : ''
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? <Loader className="animate-spin" /> : isSpeaking ? <Pause /> : <Play />}
              {isLoading ? 'Generating...' : isSpeaking ? 'Pause' : 'Speak'}
            </button>

            {(isSpeaking || isLoading) && (
              <button
                onClick={handleStop}
                className="btn-secondary text-lg px-8 py-4 hover:bg-red-500/10 hover:border-red-400 flex items-center gap-2"
              >
                <Square />
                Stop
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 glass-card">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                💡
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Pro Tips:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use proper punctuation for natural pauses</li>
                  <li>• Bella's voice provides premium quality speech synthesis</li>
                  <li>• Practice pronunciation by listening and repeating</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TextToSpeech;
