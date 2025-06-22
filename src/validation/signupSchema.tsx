import * as Yup from 'yup';

const phoneRegExp = /^[0-9]{10}$/;

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required.'),
  dob: Yup.date()
    .max(new Date(), "Date of Birth can't be in the future")
    .required('Date of Birth is required.'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a valid gender.')
    .required('Gender is required.'),
  contactNumber: Yup.string()
    .matches(phoneRegExp, 'Contact Number must be exactly 10 digits.')
    .required('Contact Number is required.'),
  email: Yup.string()
    .email('Invalid email address.')
    .required('Email is required.'),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.'
    )
    .required('Password is required.'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Confirm Password is required.'),
  userType: Yup.string()
    .oneOf(['Patient', 'Doctor'])
    .required('Please select user type.'),
  doctorType: Yup.string()
    .when('userType', {
      is: 'Doctor',
      then: Yup.string().required('Doctor specialization is required.'),
      otherwise: Yup.string().notRequired(),
    }),
});

export default SignupSchema;
