import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/HomePage";
import VoiceChat from "./pages/VoiceChat";
import Header from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import PronunciationTest from "./pages/PronunciationTest";


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/voice" element={<VoiceChat />} />
            <Route path="/pronunciation" element={<PronunciationTest />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/chatwitai" element={<ChatWithAI />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
