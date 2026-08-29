// utils/useValidation.js
import { useState } from 'react';

export interface ValidationErrors {
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

interface ValidateFieldsParams {
  email?: string;
  password?: string;
}

const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  // Perform validation for email and password
  const validateFields = ({ email = '', password = '' }: ValidateFieldsParams): boolean => {
    const newErrors: ValidationErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password =
        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validateFields };
};

export default useValidation;
