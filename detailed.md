# QuickStart AI - Detailed Project Overview & Integration Test Plan

This document provides a comprehensive technical overview of the **QuickStart AI** project. It is structured to help you (or another AI assistant like Antigravity) understand the codebase and create a separate mockup website to integrate, configure, and test the `@quickstart-ai/chatbot` NPM package.

---

## 1. Project Overview & Architecture

**QuickStart AI** is a SaaS platform designed for businesses to integrate context-aware, AI-powered customer support chatbots into their websites.

```mermaid
graph TD
    User([Business Owner]) -->|Registers & Configures Business Info| Frontend[Next.js Frontend Dashboard]
    Frontend -->|Generates API Token| Backend[Express Backend]
    Backend -->|Saves Details & Tokens| MongoDB[(MongoDB Atlas)]
    
    Sub[Customer/Guest] -->|Visits Client Website| ExternalSite[Mockup Landing Page]
    ExternalSite -->|Loads Widget with Token| NPM[@quickstart-ai/chatbot NPM Package]
    NPM -->|1. Verifies Token| Backend
    NPM -->|2. Creates Chat Session| Backend
    NPM -->|3. Sends Messages| Backend
    Backend -->|Contextual Response Generation| Pollinations[Pollinations AI]
```

### Tech Stack
* **Frontend:** Next.js 14 (App Router, Tailwind CSS, NextUI, Radix UI, Redux Toolkit).
* **Backend:** Node.js, Express, MongoDB (Mongoose), CORS.
* **AI Service:** Integrated with **Pollinations AI** (provides free, unlimited, fallback-aware LLM generation; migrated from Google Gemini).
* **Integration Widget:** `@quickstart-ai/chatbot` (a published React library that renders the chatbot UI and communicates with the backend).

---

## 2. Port & Environment Configurations

* **Backend Server:** 
  * Running locally at: `http://localhost:3100` (Defined in [Backend/index.js](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Backend/index.js)).
  * Configuration directory: [Backend/config/.env](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Backend/config/.env).
* **Frontend Application:**
  * Running locally at: `http://localhost:3000` (Standard Next.js development server).
  * API Base URL: `http://localhost:3100/api/v1` (Defined in [baseurl.js](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Frontend/store/baseurl.js)).

---

## 3. Database Models & Schema Relations

1. **User (Chatbot Owner):** [userModel.js](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Backend/models/userModel.js)
   * Stores owner credentials, business details (questions & answers), and the generated `chatbot_token`.
2. **Session:** [sessionModel.js](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Backend/models/sessionModel.js)
   * Tracks customer/guest metadata (`username`, `email`) and connects messages to a specific `chatbotId`.
3. **Message:** [messageModel.js](file:///c:/Users/Hashir%20Sajid/Desktop/quickstart-ai/Backend/models/messageModel.js)
   * Stores individual conversation messages with a `role` (`user` vs. `chatbot`/`bot`).

---

## 4. API Endpoints for Integration

The `@quickstart-ai/chatbot` widget connects to the backend through the following core endpoints:

### A. Token Verification
* **Endpoint:** `GET /api/v1/user/token/verify`
* **Query Params:** `?token=<API_TOKEN>`
* **Description:** Verifies the validity of the token and retrieves the chatbot's business profile (business name, description, FAQs).
* **Response Model:**
  ```json
  {
    "data": {
      "bussinessName": "Example Corp",
      "bussinessCategory": "SaaS",
      "bussinessDescription": "We do AI things",
      "bussinessDetails": [
        { "question": "What is your pricing?", "answer": "$10/mo" }
      ],
      "id": "OWNER_USER_ID"
    },
    "message": "Chatbot Details"
  }
  ```

### B. Session Creation
* **Endpoint:** `POST /api/v1/session/create`
* **Body:** `{ username, email, chatbotId }`
* **Description:** Creates a new chat session for a guest visitor on the client site.

### C. Message & AI Generation
* **Endpoint:** `POST /api/v1/chatbot/getResponse`
* **Body:**
  ```json
  {
    "messages": [
      { "question": "Hi", "answer": "Hello! How can I assist you today?" }
    ],
    "message": "What is your pricing?",
    "session_id": "SESSION_ID",
    "chatbot_id": "OWNER_USER_ID"
  }
  ```
* **Description:** Uses the business details and history context to generate an AI response via Pollinations AI, saving user/bot messages to MongoDB.

---

## 5. Mockup Website Integration & Test Plan

To test the chatbot widget outside of the main project dashboard, we need to create a **separate React or HTML site** that acts as the "Client Website".

### Requirements for the Mockup Site
1. **Fictional Business Concept:** Create a professional-looking landing page (e.g., a modern gym named "FitLife Pro" or a consulting firm "Apex Services").
2. **Npm Package Setup:**
   * Install the widget package:
     ```bash
     npm install @quickstart-ai/chatbot
     ```
3. **Configuration:**
   * Import and render `<ChatBot />` inside the layout.
   * Assign a token generated from the QuickStart AI dashboard (e.g. `"A1ED-7B411398-CF0F8883"`).
4. **Integration Testing Steps:**
   * Run the QuickStart AI Express server on `http://localhost:3100`.
   * Start the mockup landing page.
   * Verify that the widget loads in the bottom-right corner.
   * Open the widget, fill in the guest login (username/email), and send a test message.
   * Check if the response matches the business FAQ details configured on the QuickStart dashboard.
   * Inspect the Network tab in DevTools to confirm that CORS calls are successfully hitting `http://localhost:3100`.
