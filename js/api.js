// api.js
// Handles all communication with the Gemini API

const GeminiAPI = {

  // Fetch API key from server (reads from .env)
  async getKeyFromServer() {
  const res = await fetch("/.netlify/functions/config");
  const data = await res.json();
  return data.apiKey || "";
},
  // Save the API key to localStorage (fallback)
  saveKey(key) {
    localStorage.setItem(CONFIG.API_KEY_STORAGE, key.trim());
  },

  // Always return true since key comes from server
  hasKey() {
    return true;
  },

  // Send a message to Gemini
  async send(userMessage, featureKey, conversationHistory = []) {
    const apiKey = await this.getKeyFromServer();
    if (!apiKey) throw new Error("NO_API_KEY");

    const feature = FEATURES[featureKey];
    if (!feature) throw new Error("Invalid feature selected");

    const contents = [];

    const recentHistory = conversationHistory.slice(-20);
    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: `${feature.systemPrompt}\n\n---\n\nUser Input:\n${userMessage}`,
        },
      ],
    });

    const requestBody = {
      contents,
      generationConfig: {
        maxOutputTokens: CONFIG.MAX_OUTPUT_TOKENS,
        temperature: CONFIG.TEMPERATURE,
      },
    };

    const response = await fetch(
      `${CONFIG.GEMINI_API_URL}?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData?.error?.message || `HTTP ${response.status}`;

      if (response.status === 400 && message.includes("API_KEY")) {
        throw new Error("INVALID_API_KEY");
      }
      if (response.status === 429) {
        throw new Error("RATE_LIMITED");
      }
      throw new Error(message);
    }

    const data = await response.json();

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received.";

    return text;
  },
};