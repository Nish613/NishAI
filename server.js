import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from current folder
app.use(express.static(__dirname));

// Expose the API key safely to the frontend
app.get("/config", (req, res) => {
  res.json({ apiKey: process.env.GEMINI_API_KEY });
});

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});