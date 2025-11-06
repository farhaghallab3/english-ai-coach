import React, { useState } from "react";
import { recordAudio } from "../utils/speechUtils";

const encouragementMessages = [
  "Great job! Keep it up!",
  "You're doing amazing!",
  "Keep practicing and you'll improve fast!",
  "Excellent work, let's move on!",
  "Nice effort! Try the next one!",
  "You're on fire! Keep going!",
];

const getRandomEncouragement = () => {
  return encouragementMessages[
    Math.floor(Math.random() * encouragementMessages.length)
  ];
};

// Remove all punctuation from speech strings to avoid saying 'dot' etc
const removePunctuation = (text) => {
  return text.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
};

const WordPractice = ({ wordData, onComplete, onBack }) => {
  const [currentExample, setCurrentExample] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [isListening, setIsListening] = useState(false);

  const examples = [
    wordData.example1,
    wordData.example2,
    wordData.example3,
    wordData.example4,
    wordData.example5,
  ].filter(Boolean);

  const filterEnglishOnly = (text) => {
    if (!text) return "";
    let filtered = text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g, "");
    filtered = filtered.replace(/[^a-zA-Z\s]/g, "");
    return filtered.replace(/\s+/g, " ").trim();
  };

  const speakTextWithPause = (intro, sentence) => {
    if (!sentence) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const cleanIntro = removePunctuation(intro);
    const cleanSentence = removePunctuation(sentence);
    const utterIntro = new SpeechSynthesisUtterance(cleanIntro);
    const utterPause = new SpeechSynthesisUtterance(" ");
    utterPause.rate = 0.1; // slow pause for about 1 second
    const utterSentence = new SpeechSynthesisUtterance(cleanSentence);
    utterSentence.lang = "en-US";
    utterIntro.lang = "en-US";
    utterPause.lang = "en-US";

    utterIntro.onend = () => synth.speak(utterPause);
    utterPause.onend = () => synth.speak(utterSentence);

    synth.speak(utterIntro);
  };

  const speakText = (text) => {
    if (!text) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const cleanText = removePunctuation(text);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    synth.speak(utterance);
  };

  const nextExample = () => {
    if (currentExample < examples.length - 1) {
      setCurrentExample((prev) => prev + 1);
      setFeedback("");
      setProgress(0);
      setCorrectWords(0);
      setTotalWords(0);
    } else {
      onComplete(wordData.word);
    }
  };

  const handleSpeak = async () => {
    try {
      setIsListening(true);
      setFeedback("🎙️ Recording... Speak now!");
      const audioBlob = await recordAudio(3);
      setFeedback("⏳ Transcribing...");

      const formData = new FormData();
      formData.append("file", audioBlob);
      formData.append("example", examples[currentExample]);

      const response = await fetch(
        "https://farha31.pythonanywhere.com/api/transcribe/",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Server error");
      }

      const percent = result.progress || 0;
      const targetSentence = examples[currentExample];

      setProgress(percent);

      if (percent >= 50) {
        const encouragement = getRandomEncouragement();
        setFeedback(encouragement);
        speakText(encouragement);
        setTimeout(nextExample, 1500);
      } else {
        const trySayText = "Try saying:";
        setFeedback(`${trySayText} ${targetSentence}`);
        speakTextWithPause(trySayText, filterEnglishOnly(targetSentence));
      }
    } catch (err) {
      console.error(err);
      setFeedback("⚠️ Error processing your speech. Try again.");
    } finally {
      setIsListening(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <button onClick={onBack} className="text-blue-600 underline mb-4">
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-2">{wordData.word}</h2>
      <p className="text-gray-700 mb-4">{wordData.meaning}</p>

      <h3 className="text-lg font-semibold mb-2">
        Example {currentExample + 1} of {examples.length}{" "}
        <button
          onClick={() => speakText(examples[currentExample])}
          title="Hear example sentence"
          className="ml-2 text-xl"
          aria-label="Play example sentence"
        >
          🔊
        </button>
      </h3>
      <p className="text-gray-800 mb-4">{examples[currentExample]}</p>

      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <button
        onClick={handleSpeak}
        disabled={isListening}
        className={`px-6 py-3 rounded-lg text-white ${
          isListening ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isListening ? "🎧 Listening..." : "🎤 Speak"}
      </button>

      <button
        onClick={nextExample}
        className="ml-3 bg-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500"
      >
        ⏭ Skip
      </button>

      <p className="mt-6 text-lg font-medium whitespace-pre-line">{feedback}</p>
    </div>
  );
};

export default WordPractice;
