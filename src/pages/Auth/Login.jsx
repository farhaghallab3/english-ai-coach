import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://farha31.pythonanywhere.com/api";

  const { login } = useAuth();
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields ✏️");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Invalid credentials ❌");
        setLoading(false);
        return;
      }

      if (res.ok) {
  const userData = {
    id: data.user_id,
    name: data.name,
    email: data.email,
    access: data.access,
    refresh: data.refresh,
  };
  login(userData);
  navigate("/");
}

      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);

      localStorage.setItem("user_name", data.name);
      window.dispatchEvent(new Event("userUpdated"));
  
localStorage.setItem("user_name", data.name);
localStorage.setItem("email", data.email);
localStorage.setItem("user_id", data.user_id);
localStorage.setItem("token", data.access);
localStorage.setItem("refresh", data.refresh);
window.dispatchEvent(new Event("userUpdated"));



      toast.success("Welcome back 🎉", { duration: 2000 });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Network error 😥");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-600">
          Welcome Back 👋
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {loading ? (
              <>
                <span className="loader border-t-transparent border-white w-5 h-5 rounded-full border-2 animate-spin"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-purple-600 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
