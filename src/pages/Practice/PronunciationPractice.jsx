import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";

const BASE_URL = "https://farha31.pythonanywhere.com/api";

const PronunciationPractice = () => {
  const [levels] = useState(["A1", "A2", "B1", "B2", "C1", "C2"]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [currentExample, setCurrentExample] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [completedWords, setCompletedWords] = useState(
    JSON.parse(localStorage.getItem("completedWords")) || []
  );

  // fetch words for selected level
  useEffect(() => {
    if (selectedLevel) {
      axios
        .get(`${BASE_URL}/words/${selectedLevel}/`)
        .then((res) => setWords(res.data))
        .catch((err) => console.error("Error fetching words:", err));
    }
  }, [selectedLevel]);

  // play pronunciation audio
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // start recording and compare spoken text
  const startRecording = (expectedText) => {
    const recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recog = new recognition();
    recog.lang = "en-US";
    recog.start();

    recog.onresult = (event) => {
      const spoken = event.results[0][0].transcript.toLowerCase();
      console.log("Spoken:", spoken);
      if (spoken.includes(expectedText.toLowerCase())) {
        setFeedback("✅ Great job!");
        setTimeout(() => nextExample(), 1000);
      } else {
        setFeedback("❌ Try again!");
      }
    };
  };

  // go to next example or finish word
  const nextExample = () => {
    const examples = getExamples(selectedWord);
    if (currentExample < examples.length - 1) {
      setCurrentExample((prev) => prev + 1);
      setFeedback("");
    } else {
      // mark word as completed
      const updated = [...completedWords, selectedWord.word];
      setCompletedWords(updated);
      localStorage.setItem("completedWords", JSON.stringify(updated));
      alert(`🎉 You finished practicing "${selectedWord.word}"!`);
      setSelectedWord(null);
      setCurrentExample(0);
      setFeedback("");
    }
  };

  const getExamples = (word) => {
    return [
      word.example1,
      word.example2,
      word.example3,
      word.example4,
      word.example5,
    ].filter(Boolean);
  };

  return (
    <>
      <Navbar />
      <div className="p-16 text-center">
        {/* LEVEL SELECTION */}
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

        {/* WORD LIST */}
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

        {/* WORD PRACTICE */}
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

            <button
              onClick={() => speak(selectedWord.word)}
              className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              🔊 Listen to "{selectedWord.word}"
            </button>

            <h3 className="text-lg font-semibold mb-2">Examples:</h3>

            {getExamples(selectedWord).length > 0 ? (
              <>
                <p className="text-gray-800 mb-4">
                  Example {currentExample + 1} of{" "}
                  {getExamples(selectedWord).length}:{" "}
                  <strong>{getExamples(selectedWord)[currentExample]}</strong>
                </p>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() =>
                      speak(getExamples(selectedWord)[currentExample])
                    }
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
                  >
                    ▶️ Listen Example
                  </button>

                  <button
                    onClick={() =>
                      startRecording(
                        getExamples(selectedWord)[currentExample]
                      )
                    }
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    🎤 Speak
                  </button>

                  <button
                    onClick={nextExample}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    ⏭ Skip
                  </button>
                </div>

                <p className="mt-4 text-lg font-semibold text-center">
                  {feedback}
                </p>
              </>
            ) : (
              <p>No examples available for this word.</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default PronunciationPractice;
