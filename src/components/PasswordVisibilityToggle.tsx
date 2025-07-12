import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PasswordVisibilityToggleProps {
  isVisible: boolean;
  onToggle: () => void;
  size?: number;
  color?: string;
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({ 
  isVisible, 
  onToggle, 
  size = 24, 
  color = "gray" 
}) => {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.container} activeOpacity={0.7}>
      <Icon 
        name={isVisible ? 'visibility' : 'visibility-off'} 
        size={size} 
        color={color} 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});

export default PasswordVisibilityToggle; 