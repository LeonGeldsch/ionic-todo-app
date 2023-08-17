// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYaEw3WiVz4hSkuUQuL6WTtsm_ym61Ksw",
  authDomain: "ionic-todo-app-6dfff.firebaseapp.com",
  projectId: "ionic-todo-app-6dfff",
  storageBucket: "ionic-todo-app-6dfff.appspot.com",
  messagingSenderId: "569511505084",
  appId: "1:569511505084:web:20cbfdf14c1de48777f4b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
