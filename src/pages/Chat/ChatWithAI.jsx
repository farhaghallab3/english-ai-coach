import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FaRobot, FaUserAlt, FaVolumeUp } from "react-icons/fa";

const ChatWithAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // ✅ التأكد من تسجيل الدخول
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

  // ✅ حفظ المحادثة
  const saveChat = (updated) => {
    const userId = localStorage.getItem("user_id");
    localStorage.setItem(`chat_${userId}`, JSON.stringify(updated));
  };

  // 🎤 تفعيل المايك
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

  // 🔊 نطق بصوت راجل فقط
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

  // 📨 إرسال الرسالة
  const handleSend = async (text) => {
    if (!text.trim()) return;
    const userMsg = { sender: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    saveChat(updated);
    setInput("");

    try {
      const res = await fetch("https://farha31.pythonanywhere.com/api/ask-huggingface/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          user_id: localStorage.getItem("user_id"),
        }),
      });

      const data = await res.json();
      const botMsg = { sender: "bot", text: data.reply || "Sorry, something went wrong." };

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f4f6ff] to-[#dbe8ff]">
      <Navbar />

      <div className="flex flex-col items-center justify-center flex-grow px-4 py-6">
        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center py-4 text-xl font-semibold">
            🧠 Chat Tutor
          </div>

          {/* 💬 الرسائل */}
          <div className="h-[60vh] overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && <FaRobot className="text-indigo-500 text-xl mb-1" />}

                <div
                  className={`relative px-4 py-2 rounded-2xl max-w-[70%] shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}

                  {/* 🔊 أيقونة الصوت فقط لرسائل AI */}
                  {msg.sender === "bot" && (
                    <FaVolumeUp
                      onClick={() => speak(msg.text)}
                      className="absolute -right-6 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 cursor-pointer"
                      size={18}
                      title="Replay audio"
                    />
                  )}
                </div>

                {msg.sender === "user" && <FaUserAlt className="text-blue-600 text-lg mb-1" />}
              </div>
            ))}
          </div>

          {/* 📝 إدخال الرسالة */}
          <div className="flex items-center border-t border-blue-100 bg-white/60 backdrop-blur-md p-3">
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full mr-2 transition-all ${
                isListening ? "bg-red-400" : "bg-blue-500"
              } text-white hover:scale-105`}
            >
              🎤
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              onClick={() => handleSend(input)}
              className="ml-2 bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatWithAI;
