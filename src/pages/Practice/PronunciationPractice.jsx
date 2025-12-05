// src/pages/PronunciationPractice.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBookOpen, FaTrophy, FaStar, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WordPractice from "../../components/WordPractice";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ownback-production.up.railway.app/api";

const PronunciationPractice = () => {
  const [levels] = useState([
    { level: "A1", name: "Beginner", description: "Basic words & phrases", color: "from-cyan-400 to-cyan-500" },
    { level: "A2", name: "Elementary", description: "Simple conversations", color: "from-violet-400 to-violet-500" },
    { level: "B1", name: "Intermediate", description: "Daily situations", color: "from-emerald-400 to-teal-500" },
    { level: "B2", name: "Upper Intermediate", description: "Complex topics", color: "from-amber-400 to-orange-500" },
    { level: "C1", name: "Advanced", description: "Professional fluency", color: "from-rose-400 to-pink-500" },
    { level: "C2", name: "Proficient", description: "Native-like speech", color: "from-indigo-400 to-purple-500" }
  ]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [completedWords, setCompletedWords] = useState(
    JSON.parse(localStorage.getItem("completedWords")) || []
  );

  useEffect(() => {
    if (selectedLevel) {
      axios
        .get(`${BASE_URL}/words/${selectedLevel}/`)
        .then((res) => setWords(res.data))
        .catch((err) => console.error("Error fetching words:", err));
    }
  }, [selectedLevel]);

  const handleCompleteWord = (word) => {
    const updated = [...completedWords, word];
    setCompletedWords(updated);
    localStorage.setItem("completedWords", JSON.stringify(updated));
    setSelectedWord(null);
  };

  const getCompletedCountForLevel = (level) => {
    return words.filter(word => completedWords.includes(word.word)).length;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow py-8 px-4 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-20 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-violet-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Level Selection */}
          {!selectedLevel && !selectedWord && (
            <div className="text-center scale-in">
              <div className="mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                    <FaBookOpen />
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-gradient">
                    Pronunciation Practice
                  </h1>
                </div>
                <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                  Master English pronunciation with AI-powered feedback. Choose your level and start practicing!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {levels.map((levelData, index) => (
                  <button
                    key={levelData.level}
                    onClick={() => setSelectedLevel(levelData.level)}
                    className="card p-6 text-left scale-in group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${levelData.color} rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {levelData.level}
                      </div>
                      <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gradient transition-all">
                      {levelData.name}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {levelData.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-violet-500 h-2 rounded-full transition-all duration-500"
                             style={{ width: '0%' }}>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">0%</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Word List */}
          {selectedLevel && !selectedWord && (
            <div className="scale-in">
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="btn-secondary flex items-center gap-2 hover:bg-slate-600"
                >
                  <FaArrowLeft />
                  Back to Levels
                </button>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-gradient mb-2">
                    {levels.find(l => l.level === selectedLevel)?.name} ({selectedLevel})
                  </h2>
                  <p className="text-gray-400">
                    {getCompletedCountForLevel(selectedLevel)} of {words.length} words completed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {words.map((word, index) => {
                  const isCompleted = completedWords.includes(word.word);
                  return (
                    <button
                      key={word.id}
                      onClick={() => setSelectedWord(word)}
                      className="card p-4 text-center scale-in group relative overflow-hidden"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {isCompleted && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}

                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 group-hover:from-cyan-400 group-hover:to-violet-500 group-hover:text-white'
                        }`}>
                          {word.word.charAt(0).toUpperCase()}
                        </div>
                      </div>

                      <h3 className={`font-bold transition-colors ${
                        isCompleted
                          ? 'text-green-300'
                          : 'text-white group-hover:text-gradient'
                      }`}>
                        {word.word}
                      </h3>

                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {word.meaning}
                      </p>

                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary */}
              <div className="mt-8 glass-card p-6 max-w-md mx-auto text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FaTrophy className="text-amber-400 text-xl" />
                  <h3 className="text-xl font-bold text-white">Your Progress</h3>
                </div>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Completed: {getCompletedCountForLevel(selectedLevel)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-300">Remaining: {words.length - getCompletedCountForLevel(selectedLevel)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Word Practice */}
          {selectedWord && (
            <WordPractice
              wordData={selectedWord}
              onComplete={handleCompleteWord}
              onBack={() => setSelectedWord(null)}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PronunciationPractice;
