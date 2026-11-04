require("dotenv").config();

const express = require("express");
const cors = require("cors");
const contactRoute = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/contact", contactRoute);

// Health check — useful for deployment platforms
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
