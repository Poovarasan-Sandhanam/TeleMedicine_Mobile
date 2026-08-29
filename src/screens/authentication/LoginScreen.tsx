import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../redux/hooks';
import { login } from '../../redux/slices/authSlice'; // adjust path
import COLORS from '../../constants/colors';
import styles from '../../styles/authStyles'; // your styles

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }: { navigation: any }) => {

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (values: any, { setSubmitting }: any) => {

  (dispatch(login({ email: values.email, password: values.password }) as any) as any)
    .unwrap()
    .then(() => {
      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: `Welcome back, ${values.email}`,
      });
      setSubmitting(false);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    })
    .catch((error: string) => {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error,
      });
      setSubmitting(false);
    });
};


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.content}
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
          }) => (
            <>
              <Image
                resizeMode="contain"
                style={styles.imagePic}
                source={require('../../asset/doctor.png')}
              />
              <Input
                placeholder="Email address"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                autoCapitalize="none"
                keyboardType="email-address"
                errorMessage={touched.email && errors.email ? errors.email : undefined}
                inputStyle={styles.inputText}
              />
              <Input
                placeholder="Password"
                secureTextEntry={!showPassword}
                rightIcon={
                  <Icon
                    type="material"
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                errorMessage={
                  touched.password && errors.password ? errors.password : undefined
                }
                inputStyle={styles.inputText}
              />
             <View style={styles.stickyButton}>
               <Button
                title="Log In"
                loading={isSubmitting}
                onPress={() => handleSubmit()}
                buttonStyle={styles.button}
                titleStyle={styles.buttonTitle}
                containerStyle={styles.buttonContainer}
              />
              <Button
                title="Skip Login"
                type="outline"
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                  })
                }
                buttonStyle={{ borderColor: COLORS.primary, paddingVertical: 12, borderRadius: 8 }}
                titleStyle={{ color: COLORS.primary, fontSize: 16, fontWeight: '600' }}
                containerStyle={{ marginTop: 10 }}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.linkText}>Don't have an account? Sign up</Text>
              </TouchableOpacity>
             </View>
             </>

          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
