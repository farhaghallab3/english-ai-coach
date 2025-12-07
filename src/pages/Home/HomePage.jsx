import React, { useRef, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import "../../styles/animations.css";

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
      <section className="hero-bg px-8 md:px-16 py-24 md:py-32 fade-in-up relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium mb-4 border border-cyan-500/30">
                ✨ AI-Powered Learning Platform
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Master English with{" "}
              <span className="text-gradient block md:inline">AI Magic</span>
            </h1>
            <p className="text-gray-300 text-xl mb-10 leading-relaxed max-w-lg">
              Transform your pronunciation skills with cutting-edge AI technology. Get personalized feedback, engaging challenges, and speak confidently in no time! 🚀
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 btn-hover-lift group"
              >
                <span className="flex items-center gap-2">
                  Start Learning Now
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
              <button
                onClick={() => featuresRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="btn-secondary text-lg px-8 py-4 hover:bg-slate-600"
              >
                Explore Features
              </button>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img
                src="/logo.png"
                alt="English AI Coach Logo"
                className="w-80 md:w-96 relative z-10 float-animation"
              />
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-2xl animate-bounce">
                🎯
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-xl animate-pulse">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-32 right-16 w-6 h-6 bg-violet-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
      </section>

      {/* About Section */}
      <section className="bg-slate-900 py-20 px-8 md:px-16 fade-in-left">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Meet Your <span className="text-gradient">AI Coach</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Experience the future of language learning with our intelligent AI companion
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-3xl blur-2xl opacity-20"></div>
                <img
                  src="/ai.jpg"
                  alt="AI Learning"
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                />
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce">
                  🤖
                </div>
                <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg animate-pulse">
                  🎓
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-8">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center">
                    🎯
                  </span>
                  Personalized Learning
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Our AI adapts to your learning style, providing customized exercises and feedback that match your pace and goals.
                </p>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-violet-400 to-pink-500 rounded-full flex items-center justify-center">
                    ⚡
                  </span>
                  Instant Feedback
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Get real-time pronunciation analysis and suggestions to improve your speaking skills immediately.
                </p>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-10 h-10 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    🎮
                  </span>
                  Gamified Experience
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Turn learning into fun with challenges, achievements, and interactive exercises that keep you engaged.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-800 py-20 px-8 md:px-16 fade-in-right">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Your Learning <span className="text-gradient">Journey</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Three simple steps to transform your English skills
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-cyan-400 via-violet-500 to-cyan-400"></div>

            <div className="relative">
              <div className="card p-8 text-center scale-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow shadow-lg">
                    <span className="text-white font-black text-3xl">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm animate-bounce">
                    🎯
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Choose Your Path</h3>
                <p className="text-gray-300 leading-relaxed">
                  Pick from our suite of AI-powered tools: Text-to-Speech, Speech-to-Text, AI Chat, or Pronunciation Practice. Each designed for different learning goals.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="card p-8 text-center scale-in" style={{ animationDelay: '0.4s' }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-violet-400 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow shadow-lg">
                    <span className="text-white font-black text-3xl">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-sm animate-pulse">
                    ⚡
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Learn & Practice</h3>
                <p className="text-gray-300 leading-relaxed">
                  Dive into interactive exercises with real-time AI feedback. Practice pronunciation, build vocabulary, and engage in natural conversations.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="card p-8 text-center scale-in" style={{ animationDelay: '0.6s' }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 pulse-glow shadow-lg">
                    <span className="text-white font-black text-3xl">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center text-sm animate-bounce">
                    🏆
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Master & Excel</h3>
                <p className="text-gray-300 leading-relaxed">
                  Track your progress, earn achievements, and watch your confidence grow. From beginner to fluent speaker in your own time.
                </p>
              </div>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                Interactive Learning
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                AI-Powered Feedback
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                Progress Tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="flex-grow bg-gradient-to-b from-slate-900 to-slate-800 py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Choose Your <span className="text-gradient">Learning Mode</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-3xl mx-auto">
              Four powerful AI tools designed to accelerate your English mastery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((card, index) => {
              const icons = ['🎤', '🎙️', '💬', '🎯'];
              const gradients = [
                'from-cyan-400 to-blue-500',
                'from-violet-400 to-purple-500',
                'from-emerald-400 to-teal-500',
                'from-amber-400 to-orange-500'
              ];
              const delays = ['0.1s', '0.2s', '0.3s', '0.4s'];

              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(card.link)}
                  className="cursor-pointer card p-8 flex flex-col justify-between scale-in group"
                  style={{ animationDelay: delays[index] }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${gradients[index]} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {icons[index]}
                      </div>
                      <div className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gradient transition-all duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-cyan-400 font-semibold group-hover:text-cyan-300 transition-colors duration-300">
                      Try now
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of learners who are mastering English with AI-powered tools
              </p>
              <button
                onClick={handleGetStarted}
                className="btn-primary text-lg px-8 py-4 btn-hover-lift group"
              >
                <span className="flex items-center gap-2">
                  Get Started Free
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
