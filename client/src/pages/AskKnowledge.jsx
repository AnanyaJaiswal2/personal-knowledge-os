import { useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Send, Sparkles, FileText } from "lucide-react";
function AskKnowledge() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 

  const handleAsk = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setAnswer("");
    setSources([]);

    try {
      const res = await api.post("/query", { question });
      setAnswer(res.data.answer);
      setSources(res.data.sources || []);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

    return (
    <Layout>
      <h1 className="text-3xl font-extrabold text-white mb-1">
        Ask Your <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Knowledge</span>
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Get answers grounded in your own documents.
      </p>

      <form onSubmit={handleAsk} className="flex gap-2 mb-6">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your documents..."
          className="bg-gray-900/60 border border-gray-800 text-white placeholder-gray-500 p-3 rounded-xl flex-1 focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
        />
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || !question.trim()}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-5 py-3 rounded-xl transition shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
          {!loading && <Send size={16} />}
        </motion.button>
      </form>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {answer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-violet-600/10 border border-violet-800/40 rounded-2xl p-5 mb-6"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-violet-400 mb-2">
            <Sparkles size={15} />
            Answer
          </p>
          <p className="text-gray-100 leading-relaxed">{answer}</p>
        </motion.div>
      )}

      {sources.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">Sources used</p>
          <ul className="flex flex-col gap-2">
            {sources.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex gap-3 hover:border-gray-700 transition"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center flex-shrink-0">
                  <FileText size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm leading-relaxed">{s.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Relevance score: {s.score?.toFixed(3)}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  );
}

export default AskKnowledge;