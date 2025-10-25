import React, { useState } from "react";

const ChatWithAI = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const studentId = 1; // ← مؤقتاً، هتجيبيه من الـ login بعدين

  // 🧠 إرسال الرسالة
  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    try {
      // 1️⃣ نجيب الكلمات المتعلمة من Django
      const res = await fetch(`https://farha31.pythonanywhere.com/api/student_words/${studentId}/`);
      const learnedWords = await res.json();

      // 2️⃣ نبني البرومبت الديناميكي
      const prompt = `
You are an English teacher helping a beginner student.
The student has learned only these words: ${JSON.stringify(learnedWords)}.
Speak only using these words and very simple grammar.
Keep your sentences short and friendly.
If the student makes a mistake, correct them gently.
Ask simple questions to help them practice.
      `;

      // 3️⃣ نرسل الكلام إلى Gemini API
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_API_KEY",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: prompt }] },
              { role: "user", parts: [{ text: userInput }] },
            ],
          }),
        }
      );

      const data = await response.json();
      const aiReply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sorry, I couldn’t understand.";

      // 4️⃣ نعرض النتيجة
      setMessages((prev) => [
        ...prev,
        { role: "user", text: userInput },
        { role: "ai", text: aiReply },
      ]);

      setUserInput("");
    } catch (err) {
      console.error(err);
      alert("Error talking to AI");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 to-pink-100 p-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-orange-600 mb-4">
          🗣️ AI Conversation Practice
        </h1>

        <div className="h-96 overflow-y-auto border rounded-lg p-3 mb-4 bg-gray-50">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-2 p-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-200 text-right ml-auto w-fit"
                  : "bg-green-200 text-left mr-auto w-fit"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg p-2 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithAI;
