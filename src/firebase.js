
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCsIkWtyFXPXh7lFbmwEyJNXokDtBlcfe4",
  authDomain: "anya-mentalhealthresources.firebaseapp.com",
  projectId: "anya-mentalhealthresources",
  storageBucket: "anya-mentalhealthresources.firebasestorage.app",
  messagingSenderId: "790233159595",
  appId: "1:790233159595:web:24424f7ae94d58e25564ee"
};

// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Export Firebase services for use in your components
const auth = getAuth(app);
const database = getFirestore(app);

export { auth, database };