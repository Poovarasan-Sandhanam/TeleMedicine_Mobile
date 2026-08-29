import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  visible: boolean;
  size?: 'small' | 'large' | number;
  color?: string;
  overlayColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  visible,
  size = 'large',
  color = 'black',
  overlayColor = 'rgba(0, 0, 0, 0.5)',
}) => {
  if (!visible) {return null;}

  return (
    <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingSpinner;
