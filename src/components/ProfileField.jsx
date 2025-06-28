// components/ProfileField.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CustomDropdown from './CustomDropdown';

const ProfileField = ({
  label,
  value,
  editable,
  onChangeText,
  dropdown = false,
  dropdownData = [],
  dropdownValue,
  onDropdownChange,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        dropdown ? (
          <CustomDropdown
            data={dropdownData}
            selectedValue={dropdownValue}
            onValueChange={onDropdownChange}
            dropdownStyle={styles.dropdown}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={`Enter ${label}`}
          />
        )
      ) : (
        <Text style={styles.value}>{value || '-'}</Text>
      )}
    </View>
  );
};

export default React.memo(ProfileField);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  dropdown: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
  },
});
