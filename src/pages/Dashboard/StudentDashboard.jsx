import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrophy, FaBookOpen, FaChartLine, FaStar, FaArrowRight } from "react-icons/fa";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ownback-production.up.railway.app/api";

export default function StudentDashboard() {
  const [userName, setUserName] = useState(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [completedWords, setCompletedWords] = useState([]);
  const [levelProgress, setLevelProgress] = useState({});
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const getStoredName = () => {
      const candidates = [
        localStorage.getItem("user_name"),
        localStorage.getItem("name"),
        localStorage.getItem("userName"),
      ];

      return candidates.find((c) => c && c !== "undefined") || "Student";
    };

    setUserName(getStoredName());

    const storedCompleted = localStorage.getItem("completedWords");
    if (storedCompleted) setCompletedWords(JSON.parse(storedCompleted));

    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch levels
      const levelsRes = await fetch(`${BASE_URL}/levels/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (levelsRes.ok) {
        const levelsData = await levelsRes.json();
        setLevels(levelsData.levels || []);
        setCurrentLevel(levelsData.current_level || 1);
      }

      // Fetch word counts for each level
      const levelCodes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      const progress = {};
      for (const level of levelCodes) {
        try {
          const wordsRes = await fetch(`${BASE_URL}/words/${level}/`);
          if (wordsRes.ok) {
            const words = await wordsRes.json();
            const total = words.length;
            const completed = words.filter(word => completedWords.includes(word.word)).length;
            progress[level] = { total, completed };
          }
        } catch (err) {
          console.error(`Error fetching words for ${level}:`, err);
        }
      }
      setLevelProgress(progress);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Error loading dashboard data");
    }
  };

  const totalCompleted = Object.values(levelProgress).reduce((sum, p) => sum + p.completed, 0);
  const totalWords = Object.values(levelProgress).reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-grow py-8 px-4 relative">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-16 left-20 w-32 h-32 bg-cyan-400/5 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-violet-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-400/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8 scale-in">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  <FaTrophy />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-gradient">
                  Your Dashboard
                </h1>
              </div>
              <p className="text-gray-300 text-xl max-w-2xl mx-auto">
                Welcome back, {userName}! Track your English learning progress and achievements.
              </p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Current Level</p>
                  <p className="text-2xl font-bold text-white">{currentLevel}</p>
                </div>
                <FaTrophy className="text-yellow-400 text-3xl" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Words Practiced</p>
                  <p className="text-2xl font-bold text-white">{totalCompleted}</p>
                </div>
                <FaBookOpen className="text-green-400 text-3xl" />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Overall Progress</p>
                  <p className="text-2xl font-bold text-white">
                    {totalWords > 0 ? Math.round((totalCompleted / totalWords) * 100) : 0}%
                  </p>
                </div>
                <FaChartLine className="text-purple-400 text-3xl" />
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="card p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              Pronunciation Practice Progress
            </h2>

            <div className="space-y-4">
              {Object.entries(levelProgress).map(([level, progress]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-white w-8">{level}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-cyan-400 to-violet-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-300 ml-4">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Continue Learning</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/practice")}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-400 to-violet-500 text-white rounded-lg hover:from-cyan-500 hover:to-violet-600 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <FaBookOpen />
                  <div className="text-left">
                    <p className="font-semibold">Pronunciation Practice</p>
                    <p className="text-sm opacity-90">Practice English words</p>
                  </div>
                </div>
                <FaArrowRight />
              </button>

              <button
                onClick={() => navigate("/levels")}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg hover:from-emerald-500 hover:to-teal-600 transition-all hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <FaTrophy />
                  <div className="text-left">
                    <p className="font-semibold">Level Challenges</p>
                    <p className="text-sm opacity-90">Take on new levels</p>
                  </div>
                </div>
                <FaArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
