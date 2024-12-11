// components/PasswordVisibilityToggle.js
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PasswordVisibilityToggle = ({ isVisible, onToggle }) => {
  return (
    <TouchableOpacity onPress={onToggle}>
      <Icon name={isVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
    </TouchableOpacity>
  );
};

export default PasswordVisibilityToggle;
