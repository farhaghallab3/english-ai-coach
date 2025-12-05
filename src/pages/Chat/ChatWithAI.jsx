import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaRobot, FaUserAlt, FaVolumeUp, FaMicrophone } from "react-icons/fa";

const ChatWithAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const savedChats = localStorage.getItem(`chat_${userId}`);
    if (savedChats) setMessages(JSON.parse(savedChats));
  }, [navigate]);

  
  const saveChat = (updated) => {
    const userId = localStorage.getItem("user_id");
    localStorage.setItem(`chat_${userId}`, JSON.stringify(updated));
  };


  const toggleMic = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        handleSend(text);
      };

      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);

      recognition.onend = () => setIsListening(false);
    }
  };


  const speak = (text) => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const maleVoice =
      voices.find(
        (v) =>
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("daniel") ||
          v.name.toLowerCase().includes("google uk english male")
      ) || voices[0];

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = maleVoice;
    utter.rate = 1;
    synth.speak(utter);
  };

  
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveChat(updated);
    setInput("");

    try {
      console.log("Sending to backend:", {
  question: text,
  user_id: localStorage.getItem("user_id"),
});

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "https://ownback-production.up.railway.app/api"}/ask-ai-basic/`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    question: text,
    user_id: localStorage.getItem("user_id"),
  }),
});


      const data = await res.json();
      const botMsg = { sender: "bot", text: data.answer || "Sorry, something went wrong." };


      const updatedChat = [...updated, botMsg];
      setMessages(updatedChat);
      saveChat(updatedChat);

      // ينطق الرد بصوت راجل
      speak(botMsg.text);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow px-2 md:px-4 py-4 md:py-8">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl glass-card shadow-2xl overflow-hidden">
          <div className="bg-gradient-animated text-white text-center py-4 md:py-6 text-lg md:text-2xl font-bold flex items-center justify-center gap-2 md:gap-3">
            <FaRobot className="text-lg md:text-2xl" />
            AI Chat Tutor
            <FaRobot className="text-lg md:text-2xl" />
          </div>

          {/* Chat Messages */}
          <div className="h-96 md:h-[70vh] overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8 md:py-12">
                <FaRobot className="text-4xl md:text-6xl mx-auto mb-4 opacity-50" />
                <p className="text-base md:text-xl">Start a conversation with your AI tutor!</p>
                <p className="text-xs md:text-sm mt-2">Ask questions, practice pronunciation, or just chat in English.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 md:gap-3 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaRobot className="text-white text-xs md:text-sm" />
                  </div>
                )}

                <div
                  className={`relative px-4 md:px-6 py-3 md:py-4 rounded-2xl max-w-[85%] md:max-w-[75%] shadow-lg ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-cyan-400 to-violet-500 text-white rounded-br-sm"
                      : "glass-card text-black rounded-bl-sm"
                  }`}
                >
                  <p className="leading-relaxed text-sm md:text-base">{msg.text}</p>

                  {/* Audio button for bot messages */}
                  {msg.sender === "bot" && (
                    <button
                      onClick={() => speak(msg.text)}
                      className="absolute -right-2 md:-right-3 -top-2 md:-top-3 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
                      title="Listen to response"
                    >
                      <FaVolumeUp size={10} className="md:w-3 md:h-3" />
                    </button>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-violet-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaUserAlt className="text-white text-xs md:text-sm" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="flex items-center border-t border-slate-700 glass-card p-3 md:p-4 gap-2 md:gap-3">
            <button
              onClick={toggleMic}
              className={`p-3 md:p-4 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg ${
                isListening
                  ? "bg-red-500 animate-pulse text-white"
                  : "btn-primary hover:shadow-xl"
              }`}
              title={isListening ? "Listening..." : "Voice input"}
            >
              <FaMicrophone size={16} className="md:w-5 md:h-5" />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Type your message or use voice input..."
              className="input-field flex-1 text-base md:text-lg"
            />

            <button
              onClick={() => handleSend(input)}
              className="btn-primary p-3 md:p-4 rounded-2xl hover:scale-105 transition-transform shadow-lg"
              title="Send message"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 md:mt-6 w-full max-w-xs sm:max-w-md md:max-w-2xl">
          <div className="glass-card p-4 text-center">
            <p className="text-gray-300 text-sm">
              💡 <strong>Tips:</strong> Ask about grammar, vocabulary, pronunciation, or practice conversations. Your AI tutor is here to help you learn!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatWithAI;
