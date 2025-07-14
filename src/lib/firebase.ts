// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkKi0dgHj0BNX0eDlIpTFA12l1AE3rE9Q",
  authDomain: "krownebase.firebaseapp.com",
  projectId: "krownebase",
  storageBucket: "krownebase.firebasestorage.app",
  messagingSenderId: "728507241932",
  appId: "1:728507241932:web:8a7d96d8aa914b14227969",
  measurementId: "G-41RYZS3R8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };