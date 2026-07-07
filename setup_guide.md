# 🚀 Super Simple Guide: How to Add Your Chatbot to Any New Website

This is a step-by-step guide written for beginners. Follow these simple steps to put your chatbot on any React/Vite website!

---

## 📂 Step 1: Put Your Folders Side-by-Side
Make sure your **website folder** and your **quickstart-ai folder** are in the same directory (like your `Music` or `Documents` folder).

---

## 📥 Step 2: Install the Chatbot Package
1. Open your terminal in your **website folder** (e.g., `demo-website`).
2. Copy and paste this command, then press **Enter**:
   ```bash
   npm install ../quickstart-ai/quickstart-ai/quickstart-ai/react-chatbot-main
   ```
   *This links the chatbot folder to your website.*

---

## 💻 Step 3: Put the Chatbot on Your Page
1. Open the file **`src/App.jsx`** inside your website folder.
2. At the very top of the file, add this line:
   ```javascript
   import { ChatBot } from 'chatbot-widget';
   ```
3. Inside the layout code, add this block anywhere you want the chatbot floating bubble to show up:
   ```jsx
   <ChatBot
     token="A1ED-7127544F-1EBAF3E7" // Your chatbot ID from the dashboard
     theme="primary"
     wantToShowSuggestions={true}
   />
   ```

---

## 🛠️ Step 4: Fix the "Double React" Loading (Important)
Because the chatbot and website folders are local, they might try to load two copies of React at the same time. We need to tell the site to only use one.

1. Open the file **`vite.config.js`** inside your website folder.
2. Select everything in that file, delete it, and paste this exact code:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
})
```

---

## 🔌 Step 5: Turn on the Chatbot Server & Run!
For the chatbot to speak and answer questions, your backend server must be running:

1. Open a terminal in your backend folder (**`quickstart-ai/Backend`**) and run:
   ```bash
   npm run dev
   ```
   *Leave this running in the background!*

2. Open another terminal in your website folder (**`demo-website`**) and run:
   ```bash
   npm run dev
   ```
3. Open the link shown (usually `http://localhost:5173`) in your web browser. You're done! Your chatbot is live and chatting! 🎉
