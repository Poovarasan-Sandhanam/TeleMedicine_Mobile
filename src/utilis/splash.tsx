import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Example icon set
import { useAppDispatch } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";
import { getTheme } from "../constants/colors";

interface SplashScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

interface UserData {
  email: string;
  password: string;
}

const SPLASH_TEXT = "Tele Medicine";
const windowWidth = Dimensions.get("window").width;
const COLORS = getTheme("light", "telemedicine");

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bgChanged, setBgChanged] = useState(false);

  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setBgChanged(true);
      setTimeout(() => {
        navigation.replace(isAuthenticated ? "Home" : "Onboard");
      }, 700);
    });

    (async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");
        if (token && userStr) {
          const userData: UserData = JSON.parse(userStr);
          dispatch(login(userData.email, userData.password) as any);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    })();
  }, [dispatch, isAuthenticated, navigation, textAnim]);

  const opacity = textAnim;
  const translateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgChanged ? COLORS.primary : COLORS.background },
      ]}
    >
      <Animated.View
        style={{
          flexDirection: "row",
          alignItems: "center",
          opacity,
          transform: [{ translateY }],
        }}
      >
        {/* Icon */}
        <Icon
          name="stethoscope"
          size={100}
          color={bgChanged ? COLORS.white : COLORS.text}
        />

        {/* Splash Text */}
        <Text
          style={[
            styles.text,
            { color: bgChanged ? COLORS.white : COLORS.text },
          ]}
        >
          {SPLASH_TEXT}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 52,
    fontWeight: "900",
    letterSpacing: 5,
    textShadowColor: "rgba(0,0,0,0.15)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default SplashScreen;
