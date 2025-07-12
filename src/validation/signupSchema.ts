import * as Yup from 'yup';

export interface SignupFormData {
  name: string;
  dob: Date | null;
  gender: 'Male' | 'Female' | 'Other';
  contactNumber: string;
  userType: 'Patient' | 'Doctor';
  doctorType?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Name must be at least 3 characters')
    .required('Name is required')
    .trim(),

  dob: Yup.date()
    .nullable()
    .required('Date of birth is required')
    .max(new Date(), 'Date of birth cannot be in the future'),

  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Select a valid gender')
    .required('Gender is required'),

  contactNumber: Yup.string()
    .matches(/^[0-9]{10}$/, 'Contact number must be exactly 10 digits')
    .required('Contact number is required')
    .trim(),

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
    .required('Email is required')
    .trim()
    .lowercase(),

  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .trim(),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password')
    .trim(),
});

export default SignupSchema; 