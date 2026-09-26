import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CheckBox from '../CheckBox';
import '@testing-library/jest-native';
import type {} from 'jest';

describe('CheckBox', () => {
  it('is exposed to assistive tech as an unchecked checkbox', () => {
    const { getByRole } = render(<CheckBox isChecked={false} onToggle={() => {}} />);
    expect(getByRole('checkbox')).toHaveAccessibilityState({ checked: false });
  });

  it('reports the checked state', () => {
    const { getByRole } = render(<CheckBox isChecked onToggle={() => {}} />);
    expect(getByRole('checkbox')).toHaveAccessibilityState({ checked: true });
  });

  it('calls onToggle when pressed', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(<CheckBox isChecked={false} onToggle={onToggle} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('does not call onToggle when disabled', () => {
    const onToggle = jest.fn();
    const { getByRole } = render(<CheckBox isChecked={false} onToggle={onToggle} disabled />);
    fireEvent.press(getByRole('checkbox'));
    expect(onToggle).not.toHaveBeenCalled();
  });
});
