// components/CheckBox.js
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CheckBox = ({ isChecked, onToggle }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={[styles.box, isChecked && styles.checkedBox]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 10,
  },
  box: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  checkedBox: {
    backgroundColor: '#000',
  },
});

export default CheckBox;
