// src/validation/signupSchema.js

import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required'),

  dob: Yup.date()
    .nullable()
    .required('Date of birth is required'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Select a valid gender')
    .required('Gender is required'),

  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits')
    .required('Contact number is required'),

  userType: Yup.string()
    .oneOf(['Patient', 'Doctor'], 'Select a valid user type')
    .required('User type is required'),

  doctorType: Yup.string().when('userType', {
    is: 'Doctor',
    then: () => Yup.string().required('Doctor specialization is required'),
    otherwise: () => Yup.string().notRequired(),
  }),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

export default SignupSchema;
