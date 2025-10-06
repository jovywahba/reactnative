// navigation/AppNavigator.js
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth, db } from "../firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import UserHomeScreen from "../screens/UserHomeScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState("user");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u || null);
        if (u) {
          const snap = await getDoc(doc(db, "users", u.uid));
          setUserType(snap.exists() ? snap.data().userType || "user" : "user");
        } else {
          setUserType("user");
        }
      } catch (e) {
        console.log("Auth listener error:", e);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        // Auth stack
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      ) : userType === "admin" ? (
        // Admin stack
        <Stack.Navigator>
          <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        </Stack.Navigator>
      ) : (
        // User stack
        <Stack.Navigator>
          <Stack.Screen name="UserHome" component={UserHomeScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
