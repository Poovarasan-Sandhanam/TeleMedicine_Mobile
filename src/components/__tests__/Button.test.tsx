import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';
import '@testing-library/jest-native';
import type {} from 'jest';

describe('Button', () => {
  it('renders with given title', () => {
    const { getByText } = render(<Button title="Click me" onPress={() => {}} />);
    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click me" onPress={onPress} />);
    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalled();
  });
});
