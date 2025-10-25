import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";


const PronunciationTest = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // 🎧 Fetch words from Django API
  useEffect(() => {
    fetch("https://farha31.pythonanywhere.com/api/words/")
      .then((res) => res.json())
      .then((data) => setWords(data))
      .catch(() => setMessage("Error loading words ❌"));
  }, []);

  // 🔊 Speak the current word
  const speakWord = () => {
    if (!words[currentIndex]) return;
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };

  // 🎤 Start recording
  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setMessage("Speech recognition not supported ❌");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    recognition.continuous = false;


    recognition.start();
    setIsListening(true);
    setMessage("🎤 Listening...");

//     recognition.onresult = (event) => {

//       console.log("Speech detected:", event.results);
//       const transcript = event.results[0][0].transcript.toLowerCase().trim();
//       console.log("Transcript:", transcript);
//       const correctWord = words[currentIndex].word.toLowerCase();

//       // if (transcript === correctWord) {
//       //   setMessage("✅ Excellent! Great job 🎉");
//       //   setAttempts(0);
//       //   setTimeout(nextWord, 1500);
//       // } else {
//       //   const newAttempts = attempts + 1;
//       //   setAttempts(newAttempts);
//       //   if (newAttempts >= 3) {
//       //     setMessage("😅 Let's skip this one 👉");
//       //     setTimeout(nextWord, 1500);
//       //   } else {
//       //     setMessage("❌ Try again 🔁");
//       //   }
//       // }
//       // 🔍 تحسين التقييم بالنطق
// const similarity = transcript.includes(correctWord) || correctWord.includes(transcript);

// if (similarity) {
//   setMessage("✅ Excellent! Great job 🎉");
//   setAttempts(0);
//   setTimeout(nextWord, 1500);
// } else {
//   const newAttempts = attempts + 1;
//   setAttempts(newAttempts);

//   if (newAttempts >= 3) {
//     speakWord();
//     setMessage("😅 Let's skip this one 👉");
//     setTimeout(nextWord, 1500);
//   } else {
//     setMessage(`❌ You said: "${transcript}". Try again 🔁`);
//   }
// }

//       setIsListening(false);
//     };


const launchConfetti = () => {
  const duration = 1.5 * 1000; // ثانية ونص
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};


const encouragements = [
  "Excellent! You nailed it!",
  "Awesome! Keep it up!",
  "Perfect pronunciation!",
  "Well done! You’re improving fast!",
  "Great job! That was clear and confident!"
];

const playEncouragement = () => {
  const randomMsg =
    encouragements[Math.floor(Math.random() * encouragements.length)];
  const utterance = new SpeechSynthesisUtterance(randomMsg);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1.1;
  utterance.voice = speechSynthesis
  .getVoices()
  .find(v => v.name.toLowerCase().includes("female")) || null;

  speechSynthesis.speak(utterance);
};


recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript.toLowerCase().trim();
  const correctWord = words[currentIndex].word.toLowerCase().trim();

  console.log("🎙 Transcript:", transcript);
  console.log("✅ Correct:", correctWord);

  // 🔍 نسمح بتقارب جزئي عشان ما تكونش المقارنة صارمة
  const isMatch =
    transcript === correctWord ||
    transcript.includes(correctWord) ||
    correctWord.includes(transcript);

  if (isMatch) {
  setMessage("✅ Excellent! Great job 🎉");
  setAttempts(0);
  console.log("✅ MATCH FOUND!");
  playEncouragement(); // 🗣️ يشغل صوت تشجيعي
  launchConfetti(); // 🎉 يطلق الكونفيتي
  setTimeout(nextWord, 2000);
} else {
  const newAttempts = attempts + 1;
  setAttempts(newAttempts);
  console.log("❌ Wrong. Attempts:", newAttempts);

  if (newAttempts >= 3) {
    setMessage("😅 Let's skip this one 👉");
    speakWord();
    setTimeout(nextWord, 2000);
  } else {
    setMessage(`❌ You said: "${transcript}". Try again 🔁`);
  }
}

  setIsListening(false);
};

    recognition.onerror = () => {
      setIsListening(false);
      setMessage("⚠️ Error, please try again.");
    };

    recognition.onend = () => setIsListening(false);
  };

  const nextWord = () => {
    setAttempts(0);
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setMessage("");
    } else {
      setMessage("🎉 All words completed!");
    }
  };

  if (words.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading words...
      </div>
    );
  }

  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-green-600">
          Pronunciation Practice 🗣️
        </h1>

        <div className="text-4xl font-extrabold text-gray-800 mb-4">
          {words[currentIndex].word}
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          <button
            onClick={speakWord}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow"
          >
            🔊 Listen
          </button>
          <button
            onClick={startListening}
            disabled={isListening}
            className={`${
              isListening ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
            } text-white px-4 py-2 rounded-full shadow`}
          >
            🎤 {isListening ? "Listening..." : "Speak"}
          </button>
        </div>

        <p className="text-lg mb-4">{message}</p>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-600">
          Progress: {currentIndex + 1}/{words.length}
        </p>
      </div>
    </div>
  );
};

export default PronunciationTest;
