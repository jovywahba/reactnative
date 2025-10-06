import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { auth } from "../firebaseClient";
import { signOut } from "firebase/auth";

export default function AdminHomeScreen() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signed out", "You have been signed out.");
    } catch (e) {
      console.log("[SignOut admin] ", e);
      Alert.alert("Error", e?.message || String(e));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Admin Dashboard 🔧</Text>
      <Text style={{ marginBottom: 20 }}>Manage products & orders here soon.</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={{ backgroundColor: "#ef4444", padding: 14, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
