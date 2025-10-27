import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const TextToSpeech = () => {
  const [text, setText] = useState("");

  const handleSpeak = () => {
    if (!text.trim()) return alert("Please write something first!");
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();

    // 🎙️ نختار صوت راجل إن وُجد
    const maleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("english") ||
          v.name.toLowerCase().includes("daniel")
      ) || voices[0];

    utterance.voice = maleVoice;
    utterance.pitch = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f4f6ff] to-[#dbe8ff]">
      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg rounded-3xl shadow-lg border border-blue-100 p-8 text-center">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            🔊 Text To Speech
          </h2>
          <p className="text-gray-600 mb-6">
            Type any English text below and listen to it as natural speech.
          </p>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write something to hear it..."
            className="w-full h-40 p-4 border border-blue-200 rounded-2xl focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
          />

          <button
            onClick={handleSpeak}
            className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full text-lg font-medium transition-all"
          >
            🔊 Speak
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TextToSpeech;
