import { useState, useEffect } from "react";

export default function VoiceChat() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi there! 👋 Let's practice English. Speak when you're ready!" },
  ]);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // ✅ Initialize browser SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition 😢");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;

    recog.onresult = (event) => {
      const userText = event.results[0][0].transcript;
      addMessage("user", userText);
      getAIResponse(userText);
    };

    recog.onerror = (e) => {
      console.error("🎤 Speech recognition error:", e);
      setListening(false);

      if (e.error === "no-speech") {
        addMessage("ai", "😅 I didn't hear anything. Please try speaking again!");
      } else if (e.error === "audio-capture") {
        addMessage("ai", "🎙️ Please enable your microphone and try again.");
      } else if (e.error === "not-allowed") {
        addMessage("ai", "🔒 Please allow microphone access to continue.");
      } else {
        addMessage("ai", `⚠️ Voice error: ${e.error}`);
      }
    };

    recog.onend = () => {
      setListening(false);
    };

    setRecognition(recog);
  }, []);

  // ✅ Add message to chat
  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  // ✅ Speak text using browser speech synthesis
  const speakText = (text) => {
    // Stop any ongoing speech first
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  // ✅ Repeat specific AI message
  const repeatMessage = (text) => {
    speakText(text);
  };

  // ✅ Get AI response (Gemini via Django backend)
  const getAIResponse = async (userText) => {
    addMessage("ai", "Thinking...");

    try {
      const res = await fetch("https://farha31.pythonanywhere.com/api/ask-gemini/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        addMessage("ai", "Server error occurred 🤖");
        return;
      }

      const data = await res.json();
      console.log("🔍 Gemini API response:", data);

    const aiReply = data.reply || "Sorry, I didn’t get that.";


      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1 ? { sender: "ai", text: aiReply } : msg
        )
      );
      speakText(aiReply);
    } catch (error) {
      console.error("❌ Gemini error:", error);
      addMessage("ai", "Error connecting to Gemini 🤖");
    }
  };

  // ✅ Start/Stop listening
  const toggleListening = () => {
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      try {
        recognition.start();
        setListening(true);
      } catch (e) {
        console.error("⚠️ Speech start error:", e);
        addMessage("ai", "Microphone error, please refresh and try again.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">🎙️ English Practice Assistant</h2>

      <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50 flex flex-col">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 p-3 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-800 self-start"
            }`}
          >
            <div className="flex items-start gap-2">
              {/* Repeat button for AI messages only */}
              {msg.sender === "ai" && msg.text !== "Thinking..." && (
                <button
                  onClick={() => repeatMessage(msg.text)}
                  className="flex-shrink-0 mt-1 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                  title="Repeat this message"
                >
                  🔄
                </button>
              )}
              <div className="flex-1">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Control buttons */}
      <div className="flex gap-2 mt-4">
        {/* Input box for typing */}
        <input
          type="text"
          placeholder="Type your answer or sentence..."
          className="flex-1 border rounded-xl p-2"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim()) {
              addMessage("user", e.target.value);
              getAIResponse(e.target.value);
              e.target.value = "";
            }
          }}
        />
        
        {/* Microphone button */}
        <button
          onClick={toggleListening}
          className={`px-4 py-2 rounded-xl font-semibold transition ${
            listening ? "bg-red-500" : "bg-blue-600"
          } text-white`}
        >
          {listening ? "🛑" : "🎤"}
        </button>
      </div>
    </div>
  );
}