/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { signUp } from '../network/login-and-signup';
import { storeUserSession } from '../libs/EncryptedStoreage';
import CromaButton from './CromaButton';
import useUserData from '../hooks/useUserData';
import { notifyMessage, sendClientError } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';

const LOGIN_AND_SIGNUP_TEXT = {
  LOGIN: {
    buttonText: 'Sign In'
  },
  SIGN_UP: {
    buttonText: ' Sign Up'
  }
};

const SignUp = function ({ setScreenLogin }) {
  const applicationState = useApplicationStore();
  const { loadInitPaletteFromStore } = applicationState;
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();
  const { loadUserData } = useUserData();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

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

  const onSignup = async () => {
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
      await loadUserData();
      loadInitPaletteFromStore();
    } catch (error) {
      console.log(error);
      sendClientError('signup_failed', error?.message || '', error);
      notifyMessage(t('Signup failed: ' + error?.message));
    } finally {
      setIsLoginInProgress(false);
    }
  };

  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={setFullname}
        placeholder={'Full name'}
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
      />
      {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
      <TextInput
        placeholder="Confirm password"
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
      />
      {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      <View style={styles.buttonsContainer}>
        <CromaButton textStyle={{ color: '#fff' }} style={styles.buttonLeft} onPress={onSignup}>
          {isLoginInProgress ? 'loading...' : t(LOGIN_AND_SIGNUP_TEXT['SIGN_UP'].buttonText)}
        </CromaButton>
        <CromaButton
          textStyle={{ color: '#ff5c59' }}
          style={styles.buttonRight}
          onPress={setScreenLogin}>
          {t(LOGIN_AND_SIGNUP_TEXT['LOGIN'].buttonText)}
        </CromaButton>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
  errorText: {
    color: 'red',
    marginTop: 5
  }
});

export default SignUp;
