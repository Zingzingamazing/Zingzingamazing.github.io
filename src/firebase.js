// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import getAuth to get the auth object

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional 

const firebaseConfig = {
    apiKey: "AIzaSyA0MCs4qYSuEkXYPD0vWMpU_r4THE55BmQ",
    authDomain: "social-awareness-team07.firebaseapp.com",
    projectId: "social-awareness-team07",
    storageBucket: "social-awareness-team07.appspot.com",
    messagingSenderId: "391956152716",
    appId: "1:391956152716:web:32a4cb04608905b0b496a9",
    measurementId: "G-K00K0W3YBE"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Get the auth object

export { auth }; // Export the auth object so that it can be used in other files

