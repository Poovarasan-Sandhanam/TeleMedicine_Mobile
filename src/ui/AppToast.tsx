import React from 'react';
import { StyleSheet, View } from 'react-native';
import Toast, { ToastConfig } from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, radius, space, elevation } from '../theme';
import { AppText } from './AppText';

/** Themed toasts; the library's default ones ignore dark mode and our fonts. */
export const AppToast: React.FC = () => {
  const { colors } = useTheme();
  const make = (icon: string, tone: string, soft: string): ToastConfig[string] => ({ text1, text2 }) => (
    <View style={[styles.toast, { backgroundColor: colors.surface, borderColor: colors.border }, elevation(colors.shadow, 2)]}>
      <View style={[styles.icon, { backgroundColor: soft }]}>
        <Icon name={icon} size={20} color={tone} />
      </View>
      <View style={styles.body}>
        {text1 ? <AppText variant="bodyStrong">{text1}</AppText> : null}
        {text2 ? <AppText variant="caption" color="textMuted" numberOfLines={2}>{text2}</AppText> : null}
      </View>
    </View>
  );
  const config: ToastConfig = {
    success: make('checkmark-circle', colors.success, colors.successSoft),
    error: make('alert-circle', colors.danger, colors.dangerSoft),
    info: make('information-circle', colors.info, colors.infoSoft),
  };
  return <Toast config={config} topOffset={56} />;
};

const styles = StyleSheet.create({
  toast: {
    width: '90%', flexDirection: 'row', alignItems: 'center',
    padding: space.sm, borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth,
  },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  body: { flex: 1 },
});
