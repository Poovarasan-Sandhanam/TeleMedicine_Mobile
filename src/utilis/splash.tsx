import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  Easing, FadeInUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSpring, withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { AppText } from '../ui';
import { resolveStartRoute } from '../session/session';

const MIN_SHOW_MS = 1400;

/** Brand moment while the saved session is checked. */
const SplashScreen = ({ navigation }: { navigation: { replace: (screen: string) => void } }) => {
  const { colors } = useTheme();
  const logo = useSharedValue(0.5);
  const ring = useSharedValue(0);

  useEffect(() => {
    logo.value = withSpring(1, { damping: 11, stiffness: 140 });
    ring.value = withDelay(300, withRepeat(withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }), -1, false));

    let cancelled = false;
    Promise.all([resolveStartRoute(), new Promise(r => setTimeout(r, MIN_SHOW_MS))]).then(([route]) => {
      if (!cancelled) {
        navigation.replace(route);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [logo, ring, navigation]);

  const logoStyle = useAnimatedStyle(() => ({ transform: [{ scale: logo.value }] }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.55 * (1 - ring.value),
    transform: [{ scale: 1 + ring.value * 0.9 }],
  }));

  return (
    <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={[styles.orb, styles.orbA]} />
      <View style={[styles.orb, styles.orbB]} />
      <View style={styles.center}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={[styles.logo, logoStyle]}>
          <Icon name="pulse" size={52} color="#FFFFFF" />
        </Animated.View>
      </View>
      <Animated.View entering={FadeInUp.delay(350).springify().damping(16)} style={styles.words}>
        <AppText variant="display" rawColor="#FFFFFF" center>TeleMedicine</AppText>
        <AppText variant="bodyStrong" rawColor="rgba(255,255,255,0.8)" center style={styles.tagline}>
          Care from anywhere
        </AppText>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  center: { alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 128, height: 128, borderRadius: 64, borderWidth: 3, borderColor: '#FFFFFF' },
  logo: {
    width: 116, height: 116, borderRadius: 38, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
  },
  words: { marginTop: 36 },
  tagline: { marginTop: 6 },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.10)' },
  orbA: { width: 340, height: 340, top: -120, right: -140 },
  orbB: { width: 260, height: 260, bottom: -90, left: -110 },
});

export default SplashScreen;
