import React, { useRef } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const featuresRef = useRef(null); // المرجع للكروت

  const features = [
    { title: "Text to Speech", desc: "Write and listen to perfect pronunciation.", link: "/tts" },
    { title: "Speech to Text", desc: "Speak and see how accurate your speech is.", link: "/stt" },
    { title: "Chat with AI", desc: "Practice conversations with our smart AI.", link: "/chat" },
    { title: "Pronunciation Practice", desc: "Improve pronunciation with fun challenges!", link: "/practice" },
  ];

  const handleCardClick = (link) => {
    if (isLoggedIn) {
      navigate(link);
    } else {
      navigate("/login");
    }
  };

  // لما المستخدم يدوس على "Get Started"
  const handleGetStarted = () => {
    if (isLoggedIn) {
      featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 px-8 md:px-16 py-20">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">Own Language</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Learn, speak, and improve your English pronunciation with AI-powered tools made just for you 🎯
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/logo.png"
            alt="Own Language Logo"
            className="w-64 md:w-80"
          />
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="flex-grow bg-white py-16 px-8 md:px-16">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          Choose Your Learning Mode ✨
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((card, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(card.link)}
              className="cursor-pointer border rounded-2xl p-6 shadow-md hover:shadow-xl transition flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 text-blue-600">
                  {card.title}
                </h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
              <span className="text-blue-500 font-medium mt-4 hover:underline">
                Try now →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
