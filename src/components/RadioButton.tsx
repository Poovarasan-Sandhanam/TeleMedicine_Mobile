import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ViewStyle } from 'react-native';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioButtonProps {
  options: RadioOption[];
  selectedOption: string;
  onSelect: (value: string) => void;
  style?: ViewStyle;
  color?: string;
  disabled?: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = ({ 
  options, 
  selectedOption, 
  onSelect, 
  style,
  color = '#007bff',
  disabled = false 
}) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onSelect(option.value)}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, { borderColor: color }]}>
            {selectedOption === option.value && (
              <View style={[styles.selectedCircle, { backgroundColor: color }]} />
            )}
          </View>
          <Text style={[styles.optionText, disabled && styles.disabledText]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 10,
    flexWrap: 'wrap',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  selectedCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
});

export default RadioButton;
