import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Levels() {
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://farha31.pythonanywhere.com/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    const fetchLevels = async () => {
      try {
        const res = await fetch(`${API_BASE}/levels/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch levels");
        const data = await res.json();

        setLevels(data.levels || []);
        setCurrentLevel(data.current_level || 1);
      } catch (err) {
        console.error(err);
        toast.error("Error loading levels ⚠️");
      } finally {
        setLoading(false);
      }
    };

    fetchLevels();
  }, []);

  const handleLevelClick = (lvlNumber) => {
    if (lvlNumber > currentLevel) {
      toast.error("This level is locked 🔒");
      return;
    }
    navigate(`/practice/${lvlNumber}`);
  };

  if (loading) {
    return <div className="text-center mt-10">Loading levels...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-100 p-8">
      <h1 className="text-3xl font-extrabold text-center text-green-700 mb-10">
        Your Levels 🌟
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {levels.map((lvl) => {
          const locked = lvl.number > currentLevel;
          return (
            <div
              key={lvl.id}
              onClick={() => handleLevelClick(lvl.number)}
              className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all ${
                locked
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-green-50"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">Level {lvl.number}</h2>
              <p>{lvl.title}</p>
              {locked ? (
                <p className="mt-3 text-sm">🔒 Locked</p>
              ) : (
                <p className="mt-3 text-sm text-green-600">✅ Available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
