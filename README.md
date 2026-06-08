# NishAI - AI Toolkit

NishAI is a web-based AI tool that takes user input, sends it to an LLM API, and displays the generated response.

## Live Demo

[https://6a26659fcc908739e949a68f--nishaifinal1.netlify.app/](https://6a266c07ecc154000815b1a9--nishai.netlify.app/)

---

## Task Objective

The objective of this task was to create a small application that:

- Takes text input from the user
- Sends the input to an LLM through an API
- Displays the model's response
- Handles empty inputs gracefully
- Includes at least 3 custom prompts/features

---

## Project Description

NishAI is an AI-powered web application where users can select a feature, enter text, and get an AI-generated response.

The app includes multiple AI tools such as explaining a concept, summarizing text, converting text into bullet points.

The project uses a frontend built with **HTML, CSS, and JavaScript** and a backend built with **Node.js and Express.js**. The backend sends the user input to the LLM API and returns the generated response to the frontend.

---

## Features

The project includes the following AI features:

- Explain a concept
- Summarize text
- Convert text into bullet points

---

## The following features were also added:

- Web interface using HTML, CSS, and JavaScript
- Chat history
- Markdown rendering
- Loading animation
- Clean and responsive user interface
- Backend API handling
- Environment variable support using `.env`

---

## Tech Stack

## Frontend

- HTML
- CSS
- JavaScript
- Marked.js for Markdown rendering

## Backend

- Node.js
- Express.js

## Other Tools

- dotenv
- Git
- GitHub
- Netlify

---

## Project Structure

```bash
TASK1_GENAI/
│
├── .vscode/
│
├── css/
│   └── style.css
│
├── js/
│   ├── api.js
│   ├── app.js
│   ├── config.js
│   ├── prompts.js
│   └── ui.js
│
├── node_modules/
│
├── .env
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

---

## File Explanation

## `index.html`

This is the main HTML file of the project.

It contains the structure of the website, including:

- Main page layout
- Input area
- Feature selection section
- Generate button
- Response display area
- Chat history section

---

## `css/style.css`

This file contains the styling of the project.

It is used for:

- Page layout
- Fonts
- Colors
- Buttons
- Input box styling
- Loading animation
- Responsive design

---

## `js/app.js`

This is the main frontend JavaScript file.

It handles:

- User input
- Button clicks
- Feature selection
- Empty input checking
- Calling the API function
- Connecting the frontend logic together

---

## `js/api.js`

This file handles API requests.

It sends the selected feature and user input from the frontend to the backend server.

---

## `js/config.js`

This file contains configuration-related code for the frontend.

---

## `js/prompts.js`

This file contains the custom AI prompts and features.

Each feature has:

- Name
- Subtitle
- Placeholder
- System prompt

These prompts tell the AI how to respond for each selected feature.

---

## `js/ui.js`

This file handles user interface updates.

It is used for:

- Displaying AI responses
- Showing loading animation
- Rendering Markdown output
- Updating chat history
- Showing error or empty input messages

---

## `server.js`

This is the backend server file.

It is responsible for:

- Running the Express server
- Receiving user input from the frontend
- Sending the prompt to the LLM API
- Returning the AI-generated response to the frontend

---

## `.env`

This file stores private environment variables.

Example:

```env
GEMINI_API_KEY=your_api_key_here
```

The `.env` file should not be uploaded to GitHub.

---

## `.gitignore`

This file is used to prevent sensitive or unnecessary files from being uploaded to GitHub.

Example:

```gitignore
node_modules/
.env
```

---

## `package.json`

This file contains project information, dependencies, and scripts.

It includes the packages required to run the project.

---


## How to Use the App

1. Open the website.
2. Select an AI feature.
3. Enter text in the input box.
4. Click the generate button.
5. Wait for the loading animation.
6. View the AI-generated response.
7. Previous prompts and responses are shown in chat history.

---

## Empty Input Handling

The app handles empty inputs gracefully.

If the user clicks the generate button without typing anything, the app displays a message asking the user to enter some text first.

This prevents unnecessary API calls and improves the user experience.

---

## Markdown Rendering

The AI responses are rendered using Markdown.

This allows the response to include:

- Headings
- Bullet points
- Numbered lists
- Bold text
- Code blocks
- Clean formatting

---

## Chat History

The project maintains chat history during the session.

This allows users to view their previous prompts and AI responses without losing them immediately after generating a new response.

---

## Loading Animation

A loading animation is displayed while the AI response is being generated.

This improves the user experience because the user knows that the request is being processed.

---

## API Key Safety

The API key is stored inside the `.env` file.

The `.env` file is added to `.gitignore`, so it is not uploaded to GitHub.

This keeps the API key private and secure.

---
