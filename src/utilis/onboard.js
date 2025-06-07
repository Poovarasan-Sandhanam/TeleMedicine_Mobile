import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

const slides = [
  {
    key: "slide1",
    title: "Welcome to TeleMedicine",
    text: "Connect with healthcare professionals anytime, anywhere.",
    image: require("../asset/one.png"), // Replace with your image path
    backgroundColor: "#febe29",
  },
  {
    key: "slide2",
    title: "Easy Appointments",
    text: "Book appointments with just a few taps and avoid long queues.",
    image: require("../asset/doctor_image.png"), // Replace with your image path
    backgroundColor: "#59b2ab",
  },
  {
    key: "slide3",
    title: "Secure Consultations",
    text: "Get personalized and secure video consultations from experts.",
    image: require("../asset/doctor_two.png"), // Replace with your image path
    backgroundColor: "#9370db",
  },
];

const OnboardingScreen = ({ navigation }) => {
  const renderSlide = ({ item }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const onDone = () => {
    navigation.replace("Login"); // Navigate to the Login screen
  };

  const onSkip = () => {
    navigation.replace("Login"); // Navigate to the Login screen
  };

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={onDone}
      showSkipButton
      onSkip={onSkip}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default OnboardingScreen;
