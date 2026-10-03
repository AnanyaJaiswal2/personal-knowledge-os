const { generateAnswer } = require("../services/llm");
const express = require("express");
const authMiddleware = require("../middleware/auth");
const Chunk = require("../models/Chunk");
const { generateEmbedding } = require("../services/embedding");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: "Question is required" });
    }

    const queryVector = await generateEmbedding(question);

    const results = await Chunk.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryVector,
          numCandidates: 100,
          limit: 5,
        },
      },
     { $match: { userId: new mongoose.Types.ObjectId(req.userId) } },
      {
        $project: {
          text: 1,
          documentId: 1,
          chunkIndex: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

       if (results.length === 0) {
      return res.json({
        question,
        answer: "I couldn't find anything relevant in your documents to answer this.",
        sources: [],
      });
    }

    const answer = await generateAnswer(question, results);

    res.json({
      question,
      answer,
      sources: results.map((r) => ({
        documentId: r.documentId,
        chunkIndex: r.chunkIndex,
        text: r.text,
        score: r.score,
      })),
    });
  } catch (err) {
    console.error("Query error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;