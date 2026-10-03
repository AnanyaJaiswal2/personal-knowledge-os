require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");


const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const documentRoutes = require("./routes/documents");
const queryRoutes = require("./routes/query");
app.use("/api/query", queryRoutes);
app.use("/api/documents", documentRoutes);
app.get("/api/health", async (req, res) => {
  res.json({
    status: "ok",
    dbConnected: mongoose.connection.readyState === 1,
  });
});

const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});