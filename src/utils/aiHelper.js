// src/utils/aiHelper.js
import { speakText } from "./speechUtils";

// ✅ Main AI explanation function
export const getAiExplanation = async (correct, spoken) => {
  try {
  const res = await fetch("http://127.0.0.1:8000/api/explain-pronunciation/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    spoken: "I goes to school",
    correct: "I go to school"
  }),
});

const data = await res.json();
console.log("AI feedback:", data.feedback);


    // const data = await response.json();
    // const message = data?.choices?.[0]?.message?.content?.trim();
    const message = (data.feedback || data?.choices?.[0]?.message?.content || "").trim();
    // const message = (data.feedback || "").trim();



    // 🗣️ Speak the AI feedback aloud
    if (message) speakText(message);

    return message || "Good try! Keep practicing to sound more natural.";
  } catch (error) {
    console.error("AI explanation error:", error);

    // 🧠 Fallback (offline version)
    const fallback = localAiCoach(correct, spoken);
    speakText(fallback);
    return fallback;
  }
};

// ✅ Fallback local AI-style explanation (when API fails)
const localAiCoach = (expected, spoken) => {
  expected = expected.toLowerCase().trim();
  spoken = spoken.toLowerCase().trim();

  if (spoken === expected) {
    return "Perfect! Your pronunciation and sentence are exactly right.";
  }

  const expectedWords = expected.split(" ");
  const spokenWords = spoken.split(" ");
  const missing = expectedWords.filter((w) => !spokenWords.includes(w));
  const extra = spokenWords.filter((w) => !expectedWords.includes(w));

  let message = "Let's improve together! 💬 ";

  if (missing.length > 0) {
    message += `You missed: "${missing.join(", ")}". `;
  }
  if (extra.length > 0) {
    message += `You added: "${extra.join(", ")}". `;
  }

  if (message === "Let's improve together! 💬 ") {
    message += "You're really close! Focus on pronunciation rhythm.";
  }

  return message;
};
