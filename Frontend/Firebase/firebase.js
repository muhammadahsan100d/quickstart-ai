// src/firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBDaQkIiErCWhoTMWltjh21sFqd33YYhHg",
  authDomain: "quickstart-ai-cb8a1.firebaseapp.com",
  projectId: "quickstart-ai-cb8a1",
  storageBucket: "quickstart-ai-cb8a1.firebasestorage.app",
  messagingSenderId: "531768650537",
  appId: "1:531768650537:web:adaf5a27409a77c6542538",
  measurementId: "G-C27BDM8HXB"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };
