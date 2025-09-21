// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "REACT_APP_FIREBASE_API_KEY",
  authDomain: "",
  projectId: "devvault-73eeb",
  storageBucket: "devvault-73eeb.firebasestorage.app",
  messagingSenderId: "43041683609",
  appId: "1:43041683609:web:360ffdd87d6f7b14de6008",
  measurementId: "G-E4E2LLX2DL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);