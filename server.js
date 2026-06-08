import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

dotenv.config();

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Serve all your static files (html, css, js)
app.use(express.static(__dirname));

// Expose the API key safely to the frontend
app.get("/config", (req, res) => {
  res.json({ apiKey: process.env.GEMINI_API_KEY });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ App running at http://localhost:${PORT}`);
});