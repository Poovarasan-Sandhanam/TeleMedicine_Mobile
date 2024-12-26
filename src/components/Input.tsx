// components/Input.js
import React from 'react';
import { TextInput, Text, StyleSheet, View } from 'react-native';

const Input = ({ placeholder, value, onChangeText, error, secureTextEntry, style }) => {
  return (
    <View>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholder={placeholder}
        placeholderTextColor="#aaa"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#F3F3F3',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default Input;
