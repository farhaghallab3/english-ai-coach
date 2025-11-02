import React, { useState, useRef } from "react";

const ChatWithWordAI = () => {
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [aiMessage, setAiMessage] = useState("Hi there! 👋 Let's practice English. Speak when you're ready!");
  const recognitionRef = useRef(null);

  const speakAI = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      setAiMessage("Speech recognition not supported ❌");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.start();
    setIsListening(true);
    setAiMessage("🎤 Listening...");

    recognition.onresult = (event) => {
      const userSpeech = event.results[0][0].transcript;
      const newMessage = { sender: "user", text: userSpeech };
      setConversation((prev) => [...prev, newMessage]);
      setIsListening(false);

      evaluateSpeech(userSpeech);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setAiMessage("⚠️ Error, please try again.");
    };
  };

  // 🧠 تقييم النطق ورد AI
  const evaluateSpeech = (speech) => {
    const clean = speech.toLowerCase().trim();
    let feedback = "";

    if (clean.includes("hello") || clean.includes("hi")) {
      feedback = "Great greeting! 👋 Now tell me how your day is going.";
    } else if (clean.includes("good") || clean.includes("fine")) {
      feedback = "Awesome! I'm glad to hear that 😄. Try saying: 'I'm feeling great today!'";
    } else if (clean.includes("tired") || clean.includes("bad")) {
      feedback = "Oh, I hope you feel better soon 🌻. Try saying: 'I'm a bit tired, but I'll be fine!'";
    } else {
      feedback = "Nice try! 👍 Let's practice saying: 'Today is a beautiful day!'";
    }

    const newAIMessage = { sender: "ai", text: feedback };
    setConversation((prev) => [...prev, newAIMessage]);
    setAiMessage(feedback);
    speakAI(feedback);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg text-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">
          🎤 AI Speaking Practice
        </h1>

        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 text-left bg-gray-50 mb-4">
          {conversation.length === 0 ? (
            <p className="text-gray-500 italic">{aiMessage}</p>
          ) : (
            conversation.map((msg, index) => (
              <div
                key={index}
                className={`my-2 p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-green-100 self-end text-right ml-auto"
                    : "bg-indigo-100 text-left mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}
        </div>

        <button
          onClick={startListening}
          disabled={isListening}
          className={`${
            isListening ? "bg-gray-400" : "bg-indigo-500 hover:bg-indigo-600"
          } text-white px-6 py-3 rounded-full transition-all`}
        >
          {isListening ? "🎧 Listening..." : "🎙️ Speak"}
        </button>

        <p className="text-gray-600 mt-3 text-sm">{aiMessage}</p>
      </div>
    </div>
  );
};

export default ChatWithWordAI;
