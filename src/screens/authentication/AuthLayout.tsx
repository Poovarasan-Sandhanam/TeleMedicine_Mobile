import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useTheme, space, radius, elevation } from '../../theme';
import { AppText, HeroHeader, Reveal } from '../../ui';

/**
 * Shared frame for sign-in and sign-up: gradient header with a title, and a card
 * that rises over its curved edge holding the form.
 */
export const AuthLayout: React.FC<{
  title: string;
  subtitle: string;
  headerLeft?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, headerLeft, badge, children, footer }) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          // The header draws its own safe-area padding; stop iOS insetting the content too.
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
        >
          <HeroHeader minHeight={230}>
            {headerLeft ? <View style={styles.headerLeft}>{headerLeft}</View> : null}
            <Reveal from="above">
              {badge}
              <AppText variant="h1" rawColor="#FFFFFF" style={styles.title}>{title}</AppText>
              <AppText variant="body" rawColor="rgba(255,255,255,0.82)" style={styles.subtitle}>{subtitle}</AppText>
            </Reveal>
          </HeroHeader>
          <Reveal delay={120} style={styles.cardWrap}>
            <View style={[
              styles.card,
              { backgroundColor: colors.surface, borderColor: colors.border },
              isDark ? styles.edge : elevation(colors.shadow, 3),
            ]}>
              {children}
            </View>
          </Reveal>
          {footer ? <Reveal delay={220} style={styles.footer}>{footer}</Reveal> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: space.xxxl },
  headerLeft: { marginBottom: space.lg, alignSelf: 'flex-start' },
  title: { marginTop: space.lg },
  subtitle: { marginTop: space.xxs },
  cardWrap: { marginTop: -44, paddingHorizontal: space.lg },
  card: { borderRadius: radius.xl, padding: space.xl, borderWidth: StyleSheet.hairlineWidth },
  edge: { borderWidth: 1 },
  footer: { marginTop: space.xl, alignItems: 'center' },
});
