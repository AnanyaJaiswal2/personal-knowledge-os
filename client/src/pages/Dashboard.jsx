import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Knowledge</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/ask")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Ask Knowledge
          </button>
          <button onClick={handleLogout} className="text-sm text-gray-500">
            Log out
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border rounded p-4 mb-8">
        <div className="flex gap-2 mb-4">
          {["text", "url", "pdf"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded text-sm ${
                mode === m ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {m === "text" ? "Paste text" : m === "url" ? "Add URL" : "Upload PDF"}
            </button>
          ))}
        </div>

        {mode === "text" && (
          <div className="flex flex-col gap-2">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
            />
            <textarea
              placeholder="Paste your note here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="border p-2 rounded h-32"
            />
          </div>
        )}

        {mode === "url" && (
          <input
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border p-2 rounded w-full"
          />
        )}

        {mode === "pdf" && (
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
        >
          {uploading ? "Processing..." : "Add to knowledge base"}
        </button>
      </form>

      <h2 className="text-lg font-semibold mb-3">Your documents</h2>
      {documents.length === 0 ? (
        <p className="text-gray-500 text-sm">No documents yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {documents.map((doc) => (
            <li
              key={doc._id}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{doc.title}</p>
                <p className="text-xs text-gray-500">{doc.sourceType}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  doc.status === "ready"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {doc.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;