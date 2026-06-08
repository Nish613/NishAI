// config.js
// In a real Node.js/backend app, this would load from .env via dotenv.
// Since this is a pure frontend app, the API key is entered at runtime.
// The .env file is included for documentation and for use with any
// backend wrapper (e.g. a simple Express server) you might add later.

const CONFIG = {
  // Gemini API endpoint
GEMINI_API_URL:
"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",

  // Max tokens for response
  MAX_OUTPUT_TOKENS: 2048,

  // Temperature (0 = deterministic, 1 = creative)
  TEMPERATURE: 0.7,

  // Storage key for API key
  API_KEY_STORAGE: "gemini_api_key",

  // Storage key for chat history
  HISTORY_STORAGE: "ai_toolkit_history",
};
