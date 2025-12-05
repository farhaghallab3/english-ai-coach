import React, { useState } from "react";
import { FaMicrophone, FaVolumeUp, FaArrowLeft, FaCheckCircle, FaPlay, FaForward, FaTrophy } from "react-icons/fa";
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
        "http://127.0.0.1:8000/api/transcribe/",
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
    <div className="max-w-4xl mx-auto scale-in relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-16 h-16 bg-violet-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="glass-card p-8 md:p-12 relative z-10">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2 hover:bg-slate-600"
          >
            <FaArrowLeft />
            Back to Words
          </button>
          <div className="text-sm text-gray-400">
            Example {currentExample + 1} of {examples.length}
          </div>
        </div>

        {/* Word Display */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {wordData.word.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gradient mb-2">
                {wordData.word}
              </h1>
              <p className="text-gray-300 text-lg">{wordData.meaning}</p>
            </div>
          </div>
        </div>

        {/* Example Sentence */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Practice Sentence</h3>
            <button
              onClick={() => speakText(examples[currentExample])}
              className="btn-primary p-3 rounded-xl hover:scale-105 transition-transform"
              title="Listen to example"
            >
              <FaVolumeUp />
            </button>
          </div>
          <p className="text-gray-200 text-lg leading-relaxed italic">
            "{examples[currentExample]}"
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Your Progress</span>
            <span className="text-sm text-gray-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-500 h-4 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
          </div>
          {progress >= 50 && (
            <div className="flex items-center justify-center gap-2 mt-2 text-green-400">
              <FaCheckCircle />
              <span className="text-sm font-medium">Great progress! Keep going!</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={handleSpeak}
            disabled={isListening}
            className={`btn-primary text-lg px-8 py-4 btn-hover-lift flex items-center gap-3 relative ${
              isListening ? 'bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse' : ''
            }`}
          >
            {isListening ? (
              <>
                <FaMicrophone className="animate-pulse" />
                <span>Listening...</span>
                <div className="absolute inset-0 rounded-2xl bg-red-500/20 animate-ping"></div>
              </>
            ) : (
              <>
                <FaMicrophone />
                <span>Start Speaking</span>
              </>
            )}
          </button>

          <button
            onClick={nextExample}
            className="btn-secondary text-lg px-6 py-4 hover:bg-slate-600 flex items-center gap-2"
          >
            <FaForward />
            Skip to Next
          </button>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div className={`p-6 rounded-2xl text-center transition-all duration-500 ${
            feedback.includes('Great') || feedback.includes('Excellent') || feedback.includes('Amazing')
              ? 'bg-green-500/10 border border-green-500/30 text-green-300'
              : feedback.includes('Try') || feedback.includes('Error')
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
          }`}>
            <div className="flex items-center justify-center gap-3 mb-2">
              {feedback.includes('Great') || feedback.includes('Excellent') ? (
                <FaTrophy className="text-green-400" />
              ) : feedback.includes('Recording') ? (
                <FaMicrophone className="text-amber-400 animate-pulse" />
              ) : (
                <FaVolumeUp className="text-blue-400" />
              )}
              <span className="font-semibold">AI Feedback</span>
            </div>
            <p className="text-lg leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 p-4 glass-card">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-violet-400 to-pink-500 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
              💡
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Practice Tips:</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Speak clearly and at a natural pace</li>
                <li>• Focus on the pronunciation of the target word</li>
                <li>• Listen to the example first, then repeat</li>
                <li>• Aim for at least 50% accuracy to proceed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordPractice;
