// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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