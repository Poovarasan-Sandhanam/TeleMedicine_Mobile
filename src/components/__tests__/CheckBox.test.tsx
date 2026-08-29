import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CheckBox from '../CheckBox';
import '@testing-library/jest-native';
import type {} from 'jest';

describe('CheckBox', () => {
  it('renders correctly', () => {
    const { getByRole } = render(<CheckBox isChecked={false} onToggle={() => {}} />);
    expect(getByRole('button')).toBeTruthy();
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(<CheckBox isChecked={false} onToggle={onToggle} />);
    fireEvent.press(getByRole('button'));
    expect(onToggle).toHaveBeenCalled();
  });
});
