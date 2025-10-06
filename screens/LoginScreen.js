import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function LoginScreen({ navigation }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const resolveEmailFromInput = async (input) => {
    let email = (input || "").trim().toLowerCase();
    if (email.includes("@")) return email;

    // username -> email
    const q = query(collection(db, "users"), where("username", "==", email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return (snap.docs[0].data().email || "").toLowerCase();
  };

  const handleLogin = async () => {
    if (busy) return;
    try {
      setBusy(true);
      if (!loginId || !password) {
        Alert.alert("Missing", "Please fill email/username and password.");
        return;
      }

      const email = await resolveEmailFromInput(loginId);
      if (!email) {
        Alert.alert("Not found", "No user with that email/username.");
        return;
      }

      // sign in
      await signInWithEmailAndPassword(auth, email, password);

      // fetch userType and navigate immediately (no waiting for onAuthStateChanged)
      const uid = auth.currentUser?.uid;
      let route = "UserHome";
      if (uid) {
        const s = await getDoc(doc(db, "users", uid));
        const userType = s.exists() ? s.data().userType || "user" : "user";
        route = userType === "admin" ? "AdminHome" : "UserHome";
      }

      Alert.alert("Success", "Signed in successfully.");
      navigation.reset({ index: 0, routes: [{ name: route }] });
    } catch (err) {
      console.error("[LOGIN]", err);
      Alert.alert("Login failed", err?.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12, textAlign: "center" }}>
        Log in
      </Text>

      <Text>Email or Username</Text>
      <TextInput
        value={loginId}
        onChangeText={setLoginId}
        autoCapitalize="none"
        placeholder="you@example.com or jovy"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="********"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 16 }}
      />

      <TouchableOpacity
        disabled={busy}
        onPress={handleLogin}
        style={{
          backgroundColor: "#16a34a",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {busy ? "Signing in..." : "Sign in"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 16, alignItems: "center" }}>
        <Text>Create a new account</Text>
      </TouchableOpacity>
    </View>
  );
}
