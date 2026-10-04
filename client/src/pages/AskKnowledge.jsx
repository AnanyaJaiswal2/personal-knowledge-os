import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function AskKnowledge() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ask Your Knowledge</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-blue-600"
        >
          ← Back to Library
        </button>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2 mb-6">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something about your documents..."
          className="border p-2 rounded flex-1"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {answer && (
        <div className="border rounded p-4 mb-6 bg-blue-50">
          <p className="text-sm font-semibold text-gray-500 mb-1">Answer</p>
          <p>{answer}</p>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">
            Sources used
          </p>
          <ul className="flex flex-col gap-2">
            {sources.map((s, i) => (
              <li key={i} className="border rounded p-3 text-sm">
                <p className="text-gray-700">{s.text}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Relevance score: {s.score?.toFixed(3)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AskKnowledge;