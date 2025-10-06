// firebaseClient.js
import { Platform } from "react-native";

// Pick the right module at runtime
const client =
  Platform.OS === "web"
    ? require("./firebase.web")
    : require("./firebase.native");

// Re-export the pieces you use elsewhere
export const app = client.app;
export const auth = client.auth;
export const db = client.db;
