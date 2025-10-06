// firebase.web.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBaEDc7VmYKG3IEunSi7HZwlNFENpkCzU",
  authDomain: "reactnativeg1.firebaseapp.com",
  projectId: "reactnativeg1",
  storageBucket: "reactnativeg1.appspot.com", // ← fixed
  messagingSenderId: "45499907209",
  appId: "1:45499907209:web:5c98fff127a18a9a44da58",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };
