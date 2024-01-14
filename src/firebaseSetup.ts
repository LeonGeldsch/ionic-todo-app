// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADo6adjZ2bAYbpYylnFIgzUWRJQM6PMlw",
  authDomain: "travel-app-fca24.firebaseapp.com",
  projectId: "travel-app-fca24",
  storageBucket: "travel-app-fca24.appspot.com",
  messagingSenderId: "5426449715",
  appId: "1:5426449715:web:6be3f919a9b96fc4800246",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
