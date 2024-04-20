/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import GoogleButton from './GoogleButton';
import { useTranslation } from 'react-i18next';
import { login } from '../network/login-and-signup';

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

const Login = function ({ setScreenSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useTranslation();
  const { loadUserData } = useUserData();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  const googleSignIn = async () => {
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
      // user.loggedIn = true;
      // setUser(user);
      // naviagteAfterLogin();
    } catch (error) {
      // setError(error.message);
    }
  };

  const onLogin = async () => {
    setIsLoginInProgress(true);
    try {
      const res = await login(email, password);
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
      <GoogleButton buttonType="LOGIN" onPress={googleSignIn} />
      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>Or</Text>
        <View style={styles.separatorLine} />
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        placeholder={'Email address'}
        value={email}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        password={true}
      />
      <View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('https://huehive.co/users/password/new');
          }}>
          <Text style={styles.forgotPassword}>{t('Forgot password?')}</Text>
        </TouchableOpacity>
        <View style={styles.buttonsContainer}>
          <CromaButton style={styles.buttonLeft} onPress={onLogin}>
            {isLoginInProgress ? 'loading...' : t(LOGIN_AND_SIGNUP_TEXT['LOGIN'].buttonText)}
          </CromaButton>
          <CromaButton style={styles.buttonRight} onPress={setScreenSignup}>
            {t(LOGIN_AND_SIGNUP_TEXT['SIGN_UP'].buttonText)}
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
  }
});

export default Login;
