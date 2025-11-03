// src/pages/PronunciationPractice.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import WordPractice from "../../components/WordPractice";

const BASE_URL = "https://farha31.pythonanywhere.com/api";

const PronunciationPractice = () => {
  const [levels] = useState(["A1", "A2", "B1", "B2", "C1", "C2"]);
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
    alert(`🎉 You finished practicing "${word}"!`);
    setSelectedWord(null);
  };

  return (
    <>
      <Navbar />
      <div className="p-16 text-center">
        {/* Level Selection */}
        {!selectedLevel && !selectedWord && (
          <>
            <h1 className="text-2xl font-bold mb-6">🎯 Choose Your Level</h1>
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  {level}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Word List */}
        {selectedLevel && !selectedWord && (
          <>
            <button
              onClick={() => setSelectedLevel(null)}
              className="mb-4 text-blue-600 underline"
            >
              ← Back to Levels
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Words in {selectedLevel}
            </h2>
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              {words.map((word) => (
                <button
                  key={word.id}
                  onClick={() => setSelectedWord(word)}
                  className={`p-3 border rounded-xl hover:bg-gray-100 ${
                    completedWords.includes(word.word)
                      ? "bg-green-200 border-green-400"
                      : ""
                  }`}
                >
                  {word.word}
                </button>
              ))}
            </div>
          </>
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
    </>
  );
};

export default PronunciationPractice;
