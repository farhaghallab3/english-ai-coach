import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  const { login } = useAuth();
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields ✏️");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),


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
    <div className="flex flex-col min-h-screen">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-violet-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center px-4 pt-24 pb-8 relative bg-slate-700 z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <FaSignInAlt />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gradient">
                Welcome Back
              </h1>
            </div>
            <p className="text-gray-300 text-lg">
              Continue your English learning journey
            </p>
          </div>

          {/* Login Form */}
          <div className="glass-card p-8 scale-in">
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaUser className="text-cyan-400" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="input-field w-full pl-4 pr-4"
                    placeholder="Enter your email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <FaLock className="text-violet-400" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="input-field w-full pl-4 pr-12"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`btn-primary w-full text-lg py-4 btn-hover-lift flex items-center justify-center gap-3 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing you in...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Login to Your Account
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <span className="px-3 text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                New to Own Language?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors hover:underline"
                >
                  Create your account
                </button>
              </p>
            </div>

            {/* Features Preview */}
            <div className="mt-8 p-4 glass-card">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-sm">
                  🚀
                </div>
                <span className="text-white font-semibold">What awaits you:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  <span>AI Chat Tutor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                  <span>Voice Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span>Progress Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span>Personalized Learning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
