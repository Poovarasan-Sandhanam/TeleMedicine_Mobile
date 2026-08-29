import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  Text,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '../redux/hooks';
import { login } from '../redux/slices/authSlice';
import { getTheme } from '../constants/colors';

const SPLASH_TEXT = 'Tele Medicine';
const windowWidth = Dimensions.get('window').width;
const COLORS = getTheme('light', 'telemedicine');

const SplashScreen = ({ navigation }: { navigation: { replace: (screen: string) => void } }) => {
  const dispatch = useAppDispatch();
  const [bgChanged, setBgChanged] = useState(false);

  const textAnim = useRef(new Animated.Value(0)).current;
  const loginChecked = useRef(false); // track if async login finished
  const animationDone = useRef(false); // track if animation finished
  const targetScreen = useRef('Onboard'); // default screen

  useEffect(() => {
    // Animate text
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setBgChanged(true);
      animationDone.current = true;
      // Navigate if login check is done
      if (loginChecked.current) {
        navigation.replace(targetScreen.current);
      }
    });

    // Async login check
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userStr = await AsyncStorage.getItem('user');

        if (token && userStr) {
          const userData = JSON.parse(userStr);
          await dispatch(login(userData.email, userData.password) as any);
          targetScreen.current = 'Home';
        } else {
          targetScreen.current = 'Onboard';
        }
      } catch {
        targetScreen.current = 'Onboard';
      } finally {
        loginChecked.current = true;
        // Navigate if animation is done
        if (animationDone.current) {
          navigation.replace(targetScreen.current);
        }
      }
    };

    checkLogin();
  }, [dispatch, navigation, textAnim]);

  const opacity = textAnim;
  const translateY = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: COLORS.primary  },
      ]}
    >
      <Animated.View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          opacity,
          transform: [{ translateY }],
          width: windowWidth,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingTop: Platform.OS === 'ios' ? 50 : 20,
        }}
      >
        <Icon
          name="stethoscope"
          size={100}
          color={COLORS.white }
        />
        <Text
          style={[
            styles.text,
            { color: COLORS.white },
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 5,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default SplashScreen;
