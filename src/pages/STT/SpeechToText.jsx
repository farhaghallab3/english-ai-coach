import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Copy, Trash2, Play, Pause } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SpeechToText = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setIsSupported(false);
    }
  }, []);

  const toggleMic = () => {
    if (!isSupported) {
      alert("Speech Recognition not supported in this browser. Try using Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimText("");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setText(prev => prev + finalTranscript);
        }
        setInterimText(interimTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        setInterimText("");
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    }
  };

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      // Could add a toast notification here
    }
  };

  const clearText = () => {
    setText("");
    setInterimText("");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-8 relative bg-slate-700">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 right-20 w-40 h-40 bg-violet-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-16 w-28 h-28 bg-cyan-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-amber-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="w-full max-w-3xl glass-card p-8 md:p-12 scale-in relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-violet-400 to-violet-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <Mic />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient">
                Speech to Text
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Speak naturally and watch your words transform into text in real-time
            </p>
            {!isSupported && (
              <p className="text-amber-400 text-sm mt-2">
                ⚠️ Speech recognition not supported in this browser. Try Chrome or Edge.
              </p>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex justify-center mb-8">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              isListening
                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                : 'bg-gray-600/50 text-white border border-gray-600'
            }`}>
              {isListening ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  Listening... Speak now
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                  Ready to listen
                </span>
              )}
            </div>
          </div>

          {/* Microphone Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={toggleMic}
              disabled={!isSupported}
              className={`relative p-8 rounded-full text-gray-400 text-3xl shadow-2xl transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? 'bg-red-500 animate-pulse shadow-red-500/50'
                  : 'btn-primary shadow-cyan-500/30 hover:shadow-cyan-500/50'
              }`}
            >
              {isListening ? <MicOff /> : <Mic />}

              {/* Ripple effect when listening */}
              {isListening && (
                <>
                  <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></div>
                  <div className="absolute inset-2 rounded-full bg-red-400 animate-ping opacity-30" style={{ animationDelay: '0.2s' }}></div>
                  <div className="absolute inset-4 rounded-full bg-red-300 animate-ping opacity-40" style={{ animationDelay: '0.4s' }}></div>
                </>
              )}
            </button>
          </div>

          {/* Text Output */}
          <div className="mb-8">
            <div className="relative">
              <textarea
                value={text + interimText}
                readOnly
                placeholder="Your speech will appear here in real-time..."
                className="input-field w-full h-48 text-lg resize-none"
              />
              {interimText && (
                <div className="absolute bottom-2 right-2 text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                  Listening...
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{text.length + interimText.length} characters</span>
              <span>English • Real-time</span>
            </div>
          </div>

          {/* Action Buttons */}
          {text && (
            <div className="flex gap-4 justify-center">
              <button
                onClick={copyToClipboard}
                className="btn-secondary text-lg px-6 py-3 hover:bg-cyan-500/10 hover:border-cyan-400 flex items-center gap-2"
              >
                <Copy />
                Copy
              </button>
              <button
                onClick={clearText}
                className="btn-secondary text-lg px-6 py-3 hover:bg-red-500/10 hover:border-red-400 flex items-center gap-2"
              >
                <Trash2 />
                Clear
              </button>
            </div>
          )}

          {/* Tips */}
          <div className="mt-8 p-4 glass-card">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-pink-500 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                💡
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Tips for best results:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Use a quiet environment for better accuracy</li>
                  <li>• Pause briefly between sentences</li>
                  <li>• The system works best with American English</li>
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

export default SpeechToText;
