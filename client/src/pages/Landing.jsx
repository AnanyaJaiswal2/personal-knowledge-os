import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "Capture",
    desc: "Drop in PDFs, paste notes, or add a URL — all your knowledge in one place.",
  },
  {
    title: "Retrieve",
    desc: "Ask questions in plain language and get answers grounded in your own documents.",
  },
  {
    title: "Learn",
    desc: "See exactly which sources backed every answer — nothing is a black box.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <nav className="relative z-10 flex justify-between items-center px-8 py-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center font-bold text-white text-xs">
            K
          </div>
          <span className="font-bold">Knowledge OS</span>
        </div>
        <Link
          to="/login"
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Log in
        </Link>
      </nav>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 pt-20 pb-24">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-xs font-medium text-violet-300 bg-violet-600/10 border border-violet-800/40 rounded-full px-4 py-1.5 mb-6"
        >
          Semantic search · RAG-powered Q&A · Source citations
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl font-extrabold leading-tight mb-5"
        >
          Your knowledge,
          <br />
          <span className="text-violet-400">finally searchable.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg mb-8 max-w-xl mx-auto"
        >
          Upload your documents, ask questions in plain language, and get
          answers grounded in what you actually wrote — not guesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-3"
        >
          <Link
            to="/signup"
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl transition shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          >
            Get Started Free
          </Link>
          <Link
            to="/login"
            className="border border-gray-700 hover:border-gray-500 text-gray-200 font-medium px-6 py-3 rounded-xl transition"
          >
            Log in
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-violet-800/50 transition"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold mb-4">
              {i + 1}
            </div>
            <h3 className="font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Landing;