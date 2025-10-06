import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "../firebaseClient";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const handleRegister = async () => {
    if (busy) return;
    try {
      setBusy(true);

      if (!username || !email || !password || !confirm) {
        Alert.alert("Missing", "Please fill all fields.");
        return;
      }
      if (password.length < 8) {
        Alert.alert("Weak password", "Password must be at least 8 characters.");
        return;
      }
      if (password !== confirm) {
        Alert.alert("Mismatch", "Passwords do not match.");
        return;
      }

      const u = username.trim().toLowerCase();
      const e = email.trim().toLowerCase();

      // unique username
      const uq = query(collection(db, "users"), where("username", "==", u));
      const uSnap = await getDocs(uq);
      if (!uSnap.empty) {
        Alert.alert("Taken", "Username is already taken.");
        return;
      }

      // create user
      const cred = await createUserWithEmailAndPassword(auth, e, password);

      // create profile
      await setDoc(doc(db, "users", cred.user.uid), {
        username: u,
        email: e,
        userType: "user",
        createdAt: Date.now(),
      });

      Alert.alert("Success", "Account created. Please log in.");
      navigation.replace("Login");
    } catch (err) {
      console.error("[REGISTER]", err);
      Alert.alert("Register failed", err?.message || String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 12 }}>Create account</Text>

      <Text>Username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholder="jovy"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="you@example.com"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="********"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
      />

      <Text>Confirm Password</Text>
      <TextInput
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        placeholder="********"
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 16 }}
      />

      <TouchableOpacity
        disabled={busy}
        onPress={handleRegister}
        style={{
          backgroundColor: "#1f6feb",
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {busy ? "Creating..." : "Create Account"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }}>
        <Text>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
