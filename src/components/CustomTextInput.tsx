import React, { forwardRef } from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';

interface CustomTextInputProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  style?: object;
  inputStyle?: object;
  placeholderTextColor?: string;
}

const CustomTextInput = forwardRef<TextInput, CustomTextInputProps>(({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  style,
  inputStyle,
  placeholderTextColor = '#aaa',
  maxLength,
  onFocus,
  onBlur,
  ...restProps
}, ref) => {
  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={[
          styles.input,
          error ? styles.inputError : null,
          inputStyle,
        ]}
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        {...restProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

CustomTextInput.displayName = 'CustomTextInput';

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F3F3F3',
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});

export default CustomTextInput;
