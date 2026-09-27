import React from 'react';
import { ScrollView, StatusBar, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, space } from '../theme';

interface Props {
  children: React.ReactNode;
  scroll?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
  /** Soft brand-tinted wash at the top of the screen. */
  tint?: boolean;
  refreshControl?: React.ReactElement;
}

/** Standard page: themed background, safe-area insets, status bar that matches the scheme. */
export const Screen: React.FC<Props> = ({ children, scroll, edges = ['top'], contentStyle, tint = true, refreshControl }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      {tint ? (
        <LinearGradient
          pointerEvents="none"
          colors={[colors.bgTint, colors.bg]}
          style={styles.tint}
        />
      ) : null}
      <SafeAreaView edges={edges} style={styles.root}>
        {scroll ? (
          <ScrollView
            contentContainerStyle={[styles.pad, contentStyle]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={refreshControl}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.root, contentStyle]}>{children}</View>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  tint: { ...StyleSheet.absoluteFillObject, height: 320 },
  pad: { padding: space.lg, paddingBottom: space.xxxl },
});
