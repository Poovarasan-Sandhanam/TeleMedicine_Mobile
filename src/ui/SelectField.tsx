import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, radius, space, elevation } from '../theme';
import { AppText } from './AppText';
import { PressScale } from './Pressable';

export interface Option { id: string; title: string }

/** Field that opens a bottom sheet of options; matches TextField's look. */
export const SelectField: React.FC<{
  label?: string;
  icon?: string;
  value: string;
  options: Option[];
  placeholder?: string;
  onChange: (id: string) => void;
}> = ({ label, icon, value, options, placeholder = 'Select', onChange }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const current = options.find(o => o.id === value);

  return (
    <View style={styles.wrap}>
      {label ? <AppText variant="label" color="textMuted" style={styles.label}>{label}</AppText> : null}
      <PressScale
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label ?? 'Select'}: ${current?.title ?? 'not set'}`}
        style={[styles.frame, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
      >
        {icon ? <Icon name={icon} size={20} color={colors.textSubtle} style={styles.icon} /> : null}
        <AppText variant="body" color={current ? 'text' : 'textSubtle'} style={styles.value} numberOfLines={1}>
          {current?.title ?? (value || placeholder)}
        </AppText>
        <Icon name="chevron-down" size={18} color={colors.textSubtle} />
      </PressScale>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} onPress={() => setOpen(false)} accessibilityLabel="Close" />
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(180)}
          style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, space.md) }, elevation(colors.shadow, 3)]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
          {label ? <AppText variant="h3" style={styles.sheetTitle}>{label}</AppText> : null}
          <FlatList
            data={options}
            keyExtractor={o => o.id}
            style={styles.list}
            initialScrollIndex={current ? Math.max(0, options.indexOf(current) - 2) : 0}
            getItemLayout={(_, i) => ({ length: 52, offset: 52 * i, index: i })}
            renderItem={({ item }) => {
              const selected = item.id === value;
              return (
                <Pressable
                  onPress={() => { onChange(item.id); setOpen(false); }}
                  style={[styles.option, selected && { backgroundColor: colors.primarySoft }]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <AppText variant={selected ? 'bodyStrong' : 'body'} color={selected ? 'primary' : 'text'} style={styles.value}>{item.title}</AppText>
                  {selected ? <Icon name="checkmark-circle" size={20} color={colors.primary} /> : null}
                </Pressable>
              );
            }}
          />
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: space.md },
  label: { marginBottom: space.xs, marginLeft: 2 },
  frame: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md, minHeight: 54 },
  icon: { marginRight: space.sm },
  value: { flex: 1 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '70%', borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingTop: space.sm },
  grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: space.md },
  sheetTitle: { paddingHorizontal: space.xl, marginBottom: space.sm },
  list: { paddingHorizontal: space.md },
  option: { height: 52, flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.md, borderRadius: radius.md },
});
