// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDi2LMCOPB17iPcnWz7LLSCdZmXWYqXqpI",
  authDomain: "spm-project-7abed.firebaseapp.com",
  projectId: "spm-project-7abed",
  storageBucket: "spm-project-7abed.appspot.com",
  messagingSenderId: "523745498193",
  appId: "1:523745498193:web:468c8a6d692bae2d705470"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, auth, provider };
