# AI-Summariser-Chrome-Extension-
AI Article Summariser is a Chrome extension that helps users quickly understand long web articles by generating concise summaries using the Google Gemini API.
The extension extracts the main content from a webpage and sends it to the Gemini model to produce a short, readable summary. This allows users to save time and get the key points of any article instantly.

**Features**

- Summarize any webpage instantly

- Uses Google Gemini API for AI-powered summaries

- Simple popup interface inside the browser

- User provides their own Gemini API key

- API key stored securely using chrome.storage.local

- Works on most websites

**How It Works**
- User enters their Gemini API key in the extension settings.

- The extension extracts the main text from the current webpage.

- The content is sent to the Gemini API.

- The AI returns a concise summary which is displayed in the popup.

**Tech Stack**
- Chrome Extension (Manifest V3)

- JavaScript

- HTML/CSS

- Chrome Extension APIs

- Google Gemini API

**Installation (Developer Mode)**
-> Clone the repository

-> Open Chrome and go to chrome://extensions

-> Enable Developer Mode

-> Click Load Unpacked

-> Select the project folder

**Security**
The extension does not store API keys on any external server.
The Gemini API key is stored locally using Chrome's extension storage and is only used when generating summaries.
