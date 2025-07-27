// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsIkWtyFXPXh7lFbmwEyJNXokDtBlcfe4",
  authDomain: "anya-mentalhealthresources.firebaseapp.com",
  projectId: "anya-mentalhealthresources",
  storageBucket: "anya-mentalhealthresources.firebasestorage.app",
  messagingSenderId: "790233159595",
  appId: "1:790233159595:web:24424f7ae94d58e25564ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

function writeUserData(userId, name) {
  const database = getDatabase();
  const reference = ref(database, 'users/' + userId);
  set(reference, {
    username: name
  }); 
}

writeUserData('1', 'Anya'); // Example usage, replace with actual user data