import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, elevation, fonts, motion, radius } from '../theme';
import { AppText } from '../ui';

/** Icon (outline, filled) and label for each tab route. */
const TABS: Record<string, { icon: string; label: string }> = {
  Doctors: { icon: 'home', label: 'Home' },
  Patients: { icon: 'calendar', label: 'Schedule' },
  MyBooking: { icon: 'bookmarks', label: 'Bookings' },
  Prescription: { icon: 'document-text', label: 'Prescriptions' },
  Profile: { icon: 'person', label: 'Profile' },
};

/** Height the floating bar occupies, so scrolling content can clear it. */
export const TAB_BAR_CLEARANCE = 110;

const INSET = 6;

/**
 * Floating tab bar. A gradient pill springs to the active tab; icons swap from
 * outline to filled as they become active.
 */
export const FloatingTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const tabWidth = state.routes.length ? width / state.routes.length : 0;

  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSpring(state.index * tabWidth, motion.spring);
  }, [state.index, tabWidth, x]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      style={[
        styles.bar,
        { bottom: Math.max(insets.bottom, 12), backgroundColor: colors.surface, borderColor: colors.border },
        isDark ? styles.edge : elevation(colors.shadow, 3),
      ]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {tabWidth > 0 ? (
        <Animated.View style={[styles.pill, { width: tabWidth - INSET * 2 }, pill]} pointerEvents="none">
          <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pillFill} />
        </Animated.View>
      ) : null}

      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TABS[route.name] ?? { icon: 'ellipse', label: route.name };
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={meta.label}
          >
            <Icon
              name={focused ? meta.icon : `${meta.icon}-outline`}
              size={22}
              color={focused ? colors.onPrimary : colors.textSubtle}
            />
            <AppText
              numberOfLines={1}
              adjustsFontSizeToFit
              rawColor={focused ? colors.onPrimary : colors.textSubtle}
              style={styles.label}
            >
              {meta.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 16, right: 16, height: 68,
    flexDirection: 'row', borderRadius: radius.xl, borderWidth: StyleSheet.hairlineWidth,
  },
  edge: { borderWidth: 1 },
  pill: { position: 'absolute', top: INSET, bottom: INSET, left: INSET, borderRadius: radius.lg, overflow: 'hidden' },
  pillFill: { flex: 1 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  label: { fontFamily: fonts.semibold, fontSize: 10.5, marginTop: 3 },
});
