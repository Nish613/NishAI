// app.js
// Main application logic — wires UI + API together, manages chat history

const App = {
  currentFeature: "explain",
  chatHistory: [], // Full conversation history [{role, content, feature}]

  init() {
    UI.init();
    initBackground();
    this.loadHistory();
    this.bindEvents();
    UI.setActiveFeature(this.currentFeature);
  },

  bindEvents() {
    // Feature selection
    UI.featureBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.currentFeature = btn.dataset.feature;
        UI.setActiveFeature(this.currentFeature);

        // On mobile, close sidebar after selection
        if (window.innerWidth <= 768) {
          UI.sidebar.classList.remove("mobile-open");
        }
      });
    });

    // Send button
    UI.sendBtn.addEventListener("click", () => this.send());

    // Enter to send (Shift+Enter for newline)
    UI.userInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.send();
      }
    });

    // Textarea auto-resize + char count
    UI.userInput.addEventListener("input", () => UI.resizeInput());

    // Sidebar toggle
    UI.sidebarToggle.addEventListener("click", () => UI.toggleSidebar());

    // Clear history
    UI.clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Clear all chat history?")) {
        this.chatHistory = [];
        this.saveHistory();
        UI.clearChat();
      }
    });
  },

  async send() {
    const input = UI.getInput();

    if (!input) {
      UI.appendErrorMessage("EMPTY_INPUT");
      return;
    }

    // Check for API key
    if (!GeminiAPI.hasKey()) {
      const provided = UI.promptForApiKey();
      if (!provided) {
        UI.appendErrorMessage("NO_API_KEY");
        return;
      }
    }

    const feature = FEATURES[this.currentFeature];
    UI.clearInput();
    UI.setLoading(true);

    // Show user message
    UI.appendUserMessage(input, feature.name);

    // Add to history
    this.chatHistory.push({
      role: "user",
      content: input,
      feature: this.currentFeature,
    });

    // Show loading
    UI.appendLoading();

    try {
      // Build conversation history for API (only content, role)
      const apiHistory = this.chatHistory.slice(0, -1).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await GeminiAPI.send(input, this.currentFeature, apiHistory);

      UI.removeLoading();
      UI.appendAssistantMessage(response);

      // Add assistant response to history
      this.chatHistory.push({
        role: "assistant",
        content: response,
        feature: this.currentFeature,
      });

      this.saveHistory();
    } catch (err) {
      UI.removeLoading();
      console.error("API Error:", err);

      if (err.message === "INVALID_API_KEY") {
        // Clear bad key and prompt again
        localStorage.removeItem(CONFIG.API_KEY_STORAGE);
        UI.appendErrorMessage("INVALID_API_KEY");
      } else if (err.message === "RATE_LIMITED") {
        UI.appendErrorMessage("RATE_LIMITED");
      } else {
        UI.appendErrorMessage(err.message);
      }

      // Remove the user message from history on failure
      this.chatHistory.pop();
    } finally {
      UI.setLoading(false);
      UI.userInput.focus();
    }
  },

  saveHistory() {
    try {
      // Keep last 100 messages in storage
      const toSave = this.chatHistory.slice(-100);
      localStorage.setItem(CONFIG.HISTORY_STORAGE, JSON.stringify(toSave));
    } catch (e) {
      console.warn("Could not save history:", e);
    }
  },

  loadHistory() {
    try {
      const saved = localStorage.getItem(CONFIG.HISTORY_STORAGE);
      if (!saved) return;

      const history = JSON.parse(saved);
      if (!Array.isArray(history) || history.length === 0) return;

      this.chatHistory = history;

      // Render saved messages
      for (const msg of history) {
        const feature = FEATURES[msg.feature] || FEATURES["explain"];
        if (msg.role === "user") {
          UI.appendUserMessage(msg.content, feature.name);
        } else {
          UI.appendAssistantMessage(msg.content);
        }
      }

      UI.scrollToBottom();
    } catch (e) {
      console.warn("Could not load history:", e);
      this.chatHistory = [];
    }
  },
};

// Start the app
document.addEventListener("DOMContentLoaded", () => App.init());
