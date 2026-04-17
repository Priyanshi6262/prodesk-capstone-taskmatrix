// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBa2AFap1hETmT8lK1fk7XppKOupkj45Wo",
  authDomain: "taskmatrix-app-118b7.firebaseapp.com",
  projectId: "taskmatrix-app-118b7",
  storageBucket: "taskmatrix-app-118b7.firebasestorage.app",
  messagingSenderId: "448572630739",
  appId: "1:448572630739:web:8222050b94977841201626",
  measurementId: "G-4QL66YWC54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
