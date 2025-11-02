import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

const BASE_URL = "https://farha31.pythonanywhere.com/api";

const PronunciationPractice = () => {
  const [levels, setLevels] = useState(["A1", "A2", "B1", "B2", "C1", "C2"]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    if (selectedLevel) {
      axios
        .get(`${BASE_URL}/words/${selectedLevel}/`)
        .then((res) => setWords(res.data))
        .catch((err) => console.error("Error fetching words:", err));
    }
  }, [selectedLevel]);

  return (
    <>
    <Navbar/>
    <div className="p-16 text-center">
      
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

      {selectedLevel && !selectedWord && (
        <>
          <button
            onClick={() => setSelectedLevel(null)}
            className="mb-4 text-blue-600 underline"
          >
            ← Back to Levels
          </button>
          <h2 className="text-xl font-semibold mb-4">Words in {selectedLevel}</h2>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {words.map((word) => (
              <button
                key={word.id}
                onClick={() => setSelectedWord(word)}
                className="p-3 border rounded-xl hover:bg-gray-100"
              >
                {word.word}
              </button>
            ))}
          </div>
        </>
      )}

      {selectedWord && (
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => setSelectedWord(null)}
            className="mb-4 text-blue-600 underline"
          >
            ← Back to {selectedLevel} Words
          </button>

          <h2 className="text-2xl font-bold mb-2">{selectedWord.word}</h2>
          <p className="text-gray-700 mb-4">{selectedWord.meaning}</p>

          <h3 className="text-lg font-semibold mb-2">Examples:</h3>
          <ul className="text-left list-disc ml-6 space-y-2">
            {[selectedWord.example1, selectedWord.example2, selectedWord.example3, selectedWord.example4, selectedWord.example5]
              .filter(Boolean)
              .map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
};

export default PronunciationPractice;
