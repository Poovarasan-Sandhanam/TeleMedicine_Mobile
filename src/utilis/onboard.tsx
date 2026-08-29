import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import COLORS from '../constants/colors'; // adjust path as necessary

interface Slide {
  key: string;
  title: string;
  text: string;
  image: ImageSourcePropType;
  backgroundColor: string;
}

interface OnboardingScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

const slides: Slide[] = [
  {
    key: 'slide1',
    title: 'Welcome to TeleMedicine',
    text: 'Connect with healthcare professionals anytime, anywhere.',
    image: require('../asset/onboarding/onboard-one.png'),
    backgroundColor: COLORS.primary,
  },
  {
    key: 'slide2',
    title: 'Easy Appointments',
    text: 'Book appointments with just a few taps and avoid long queues.',
    image:require('../asset/onboarding/onboard-two.png'),
    backgroundColor: COLORS.primary,
  },
  {
    key: 'slide3',
    title: 'Secure Consultations',
    text: 'Get personalized and secure video consultations from experts.',
    image: require('../asset/onboarding/onboard-three.png'),
    backgroundColor: COLORS.primary,
  },
];

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const renderSlide = ({ item }: { item: Slide }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const handleFinish = () => navigation.replace('Login');
  const handleSkip = () => navigation.replace('Home');

  return (
    <AppIntroSlider
      renderItem={renderSlide}
      data={slides}
      onDone={handleFinish}
      showSkipButton
      onSkip={handleSkip}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
