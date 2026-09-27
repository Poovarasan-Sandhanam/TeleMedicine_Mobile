import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, {
  Easing, Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle,
  useSharedValue, withRepeat, withTiming, SharedValue,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useTheme, space, radius } from '../theme';
import { AppText, Button, Screen, PressScale } from '../ui';
import { markOnboarded } from '../session/session';

const { width: W } = Dimensions.get('window');

interface Slide { key: string; title: string; text: string; image: ImageSourcePropType }

const slides: Slide[] = [
  { key: '1', title: 'Doctors in your pocket', text: 'Connect with trusted specialists anytime, anywhere - no waiting rooms.', image: require('../asset/onboarding/onboard-one.png') },
  { key: '2', title: 'Book in seconds', text: 'Pick a doctor, choose a time that suits you, and you are booked.', image: require('../asset/onboarding/onboard-two.png') },
  { key: '3', title: 'Your health, organised', text: 'Bookings and prescriptions in one place, ready to download as PDF.', image: require('../asset/onboarding/onboard-three.png') },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Slide>);

const Dot: React.FC<{ index: number; x: SharedValue<number> }> = ({ index, x }) => {
  const { colors } = useTheme();
  const style = useAnimatedStyle(() => {
    const t = interpolate(x.value / W, [index - 1, index, index + 1], [0, 1, 0], Extrapolation.CLAMP);
    return { width: 8 + t * 20, opacity: 0.35 + t * 0.65 };
  });
  return <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, style]} />;
};

const SlideView: React.FC<{ item: Slide; index: number; x: SharedValue<number> }> = ({ item, index, x }) => {
  const { colors } = useTheme();
  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [bob]);

  // Illustration drifts slower than the page (parallax) and floats gently.
  const art = useAnimatedStyle(() => {
    const offset = (x.value - index * W) / W;
    return {
      opacity: interpolate(Math.abs(offset), [0, 0.8], [1, 0], Extrapolation.CLAMP),
      transform: [{ translateX: offset * -W * 0.35 }, { translateY: -8 * bob.value }],
    };
  });
  const copy = useAnimatedStyle(() => {
    const offset = (x.value - index * W) / W;
    return { opacity: interpolate(Math.abs(offset), [0, 0.6], [1, 0], Extrapolation.CLAMP), transform: [{ translateY: Math.abs(offset) * 24 }] };
  });

  return (
    <View style={[styles.slide, { width: W }]}>
      <Animated.View style={[styles.artWrap, art]}>
        <View style={[styles.halo, { backgroundColor: colors.primarySoft }]} />
        <Image source={item.image} style={styles.art} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={copy}>
        <AppText variant="h1" center>{item.title}</AppText>
        <AppText variant="body" color="textMuted" center style={styles.text}>{item.text}</AppText>
      </Animated.View>
    </View>
  );
};

const OnboardingScreen: React.FC<{ navigation: { replace: (screen: string) => void } }> = ({ navigation }) => {
  const x = useSharedValue(0);
  const list = useRef<FlatList<Slide>>(null);
  const [page, setPage] = useState(0);
  const onScroll = useAnimatedScrollHandler(e => { x.value = e.contentOffset.x; });
  const last = page === slides.length - 1;

  // Every exit leads to sign-in; "Skip" used to open Home with no session.
  const finish = () => {
    markOnboarded();
    navigation.replace('Login');
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <View style={styles.top}>
        {!last ? (
          <PressScale onPress={finish} accessibilityRole="button" accessibilityLabel="Skip introduction">
            <AppText variant="label" color="textMuted">Skip</AppText>
          </PressScale>
        ) : <View />}
      </View>
      <AnimatedFlatList
        ref={list}
        data={slides}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={e => setPage(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item, index }) => <SlideView item={item} index={index} x={x} />}
      />
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((s, i) => <Dot key={s.key} index={i} x={x} />)}
        </View>
        <Button
          title={last ? 'Get started' : 'Next'}
          icon={last ? 'sparkles' : undefined}
          onPress={() => (last ? finish() : list.current?.scrollToIndex({ index: page + 1, animated: true }))}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  top: { height: 44, paddingHorizontal: space.lg, alignItems: 'flex-end', justifyContent: 'center' },
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xxl },
  artWrap: { width: W * 0.8, height: W * 0.8, alignItems: 'center', justifyContent: 'center', marginBottom: space.xl },
  halo: { position: 'absolute', width: W * 0.72, height: W * 0.72, borderRadius: W },
  art: { width: '100%', height: '100%' },
  text: { marginTop: space.sm, maxWidth: 320 },
  footer: { paddingHorizontal: space.lg, paddingBottom: space.md },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: space.xl, gap: 6 },
  dot: { height: 8, borderRadius: radius.pill },
});

export default OnboardingScreen;
