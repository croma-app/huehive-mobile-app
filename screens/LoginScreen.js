import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { material } from 'react-native-typography';
import { useTranslation } from 'react-i18next';
import { login, signUp, googleLogin } from '../network/login-and-signup';
import PropTypes from 'prop-types';
import useUserData from '../hooks/useUserData';
import { storeUserSession, removeUserSession } from '../libs/EncryptedStoreage';
import Notification from '../components/Notification';
import GoogleButton from '../components/GoogleButton';

import { GoogleSignin } from '@react-native-google-signin/google-signin';

const LOGIN = 'LOGIN';
const SIGN_UP = 'SIGN_UP';

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

function checkValidEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function signUpValidations({ fullName, email, password, confirmPassword }) {
  const errors = {};

  if (!fullName || fullName.length === 0) {
    errors.fullName = 'Full name required.';
  }

  if (!email || !checkValidEmail(email)) {
    errors.email = 'Please enter a valid email.';
  }

  if (!password || password.length < 6) {
    errors.password = 'Minimum 6 characters required in password.';
  }

  if (password !== confirmPassword) {
    errors.password = 'Confirm password did not match.';
  }

  return Object.keys(errors).length > 0 ? errors : {};
}

function LoginScreen(props) {
  const [email, setEmail] = useState();
  const [fullName, setFullName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const { userData, loadUserData } = useUserData();
  const [validationErrors, setValidationErrors] = useState(undefined);
  const [screenType, setScreenType] = useState(SIGN_UP);
  const { t } = useTranslation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      offlineAccess: false
    });
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      title: userData ? t('Profile') : t(LOGIN_AND_SIGNUP_TEXT[screenType].title)
    });
  }, [props.navigation, screenType, t, userData]);

  const naviagteAfterLogin = useCallback(() => {
    if (props.reloadScreen) {
      props.reloadScreen();
    } else {
      props.navigation.goBack();
    }
  }, [props]);

  const onLogout = useCallback(async () => {
    await removeUserSession();
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error(error);
    }
    // Google Account disconnected from your app.
    // Perform clean-up actions, such as deleting data associated with the disconnected account.
  }, []);

  const onSubmit = useCallback(async () => {
    if (screenType === LOGIN) {
      // to handle login
      try {
        const res = await login(email, password);
        await storeUserSession(
          res.data.user.full_name,
          res.data.user.email,
          res.data.userToken,
          res.data.user.avatar_url
        );
        loadUserData();
        naviagteAfterLogin();
      } catch (error) {
        setError(error.message);
      }
    } else {
      // to handle sign up
      const validationErrors = signUpValidations({
        fullName,
        email,
        password,
        confirmPassword
      });
      setValidationErrors(validationErrors);
      if (validationErrors) {
        return;
      }

      try {
        const res = await signUp(fullName, email, password);
        await storeUserSession(
          res.data.user.full_name,
          res.data.user.email,
          res.data.userToken,
          res.data.user.avatar_url
        );
        loadUserData();
        naviagteAfterLogin();
      } catch (error) {
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(error.message);
        }
      }
    }
  }, [confirmPassword, email, fullName, loadUserData, naviagteAfterLogin, password, screenType]);

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
      user.loggedIn = true;
      setUser(user);
      naviagteAfterLogin();
    } catch (error) {
      setError(error.message);
    }
  };

  const onChangeText = useCallback((text) => {
    setEmail(text);
  }, []);

  if (userData) {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoutContainer]}>
          <Image style={styles.logo} source={{ uri: userData.avatar_url }} />
          <Text style={styles.intro}>
            {t('Name: ')}
            {userData.fullName}
          </Text>
          <Text style={styles.intro}>
            {t('Email: ')}
            {userData.email}
          </Text>
          <CromaButton
            style={{ backgroundColor: '#ff5c59', width: '100%' }}
            textStyle={{ color: '#fff' }}
            onPress={onLogout}>
            {t('Logout')}
          </CromaButton>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[styles.container, { minHeight: screenType === LOGIN ? 400 : 500 }]}>
        {!props.hideWelcomeMessage && <Text style={styles.title}>{t('Welcome to HueHive')}</Text>}
        <Text style={styles.intro}>
          {props.signupMessage || t('Please sign in or sign up to continue...')}
        </Text>
        {error && <Notification message={error} onPress={() => setError(undefined)}></Notification>}

        <GoogleButton buttonType={screenType} onPress={googleSignIn} />

        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>or</Text>
          <View style={styles.separatorLine} />
        </View>

        {screenType === SIGN_UP && (
          <>
            {validationErrors && validationErrors.fullName && (
              <Text style={styles.fieldError}>{validationErrors.fullName}</Text>
            )}
            <TextInput
              style={styles.input}
              onChangeText={setFullName}
              placeholder={'Full name'}
              value={fullName}
            />
          </>
        )}
        {validationErrors && validationErrors.email && (
          <Text style={styles.fieldError}>{validationErrors.email}</Text>
        )}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={'Email address'}
          value={email}
        />
        {validationErrors && validationErrors.password && (
          <Text style={styles.fieldError}>{validationErrors.password}</Text>
        )}
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          password={true}
        />
        {screenType === SIGN_UP && (
          <TextInput
            placeholder="Confirm Password"
            style={[
              styles.input,
              password !== confirmPassword ? { color: 'red' } : { color: 'black' }
            ]}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            password={true}
          />
        )}
        {screenType === LOGIN && (
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('https://huehive.co/users/password/new');
            }}>
            <Text style={styles.forgotPassword}>{t('Forgot password?')}</Text>
          </TouchableOpacity>
        )}
        <CromaButton
          style={{ backgroundColor: '#ff5c59' }}
          textStyle={{ color: '#fff' }}
          onPress={onSubmit}>
          {t(LOGIN_AND_SIGNUP_TEXT[screenType].buttonText)}
        </CromaButton>
      </View>
      <TouchableOpacity
        onPress={() => {
          setScreenType(screenType === LOGIN ? SIGN_UP : LOGIN);
          setValidationErrors(undefined);
        }}>
        <View style={styles.changePage}>
          <Text>{t(LOGIN_AND_SIGNUP_TEXT[screenType].linkTitle)}</Text>
          <Text style={styles.bold}>{t(LOGIN_AND_SIGNUP_TEXT[screenType].linkText)}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.any,
  hideWelcomeMessage: PropTypes.bool,
  reloadScreen: PropTypes.func,
  signupMessage: PropTypes.string | undefined
};

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 12,
    paddingRight: 12
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: 'bold'
  },
  intro: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15
  },
  forgotPassword: {
    marginLeft: 'auto',
    fontSize: 13
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc'
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16
  },
  changePage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  bold: {
    fontWeight: 'bold'
  },
  fieldError: {
    fontSize: 16,
    color: 'red'
  },
  logoutContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: 30
  }
});

export default LoginScreen;
