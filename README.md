# Personal Knowledge OS

A full-stack RAG (Retrieval-Augmented Generation) application that lets you upload your own documents — PDFs, notes, or URLs — and ask questions about them in plain language, with answers grounded in your actual content and backed by visible source citations.

**Live demo:** https://personal-knowledge-os-zeta.vercel.app/

## What it does

1. **Capture** — Upload a PDF, paste a text note, or add a URL
2. **Process** — Text is extracted, split into chunks, and converted into vector embeddings
3. **Retrieve** — Ask a question; the app finds the most semantically relevant chunks from your own documents using vector similarity search
4. **Generate** — An LLM answers your question using only the retrieved context, and shows exactly which sources it used

This isn't a general-purpose chatbot — every answer is grounded in content you personally uploaded, and you can always see which chunk of which document backed up the answer.

## Tech stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (documents, chunks) + Atlas Vector Search (semantic retrieval)
- **AI:** Google Gemini — `gemini-embedding-001` for embeddings, `gemini-3.8-flash` for answer generation
- **Auth:** JWT + bcrypt
- **Deployment:** Vercel (frontend), Render (backend)

## Architecture

User uploads document (PDF / text / URL)
→ Text extraction → Chunking (500 chars, 50 overlap) → Embedding (Gemini)
→ Stored in MongoDB with vector index

User asks a question
→ Question embedded with the same model
→ Atlas Vector Search finds top 5 most similar chunks (cosine similarity)
→ Chunks + question sent to Gemini with a grounding prompt
→ Answer + source chunks returned to the user


## Key design decisions

- **MongoDB Atlas Vector Search instead of a separate vector database** — kept the stack to one database for documents, chunks, and vectors, rather than running a second service like Pinecone or Chroma.
- **Synchronous processing on upload** — chunking and embedding happen before the upload request returns, rather than using a background job queue. Simpler for this scale; a production version at higher volume would move this to an async queue so uploads respond instantly.
- **Explicit grounding instructions in the prompt** — the LLM is told to only use the provided context and say so if the answer isn't there, which is what keeps answers tied to the user's actual documents instead of the model's general knowledge.

## Running locally

```bash
# Backend
cd server
npm install
# add MONGO_URI, JWT_SECRET, GEMINI_API_KEY to a .env file
npm start

# Frontend
cd client
npm install
# add VITE_API_URL=http://localhost:5000/api to a .env file
npm run dev
```

## Known limitations

- PDF text extraction doesn't support scanned/image-based PDFs (no OCR)
- No background job queue — large documents block the upload response until fully processed
- No chat history — each question is answered independently