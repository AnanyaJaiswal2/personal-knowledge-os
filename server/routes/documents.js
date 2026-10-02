const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/auth");
const Document = require("../models/Document");
const { extractFromPdf, extractFromUrl } = require("../services/extraction");
const { chunkText } = require("../services/chunking");
const { generateEmbedding } = require("../services/embedding");
const Chunk = require("../models/Chunk");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    let title, sourceType, rawText;

    if (req.file) {
      // PDF upload
      sourceType = "pdf";
      title = req.file.originalname;
      rawText = await extractFromPdf(req.file.buffer);
    } else if (req.body.type === "url") {
      sourceType = "url";
      title = req.body.url;
      rawText = await extractFromUrl(req.body.url);
    } else if (req.body.type === "text") {
      sourceType = "text";
      title = req.body.title || "Untitled note";
      rawText = req.body.content;
    } else {
      return res.status(400).json({ error: "Invalid document source" });
    }

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({ error: "No text could be extracted" });
    }

    const document = await Document.create({
      userId: req.userId,
      title,
      sourceType,
      rawText,
      status: "ready",
    });

       const textChunks = chunkText(rawText);

    for (let i = 0; i < textChunks.length; i++) {
      const embedding = await generateEmbedding(textChunks[i]);
      await Chunk.create({
        documentId: document._id,
        userId: req.userId,
        text: textChunks[i],
        embedding,
        chunkIndex: i,
      });
    }

    console.log(`Created ${textChunks.length} chunks for document ${document._id}`);

    res.status(201).json(document);
  } catch (err) {
  console.error("Upload error:", err.message);
  res.status(500).json({ error: err.message });
}
});

router.get("/", authMiddleware, async (req, res) => {
  const documents = await Document.find({ userId: req.userId })
    .select("-rawText")
    .sort({ createdAt: -1 });
  res.json(documents);
});
router.get("/debug/chunks/:documentId", authMiddleware, async (req, res) => {
  const chunks = await Chunk.find({ documentId: req.params.documentId });
  res.json(chunks);
});
module.exports = router;