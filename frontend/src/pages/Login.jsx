import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/PublicNavbar";
import { FiUser, FiLock, FiChevronRight } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen bg-dark-900 overflow-hidden font-inter">
      <PublicNavbar />
      
      {/* Background with cinematic overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero_bg.png" 
          alt="Login Background" 
          className="w-full h-full object-cover scale-110 blur-sm opacity-40 translate-y-[-5%]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-dark-900 via-dark-900/40 to-emerald-500/10" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-md w-full animate-fade-in">
          <div className="glass-card p-10 border-white/5 shadow-2xl backdrop-blur-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                Welcome <span className="text-gradient">Back</span>
              </h2>
              <p className="text-slate-400 font-medium">Please enter your details to sign in</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 mb-8 rounded-xl text-center text-sm font-semibold animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center gap-2 group py-4 h-auto text-lg"
              >
                Sign In <FiChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}