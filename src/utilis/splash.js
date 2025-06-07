import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authActions";

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          dispatch(login(parsedUser.email, parsedUser.password));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigation.replace("Home"); // Navigate to Home if authenticated
      } else {
        navigation.replace("Onboard"); // Navigate to Onboarding if not authenticated
      }
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [isAuthenticated, navigation]);

  return (
    <LinearGradient
      colors={["#8B8BE8", "#7070D2", "#5A5ABD", "#4A4AB6", "#3A3A9E"]}
      style={styles.container}
    >
      <Text style={styles.title}>Tele</Text>
      <Text style={styles.titles}>Medicine</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
  },
  titles: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 3,
  },
});

export default SplashScreen;
