import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Network error during signup");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-indigo-600">
          Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Username</label>
            <input
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none transition"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            whileTap={{ scale: 0.95 }}
            onClick={handleSignup}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Sign Up
          </motion.button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
