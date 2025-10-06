import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { auth } from "../firebaseClient";
import { signOut } from "firebase/auth";

export default function UserHomeScreen() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // No manual navigation needed; AppNavigator will swap to Auth stack.
      Alert.alert("Signed out", "You have been signed out.");
    } catch (e) {
      console.log("[SignOut user] ", e);
      Alert.alert("Error", e?.message || String(e));
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Welcome, User 👋</Text>
      <Text style={{ marginBottom: 20 }}>Products will appear here later.</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={{ backgroundColor: "#ef4444", padding: 14, borderRadius: 10 }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}
