import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import Layout from "../components/Layout";
import { FileText, Link as LinkIcon, Upload, ArrowRight } from "lucide-react";
function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [mode, setMode] = useState("text"); // "text" | "url" | "pdf"
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    const res = await api.get("/documents");
    setDocuments(res.data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setUrl("");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      if (mode === "pdf") {
        if (!file) {
          setError("Please choose a PDF file");
          setUploading(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        await api.post("/documents", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (mode === "text") {
        await api.post("/documents", { type: "text", title, content });
      } else if (mode === "url") {
        await api.post("/documents", { type: "url", url });
      }

      resetForm();
      await fetchDocuments();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };


  return (
    <Layout>
     <p className="text-sm text-gray-500 mb-1">
  Good to see you, {localStorage.getItem("email")?.split("@")[0] || "there"} 👋
</p>
<h1 className="text-3xl font-extrabold text-white mb-1">
  Your <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Knowledge</span>
</h1>
<p className="text-gray-400 text-sm mb-6">Capture anything. Ask anything. Learn forever.</p>
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 mb-8 shadow-xl"
      >
        <div className="flex gap-2 mb-4">
         {[
  { key: "text", label: "Paste Text", icon: FileText },
  { key: "url", label: "Add URL", icon: LinkIcon },
  { key: "pdf", label: "Upload PDF", icon: Upload },
].map(({ key, label, icon: Icon }) => (
  <button
    key={key}
    type="button"
    onClick={() => setMode(key)}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
      mode === key
        ? "bg-violet-600 text-white"
        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
    }`}
  >
    <Icon size={15} />
    {label}
  </button>
))}
        </div>

        {mode === "text" && (
          <div className="flex flex-col gap-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-white placeholder-gray-500 p-2.5 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
            />
            <textarea
              placeholder="Paste your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-950 border border-gray-800 text-white placeholder-gray-500 p-2.5 rounded-xl h-32 focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
            />
          </div>
        )}

        {mode === "url" && (
          <input
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="bg-gray-950 border border-gray-800 text-white placeholder-gray-500 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-violet-500 focus:outline-none transition"
          />
        )}

        {mode === "pdf" && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-gray-400 text-sm"
          />
        )}

        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <motion.button
  whileTap={{ scale: 0.98 }}
  type="submit"
  disabled={uploading}
  className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-5 py-2.5 rounded-xl mt-4 transition shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
>
  {uploading ? "Processing..." : "Add to knowledge base"}
  {!uploading && <ArrowRight size={16} />}
</motion.button>
      </form>

      <h2 className="text-lg font-semibold text-white mb-3">Your documents</h2>
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm">No documents yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {documents.map((doc, i) => (
           <motion.li
  key={doc._id}
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: i * 0.05 }}
  className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 flex items-center gap-3 hover:border-gray-700 transition"
>
  <div className="w-9 h-9 rounded-lg bg-violet-600/15 text-violet-400 flex items-center justify-center flex-shrink-0">
    {doc.sourceType === "pdf" && <FileText size={16} />}
    {doc.sourceType === "url" && <LinkIcon size={16} />}
    {doc.sourceType === "text" && <FileText size={16} />}
  </div>
  <div className="flex-1">
    <p className="font-medium text-white">{doc.title}</p>
    <p className="text-xs text-gray-500">{doc.sourceType}</p>
  </div>
  <span
    className={`text-xs px-2 py-1 rounded-full ${
      doc.status === "ready"
        ? "bg-green-500/10 text-green-400"
        : "bg-yellow-500/10 text-yellow-400"
    }`}
  >
    {doc.status}
  </span>
</motion.li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

export default Dashboard;