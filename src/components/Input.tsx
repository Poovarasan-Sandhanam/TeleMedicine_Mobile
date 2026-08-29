// components/Input.js
import React from 'react';
import { TextInput, Text, StyleSheet, View, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface InputProps extends Omit<TextInputProps, 'style'> {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: ViewStyle;
  label?: string;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  style,
  label,
  ...restProps
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        {...restProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default Input;
