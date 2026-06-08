// ui.js
// Handles all DOM manipulation and rendering

const UI = {
  // DOM References
  chatWindow: null,
  welcomeState: null,
  userInput: null,
  sendBtn: null,
  charCount: null,
  currentFeatureTitle: null,
  currentFeatureSubtitle: null,
  activeFeatureLabel: null,
  featureBtns: null,
  sidebar: null,
  sidebarToggle: null,
  clearHistoryBtn: null,

  init() {
    this.chatWindow = document.getElementById("chatWindow");
    this.welcomeState = document.getElementById("welcomeState");
    this.userInput = document.getElementById("userInput");
    this.sendBtn = document.getElementById("sendBtn");
    this.charCount = document.getElementById("charCount");
    this.currentFeatureTitle = document.getElementById("currentFeatureTitle");
    this.currentFeatureSubtitle = document.getElementById("currentFeatureSubtitle");
    this.activeFeatureLabel = document.getElementById("activeFeatureLabel");
    this.featureBtns = document.querySelectorAll(".feature-btn");
    this.sidebar = document.getElementById("sidebar");
    this.sidebarToggle = document.getElementById("sidebarToggle");
    this.clearHistoryBtn = document.getElementById("clearHistory");

    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  },

  // Switch active feature in sidebar
  setActiveFeature(key) {
    this.featureBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.feature === key);
    });

    const feature = FEATURES[key];
    if (feature) {
      this.currentFeatureTitle.textContent = feature.name;
      this.currentFeatureSubtitle.textContent = feature.subtitle;
      this.activeFeatureLabel.textContent = feature.name;
      this.userInput.placeholder = feature.placeholder;
    }
  },

  // Hide the welcome state
  hideWelcome() {
    if (this.welcomeState) {
      this.welcomeState.style.display = "none";
    }
  },

  // Append a user message bubble
  appendUserMessage(text, featureName) {
    this.hideWelcome();

    const div = document.createElement("div");
    div.className = "message user";
    div.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-body">
        <div class="message-meta">
          <span class="message-role">You</span>
          <span class="message-feature-tag">${featureName}</span>
        </div>
        <div class="message-content">${this.escapeHtml(text)}</div>
      </div>
    `;
    this.chatWindow.appendChild(div);
    this.scrollToBottom();
    return div;
  },

  // Append a loading indicator
  appendLoading() {
    const div = document.createElement("div");
    div.className = "message assistant loading-message";
    div.id = "loading-indicator";
    div.innerHTML = `
      <div class="message-avatar">⬡</div>
      <div class="message-body">
        <div class="message-meta">
          <span class="message-role">AI Toolkit</span>
        </div>
        <div class="message-content">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `;
    this.chatWindow.appendChild(div);
    this.scrollToBottom();
    return div;
  },

  // Remove loading indicator
  removeLoading() {
    const loader = document.getElementById("loading-indicator");
    if (loader) loader.remove();
  },

  // Append an assistant message with markdown rendering
  appendAssistantMessage(text) {
    const div = document.createElement("div");
    div.className = "message assistant";

    const rendered = marked.parse(text);

    div.innerHTML = `
      <div class="message-avatar">⬡</div>
      <div class="message-body">
        <div class="message-meta">
          <span class="message-role">AI Toolkit</span>
        </div>
        <div class="message-content markdown-body">${rendered}</div>
      </div>
    `;

    this.chatWindow.appendChild(div);

    // Apply syntax highlighting to code blocks
    div.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });

    this.scrollToBottom();
    return div;
  },

  // Append an error message
  appendErrorMessage(errorType) {
    const messages = {
      NO_API_KEY:
        "⚠️ No API key found. Please enter your Gemini API key when prompted on the next request.",
      INVALID_API_KEY:
        "🔑 Invalid API key. Please check your key and try again. You can get a key at [aistudio.google.com](https://aistudio.google.com).",
      RATE_LIMITED:
        "⏳ Rate limit reached. Please wait a moment and try again. You may be sending requests too quickly.",
      EMPTY_INPUT: "💬 Please type something before sending!",
    };

    const text =
      messages[errorType] ||
      `❌ An error occurred: ${errorType}. Please try again.`;

    const div = document.createElement("div");
    div.className = "message assistant error-message";
    div.innerHTML = `
      <div class="message-avatar">⬡</div>
      <div class="message-body">
        <div class="message-meta">
          <span class="message-role">Error</span>
        </div>
        <div class="message-content">${marked.parse(text)}</div>
      </div>
    `;
    this.chatWindow.appendChild(div);
    this.scrollToBottom();
  },

  // Clear the chat window and restore welcome state
  clearChat() {
    this.chatWindow.innerHTML = "";
    const welcome = document.createElement("div");
    welcome.id = "welcomeState";
    welcome.className = "welcome-state";
    welcome.innerHTML = `
      <div class="welcome-icon">⬡</div>
      <h2>Select a feature and start exploring</h2>
      <p>Choose a tool from the sidebar, type your input, and let AI do the heavy lifting.</p>
    `;
    this.chatWindow.appendChild(welcome);
    this.welcomeState = welcome;
  },

  // Enable/disable send button
  setLoading(isLoading) {
    this.sendBtn.disabled = isLoading;
    this.userInput.disabled = isLoading;
  },

  // Get and clear input
  getInput() {
    return this.userInput.value.trim();
  },

  clearInput() {
    this.userInput.value = "";
    this.userInput.style.height = "auto";
    this.charCount.textContent = "0";
  },

  // Auto-resize textarea
  resizeInput() {
    this.userInput.style.height = "auto";
    this.userInput.style.height = Math.min(this.userInput.scrollHeight, 180) + "px";
    this.charCount.textContent = this.userInput.value.length;
  },

  scrollToBottom() {
    this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
  },

  escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  },

  // Prompt user for API key
  promptForApiKey() {
    const key = prompt(
      "🔑 Enter your Gemini API key to continue.\n\nGet a free key at: https://aistudio.google.com\n\nYour key is stored locally and never sent anywhere except Google's API."
    );
    if (key && key.trim()) {
      GeminiAPI.saveKey(key.trim());
      return true;
    }
    return false;
  },

  // Toggle sidebar collapse
  toggleSidebar() {
    if (window.innerWidth <= 768) {
      this.sidebar.classList.toggle("mobile-open");
    } else {
      this.sidebar.classList.toggle("collapsed");
    }
  },
};

// ===========================
// ANIMATED BACKGROUND CANVAS
// ===========================
function initBackground() {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener("resize", resize);

  const GRID_SIZE = 48;

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw dot grid
    ctx.fillStyle = "rgba(124, 106, 247, 0.18)";
    const cols = Math.ceil(width / GRID_SIZE) + 1;
    const rows = Math.ceil(height / GRID_SIZE) + 1;

    const now = Date.now() / 4000;

    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = x * GRID_SIZE;
        const py = y * GRID_SIZE;
        const dist = Math.sqrt(
          Math.pow((px - width / 2) / width, 2) +
          Math.pow((py - height / 2) / height, 2)
        );
        const wave = Math.sin(dist * 8 - now * 2) * 0.5 + 0.5;
        const opacity = 0.08 + wave * 0.14;

        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(px, py, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
}
