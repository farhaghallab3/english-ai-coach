import React, { useState } from "react";
import { speakText, startSpeechRecognition } from "../utils/speechUtils";

const PronunciationTest = () => {
  const [spoken, setSpoken] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const expectedText = "How are you today? (كيف حالك اليوم؟)";

  const handleSpeak = () => {
    startSpeechRecognition(
      expectedText,
      (similarity, spokenText) => {
        setSpoken(spokenText);
        setProgress(similarity * 100); // show score %
        setIsSpeaking(false);
      },
      (err) => console.error(err)
    );
    setIsSpeaking(true);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Example 1 of 5: {expectedText}</h3>
      <button onClick={() => speakText(expectedText)}>▶️ Listen Example</button>
      <button onClick={handleSpeak} disabled={isSpeaking}>
        🎤 Speak
      </button>
      <p>You said: "{spoken}"</p>

      {/* ✅ Progress bar */}
      <div
        style={{
          width: "80%",
          height: "15px",
          background: "#ddd",
          borderRadius: "10px",
          margin: "10px auto",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            borderRadius: "10px",
            background:
              progress >= 85
                ? "#4caf50"
                : progress >= 60
                ? "#ffb400"
                : "#f44336",
            transition: "width 0.5s ease",
          }}
        ></div>
      </div>

      {/* ✅ Feedback message */}
      {progress > 0 && (
        <p>
          {progress >= 85
            ? "✅ Great pronunciation!"
            : progress >= 60
            ? "👍 Almost there!"
            : "🗣 Keep practicing!"}
        </p>
      )}
    </div>
  );
};

export default PronunciationTest;
