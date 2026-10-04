import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/signup", { email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm bg-gray-900/70 backdrop-blur border border-gray-800 rounded-2xl p-8 relative z-10 shadow-2xl"
      >
       <Link to="/" className="flex items-center gap-2 mb-6">
  <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-sm">
    K
  </div>
  <span className="font-bold text-white">Knowledge OS</span>
</Link>

        <h1 className="text-3xl font-extrabold text-white mb-1 leading-tight">
          Create your account
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Start building your personal knowledge base
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-white placeholder-gray-500 p-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-white placeholder-gray-500 p-3 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
          />

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl px-5 py-3 transition mt-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Sign up
          </motion.button>

          <Link
            to="/login"
            className="text-sm text-gray-500 text-center mt-2 hover:text-violet-400 transition"
          >
            Already have an account? <span className="text-violet-400">Log in</span>
          </Link>
        </form>
      </motion.div>
    </div>
  );
}

export default Signup;