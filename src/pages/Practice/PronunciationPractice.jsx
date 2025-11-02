import React, { useState, useEffect } from "react";

const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function PronunciationPractice() {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [words, setWords] = useState([]);

  useEffect(() => {
    if (selectedLevel) {
      fetch(`https://farha31.pythonanywhere.com/api/words/${selectedLevel}/`)
        .then((res) => res.json())
        .then((data) => setWords(data))
        .catch((err) => console.error("Error:", err));
    }
  }, [selectedLevel]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎤 Pronunciation Practice</h1>

      {!selectedLevel && (
        <div className="grid grid-cols-3 gap-4">
          {levels.map((lvl) => (
            <button
              key={lvl}
              className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl}
            </button>
          ))}
        </div>
      )}

      {selectedLevel && (
        <div>
          <button
            className="mb-4 px-4 py-2 bg-gray-200 rounded"
            onClick={() => setSelectedLevel(null)}
          >
            ← Back
          </button>

          <h2 className="text-xl font-semibold mb-4">Level {selectedLevel}</h2>

          {words.length === 0 ? (
            <p>Loading...</p>
          ) : (
            words.map((word) => (
              <div
                key={word.id}
                className="p-4 mb-4 border rounded-xl shadow-sm bg-white"
              >
                <h3 className="text-lg font-bold">{word.word}</h3>
                <p className="text-gray-600">{word.meaning}</p>
                <p className="text-sm text-gray-500">{word.type}</p>
                <ul className="mt-2 text-gray-700 list-disc ml-5">
                  {[word.example1, word.example2, word.example3, word.example4, word.example5]
                    .filter(Boolean)
                    .map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
