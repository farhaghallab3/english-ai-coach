import React, { useState } from "react";
import { speakText, startSpeechRecognition } from "../utils/speechUtils";
import { showMistake } from "../utils/diffUtils";
import { getAiExplanation } from "../utils/aiHelper";

const WordPractice = ({ wordData, onComplete, onBack }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const examples = [
    wordData.example1,
    wordData.example2,
    wordData.example3,
    wordData.example4,
    wordData.example5,
  ].filter(Boolean);

  const nextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample((prev) => prev + 1);
      setFeedback("");
      setProgress(0);
    } else {
      setFeedback("");
      onComplete(wordData.word);
    }
  };

  const handleSpeak = () => {
    if (isListening) return;
    setIsListening(true);

    const example = examples[currentExample];

    startSpeechRecognition(
      example,
      (similarity, spoken) => {
        setIsListening(false);
        const percent = Math.round(similarity * 100);
        setProgress(percent);

        if (percent >= 90) {
          setFeedback("✅ Great job! Perfect pronunciation!");
          setTimeout(nextExample, 1000);
        } else {
          const mistakeFeedback = showMistake(example, spoken);
          setFeedback(`🟡 ${percent}% match.\n${mistakeFeedback}`);

          // Ask AI to explain mistakes
          getAiExplanation(example, spoken).then((aiMessage) => {
            setFeedback(
              (prev) => `${prev}\n💬 AI Coach: ${aiMessage}`
            );
          });
        }
      },
      (error) => {
        setIsListening(false);
        console.error("Speech recognition error:", error);
        setFeedback("⚠️ Could not recognize speech. Please try again.");
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="mb-4 text-blue-600 underline">
        ← Back to Words
      </button>

      <h2 className="text-2xl font-bold mb-2">{wordData.word}</h2>
      <p className="text-gray-700 mb-4">{wordData.meaning}</p>

      <button
        onClick={() => speakText(wordData.word)}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        🔊 Listen to "{wordData.word}"
      </button>

      {examples.length > 0 ? (
        <>
          <h3 className="text-lg font-semibold mb-2">Examples:</h3>
          <p className="text-gray-800 mb-4">
            Example {currentExample + 1} of {examples.length}:{" "}
            <strong>{examples[currentExample]}</strong>
          </p>

          {/* ✅ Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => speakText(examples[currentExample])}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
            >
              ▶️ Listen Example
            </button>

            <button
              onClick={handleSpeak}
              disabled={isListening}
              className={`px-4 py-2 rounded-lg text-white ${
                isListening
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isListening ? "🎙️ Listening..." : "🎤 Speak"}
            </button>

            <button
              onClick={nextExample}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              ⏭ Skip
            </button>
          </div>

          <p className="mt-4 text-lg font-semibold text-center whitespace-pre-line">
            {feedback}
          </p>
        </>
      ) : (
        <p>No examples available for this word.</p>
      )}
    </div>
  );
};

export default WordPractice;
