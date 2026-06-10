// Firebase configuration for The Mood Room
// Replace YOUR_API_KEY and YOUR_APP_ID with your actual keys from the Firebase Console.

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "themoodroom-24902.firebaseapp.com",
  projectId: "themoodroom-24902",
  storageBucket: "themoodroom-24902.appspot.com",
  messagingSenderId: "1033227730513",
  appId: "YOUR_APP_ID"
};

// Import the SDKs we need from the CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export default db;
