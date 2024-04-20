/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import GoogleButton from './GoogleButton';
import { useTranslation } from 'react-i18next';
import { signUp } from '../network/login-and-signup';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { googleLogin } from '../network/login-and-signup';
import { storeUserSession } from '../libs/EncryptedStoreage';
import CromaButton from './CromaButton';
import useUserData from '../hooks/useUserData';

const LOGIN_AND_SIGNUP_TEXT = {
  LOGIN: {
    title: 'Login',
    orText: 'Or Login with',
    linkTitle: "Don't have an account?",
    linkText: ' Sign Up Now',
    buttonText: 'Login'
  },
  SIGN_UP: {
    title: 'Signup',
    orText: 'Or Sign Up with',
    linkTitle: 'Already have an account?',
    linkText: ' Login Now',
    buttonText: ' Sign up'
  }
};

const SignUp = function ({ setScreenLogin, setScreenForgetPassword }) {
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const { loadUserData } = useUserData();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  console.log({ setScreenForgetPassword, setScreenLogin });

  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
      const res = await googleLogin(userInfo);
      await storeUserSession(
        res.data.user.full_name,
        res.data.user.email,
        res.data.userToken,
        res.data.user.avatar_url
      );

      loadUserData();
    } catch (error) {
      // setError(error.message);
    }
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!fullname) {
      newErrors.fullname = 'Fullname is required';
    }
    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const onLogin = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoginInProgress(true);
    try {
      const res = await signUp(fullname, email, password);
      await storeUserSession(
        res.data.user.full_name,
        res.data.user.email,
        res.data.userToken,
        res.data.user.avatar_url
      );
      loadUserData();
    } catch (error) {
      console.log(error);
      // TODO - Need to add a generic error screen
    } finally {
      setIsLoginInProgress(false);
    }
  };

  return (
    <View style={[styles.container]}>
      {/* {error && <Notification message={error} onPress={() => setError(undefined)}></Notification>} */}
      <GoogleButton buttonType="LOGIN" onPress={googleSignUp} />
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.separatorLine} />
      </View>
      <TextInput
        style={styles.input}
        onChangeText={setFullname}
        placeholder={'Fullname'}
        value={fullname}
      />
      {errors.fullname && <Text style={styles.errorText}>{errors.fullname}</Text>}
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder={'Email address'}
        value={email}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        password={true}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput
        placeholder="Confirm Password"
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        password={true}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <View>
        <View style={styles.buttonsContainer}>
          <CromaButton textStyle={{ color: '#fff' }} style={styles.buttonLeft} onPress={onLogin}>
            {isLoginInProgress ? 'loading...' : t(LOGIN_AND_SIGNUP_TEXT['SIGN_UP'].buttonText)}
          </CromaButton>
          <CromaButton
            textStyle={{ color: '#ff5c59' }}
            style={styles.buttonRight}
            onPress={setScreenLogin}>
            {t(LOGIN_AND_SIGNUP_TEXT['LOGIN'].buttonText)}
          </CromaButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  buttonLeft: {
    backgroundColor: '#ff5c59',
    color: '#fff',
    flex: 1,
    marginRight: 10
  },
  buttonRight: {
    backgroundColor: '#fff',
    color: '#000',
    borderColor: '#ff5c59',
    borderWidth: 1,
    flex: 1,
    marginLeft: 10
  },
  forgotPassword: {
    marginLeft: 'auto'
  },
  separator: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  separatorLine: {
    width: 100,
    height: 1,
    backgroundColor: '#000'
  },
  separatorText: {
    marginLeft: 50,
    marginRight: 50,
    textAlign: 'center'
  },
  errorText: {
    color: 'red',
    marginTop: 5
  }
});

export default SignUp;
