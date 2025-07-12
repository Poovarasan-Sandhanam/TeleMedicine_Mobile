import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import CustomDropdown from './CustomDropdown';

interface DropdownItem {
  label: string;
  value: string | number;
}

interface ProfileFieldProps {
  label: string;
  value: string;
  editable: boolean;
  onChangeText?: (text: string) => void;
  dropdown?: boolean;
  dropdownData?: (DropdownItem | string)[];
  dropdownValue?: string | number;
  onDropdownChange?: (value: string | number) => void;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  editable,
  onChangeText,
  dropdown = false,
  dropdownData = [],
  dropdownValue,
  onDropdownChange,
  keyboardType = 'default',
  placeholder,
}) => {
  const defaultPlaceholder = placeholder || `Enter ${label}`;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {editable ? (
        dropdown ? (
          <CustomDropdown
            data={dropdownData}
            selectedValue={dropdownValue || ''}
            onValueChange={onDropdownChange || (() => {})}
            dropdownStyle={styles.dropdown}
            placeholder={defaultPlaceholder}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            placeholder={defaultPlaceholder}
            placeholderTextColor="#aaa"
          />
        )
      ) : (
        <Text style={styles.value}>{value || '-'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 8,
  },
  dropdown: {
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
  },
});

export default memo(ProfileField); 