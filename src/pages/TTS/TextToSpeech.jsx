import React, { useState, useEffect } from "react";
import { FaVolumeUp, FaPlay, FaPause, FaStop } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      const englishVoice = availableVoices.find(voice =>
        voice.lang.startsWith('en') &&
        (voice.name.toLowerCase().includes('male') ||
         voice.name.toLowerCase().includes('daniel') ||
         voice.name.toLowerCase().includes('english'))
      ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
      setSelectedVoice(englishVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    if (!text.trim()) {
      alert("Please write something first!");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.pitch = 1;
    utterance.rate = 0.9;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 relative">
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
                <FaVolumeUp />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient">
                Text to Speech
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Transform your written words into natural, lifelike speech
            </p>
          </div>

          {/* Voice Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Choose Voice:
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={(e) => {
                const voice = voices.find(v => v.name === e.target.value);
                setSelectedVoice(voice);
              }}
              className="input-field w-full"
            >
              {voices.filter(voice => voice.lang.startsWith('en')).map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
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
              className={`btn-primary text-lg px-8 py-4 btn-hover-lift flex items-center gap-2 ${
                isSpeaking ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600' : ''
              }`}
            >
              {isSpeaking ? <FaPause /> : <FaPlay />}
              {isSpeaking ? 'Pause' : 'Speak'}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStop}
                className="btn-secondary text-lg px-8 py-4 hover:bg-red-500/10 hover:border-red-400 flex items-center gap-2"
              >
                <FaStop />
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
                  <li>• Try different voices to find your favorite</li>
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
