/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { login } from '../network/login-and-signup';
import { storeUserSession } from '../libs/EncryptedStorage';
import CromaButton from './CromaButton';
import useUserData from '../hooks/useUserData';
import { notifyMessage, sendClientError } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import Colors from '../constants/Styles';

const LOGIN_AND_SIGNUP_TEXT = {
  LOGIN: {
    buttonText: 'Sign In'
  },
  SIGN_UP: {
    buttonText: ' Sign Up'
  }
};

const Login = function ({ setScreenSignup }) {
  const applicationState = useApplicationStore();
  const { loadInitPaletteFromStore } = applicationState;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { loadUserData } = useUserData();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleEmailChange = (email) => {
    setEmail(email);
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const onLogin = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsLoginInProgress(true);
    try {
      const res = await login(email, password);
      await storeUserSession(
        res.data.user.full_name,
        res.data.user.email,
        res.data.userToken,
        res.data.user.avatar_url
      );
      await loadUserData();
      loadInitPaletteFromStore();
    } catch (error) {
      sendClientError('login_failed', error?.message || '', error);
      notifyMessage(t('Login failed: ' + error?.message));
    } finally {
      setIsLoginInProgress(false);
    }
  };

  return (
    <>
      <TextInput
        style={styles.input}
        onChangeText={handleEmailChange}
        placeholder={'Email address'}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError !== '' && <Text style={styles.errorText}>{emailError}</Text>}
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
      />
      <View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://huehive.co/users/password/new');
          }}>
          <Text style={styles.forgotPassword}>{t('Forgot password?')}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <CromaButton
            style={styles.buttonLeft}
            textStyle={{ color: Colors.white }}
            onPress={onLogin}>
            {isLoginInProgress ? 'loading...' : t(LOGIN_AND_SIGNUP_TEXT['LOGIN'].buttonText)}
          </CromaButton>
          <CromaButton
            textStyle={{ color: Colors.primary }}
            style={styles.buttonRight}
            onPress={setScreenSignup}>
            {t(LOGIN_AND_SIGNUP_TEXT['SIGN_UP'].buttonText)}
          </CromaButton>
        </View>
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
    backgroundColor: Colors.primary,
    color: Colors,
    flex: 1,
    marginRight: 10
  },
  buttonRight: {
    backgroundColor: Colors.white,
    color: Colors.black,
    borderColor: Colors.primary,
    borderWidth: 1,
    flex: 1,
    marginLeft: 10
  },
  forgotPassword: {
    marginLeft: 'auto',
    marginTop: 10
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  }
});

export default Login;
