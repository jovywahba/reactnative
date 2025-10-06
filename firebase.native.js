// firebase.native.js
import "react-native-get-random-values";
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBBaEDc7VmYKG3IEunSi7HZwlNFENpkCzU",
  authDomain: "reactnativeg1.firebaseapp.com",
  projectId: "reactnativeg1",
  storageBucket: "reactnativeg1.appspot.com", // ← fixed
  messagingSenderId: "45499907209",
  appId: "1:45499907209:web:5c98fff127a18a9a44da58",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Auth with React Native persistence so sessions survive app restarts in Expo Go
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export { app };
