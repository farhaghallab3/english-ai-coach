// src/utils/speechUtils.js
import stringSimilarity from "string-similarity";

// ✅ Speak text aloud (without saying "dot" or punctuation)
export const speakText = (text) => {
  const cleanText = text.replace(/[.,!?]/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
};

// ✅ Normalize text for better comparison
export const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/\(.*?\)/g, "") // 🧠 remove Arabic or anything inside parentheses
    .replace(/[.,!?]/g, "")  // 🧹 remove punctuation
    .replace(/\b(dot|comma|period|question mark|exclamation mark|full stop)\b/gi, "") // remove spoken punctuation
    .replace(/\s+/g, " ") // normalize spaces
    .trim();
};


// ✅ Start voice recognition and return similarity score
export const startSpeechRecognition = (expectedText, onResult, onError) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spokenRaw = event.results[0][0].transcript;
    const spoken = normalizeText(spokenRaw);
    const expected = normalizeText(expectedText);

    const similarity = stringSimilarity.compareTwoStrings(spoken, expected);

    console.log("Spoken:", spoken);
    console.log("Expected:", expected);
    console.log("Similarity:", similarity);

    onResult(similarity, spoken);
  };

  recognition.onerror = (e) => {
    if (e.error === "no-speech") {
      onError("🎙️ No speech detected. Please try again.");
    } else if (e.error === "aborted") {
      onError("⚠️ Listening was stopped early.");
    } else {
      onError("Speech recognition error: " + e.error);
    }
  };

  recognition.start();
};
