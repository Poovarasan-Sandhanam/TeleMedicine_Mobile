// components/CheckBox.js
import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';

interface CheckBoxProps {
  isChecked: boolean;
  onToggle: () => void;
  style?: ViewStyle;
  size?: number;
  color?: string;
  disabled?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  isChecked,
  onToggle,
  style,
  size = 20,
  color = '#007bff',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onToggle}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.box,
          { width: size, height: size },
          { borderColor: color },
          isChecked && { backgroundColor: color },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    borderWidth: 2,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckBox;
