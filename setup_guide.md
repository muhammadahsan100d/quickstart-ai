# Local Chatbot Widget Integration & Setup Guide

This guide describes how to configure, install, and render the local chatbot widget (`chatbot-widget`) in any external React / Vite project on your computer.

---

## 🛠️ Step 1: Install the Local Package

Since the chatbot widget package lives locally on your computer, you must reference it using a filesystem path in your new project.

Open a terminal in your **new project directory** and run the install command with the relative path to `react-chatbot-main`:

```bash
npm install <relative-path-to-react-chatbot-main>
```

### Example
If your new project is located at `C:/Users/Name/Music/demo-website` and the chatbot package is at `C:/Users/Name/Music/quickstart-ai/react-chatbot-main`, run:
```bash
npm install ../quickstart-ai/react-chatbot-main
```

*(Note: Remember to run `npm run bundle` in `react-chatbot-main` to compile your latest edits before installing).*

---

## 💻 Step 2: Import and Render the Widget

The widget uses a **named export** called `ChatBot` (not a default export). 

Open your main React entry file (e.g., `App.jsx` or `index.jsx`) and integrate the component:

1. **Import the ChatBot component**:
   ```javascript
   import { ChatBot } from 'chatbot-widget';
   ```

2. **Render it inside your component layout**:
   ```jsx
   function App() {
     return (
       <div className="app-container">
         {/* Your page layout here */}
         
         {/* Chatbot Floating Widget */}
         <ChatBot
           token="YOUR_CHATBOT_TOKEN" // Replace with the token generated from your dashboard
           theme="primary"             // Options: 'primary' | 'secondary' | 'professional' | 'tech'
           wantToShowSuggestions={true}
         />
       </div>
     );
   }
   ```

---

## ⚡ Step 3: Configure Vite to Prevent Duplicate React Warnings

When installing a local package via file paths, npm resolves dependencies in both folders. This can result in two instances of React running in the browser, causing the console error:
> `Warning: Invalid hook call. Hooks can only be called inside of the body of a function component.`

To fix this, configure your bundler (Vite) to alias all React imports to your new website's local node modules.

Open your **`vite.config.js`** file and add `resolve.alias` configuration:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Import path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 2. Force a single React instance
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
})
```

---

## 🔌 Step 4: Run the Backend Server

The chatbot widget communicates with your local backend to fetch the business information and process answers. 

1. Ensure the **Backend** server is started before testing the website (to avoid `net::ERR_CONNECTION_REFUSED` errors):
   ```bash
   cd Backend
   npm run dev
   ```
2. The server must be listening on port `3100` (`Server is running on port 3100`).

---

## 🌐 CORS (Cross-Origin Resource Sharing) Note
The backend CORS policy is configured to automatically allow connections from **any localhost origin** (e.g. `http://localhost:5173`, `http://localhost:5174`, etc.).
* If you run your new website on a different port, the backend will automatically approve it.
* If you deploy the backend and widget to a **live production URL**, update the backend CORS list inside `Backend/index.js` and update the base URL inside `react-chatbot-main/src/baseUrl.tsx` to match the hosted domains.
