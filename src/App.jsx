import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import TextToSpeech from "./pages/TTS/TextToSpeech";
import SpeechToText from "./pages/STT/SpeechToText";
import ChatWithAI from "./pages/Chat/ChatWithAI";
import ChatWithWordsAI from "./pages/Chat/ChatWithWordsAI";
import PracticePage from "./pages/Practice/PronunciationPractice";
// import Levels from "./pages/Levels";
// import LevelsPage from "./pages/Practice/LevelsPage";

// import PaymentPage from "./pages/Payment/PaymentPage";

function App() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tts" element={<TextToSpeech />} />
        <Route path="/stt" element={<SpeechToText />} />
        <Route path="/chat" element={<ChatWithAI />} />
      {/* <Route path="/practice/:id" element={<PronunciationPractice />} /> */}
       {/* <Route path="/level" element={<Levels/>} /> */}
      <Route path = "/chat-words-ai" element = {<ChatWithWordsAI/>} />
        {/* <Route path="/payment" element={<PaymentPage />} /> */}
{/* <Route path="/practice" element={<LevelsPage />} /> */}
<Route path="/practice" element={<PracticePage />} />



      </Routes>
    </Router>
  );
}

export default App;
