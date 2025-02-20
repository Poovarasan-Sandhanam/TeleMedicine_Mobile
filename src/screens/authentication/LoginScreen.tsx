import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/authActions';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import useValidation from '../../utilis/useValidation';
import LoadingSpinner from '../../components/LoadingSpinner';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import styles from './Style';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Local loading state
  
  const dispatch = useDispatch();
  const { user, error, loading: reduxLoading } = useSelector((state) => state.auth);
  const { errors, validateFields } = useValidation();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (validateFields({ email, password })) {
      setLoading(true); // Set local loading
      try {
        await dispatch(login(email, password));
      } catch (e) {
        console.log('Login failed:', e);
      } finally {
        setLoading(false); // Stop local loading
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], // Reset the stack and go to Home
      });
    }
  }, [user, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1,justifyContent:"center",margin:15 }}>
          <LoadingSpinner visible={loading || reduxLoading} />
          <Text style={styles.title}>Login your account</Text>

          <TextInput
            style={[styles.input, errors.email ? styles.inputError : null]}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                errors.password ? styles.inputError : null,
              ]}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <PasswordVisibilityToggle
              isVisible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.contentText}>New user? Go to Signup</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
