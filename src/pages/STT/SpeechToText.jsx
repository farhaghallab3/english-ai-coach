import React, { useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SpeechToText = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText(transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);

      recognition.onend = () => setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f4f6ff] to-[#dbe8ff]">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-blue-100 p-8 text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            🎤 Speech To Text
          </h2>
          <p className="text-gray-600 mb-6">
            Speak clearly and we’ll convert your voice into text.
          </p>

          <div className="flex justify-center mb-6">
            <button
              onClick={toggleMic}
              className={`p-4 rounded-full text-white text-xl shadow-md transition-all ${
                isListening
                  ? "bg-red-500 animate-pulse"
                  : "bg-indigo-500 hover:bg-indigo-600"
              }`}
            >
              🎤
            </button>
          </div>

          <textarea
            value={text}
            readOnly
            placeholder="Your speech will appear here..."
            className="w-full h-40 p-4 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none bg-gray-50"
          />

          {text && (
            <button
              onClick={() => setText("")}
              className="mt-6 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full text-lg font-medium transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SpeechToText;
