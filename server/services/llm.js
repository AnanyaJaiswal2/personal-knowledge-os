const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });

async function generateAnswer(question, contextChunks) {
  const context = contextChunks
    .map((chunk, i) => `[Source ${i + 1}]: ${chunk.text}`)
    .join("\n\n");

  const prompt = `You are answering a question using ONLY the context below, taken from the user's own documents.

Rules:
- Only use information from the context provided.
- If the context does not contain enough information to answer, say so clearly — do not guess or use outside knowledge.
- Keep the answer concise and directly address the question.

Context:
${context}

Question: ${question}

Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { generateAnswer };