/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image } from 'react-native-animatable';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { CromaContext } from '../store/store';
import CromaButton from './CromaButton';
import Notification from './Notification';
import GoogleButton from './GoogleButton';
import { login, signUp, googleLogin } from '../network/login-and-signup';
import Login from './Login';
import {
  retrieveUserSession,
  storeUserSession,
  removeUserSession
} from '../libs/EncryptedStoreage';

const LOGIN = 'LOGIN';
const SIGN_UP = 'SIGN_UP';

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

const LoginWrapper = function ({ children, userData }) {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      offlineAccess: false
    });
  }, []);

  const [email, setEmail] = useState();
  const [fullName, setFullName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  // const [userData, setUserData] = useState();
  const [validationErrors, setValidationErrors] = useState(undefined);
  const [screenType, setScreenType] = useState(SIGN_UP);
  const { t } = useTranslation();
  const { user, setUser } = React.useContext(CromaContext);

  const onLogout = useCallback(async () => {
    await removeUserSession();
    setUserData(undefined);
    user.loggedIn = false;
    setUser(user);
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error(error);
    }
    // Google Account disconnected from your app.
    // Perform clean-up actions, such as deleting data associated with the disconnected account.
  }, [setUser, user]);

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
        user.loggedIn = true;
        setUser(user);
        // naviagteAfterLogin();
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
        user.loggedIn = true;
        setUser(user);
        // naviagteAfterLogin();
      } catch (error) {
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(error.message);
        }
      }
    }
  }, [
    confirmPassword,
    email,
    fullName,
    // naviagteAfterLogin,
    password,
    screenType,
    setUser,
    user
  ]);

  const onChangeText = useCallback((text) => {
    setEmail(text);
  }, []);

  if (!userData) {
    return (
      <>
        <Modal transparent visible animationType="slide">
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                <Image
                  style={styles.logo_image}
                  // eslint-disable-next-line no-undef
                  source={require('../assets/images/icon.png')}
                />
                <Login />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        {children}
      </>
    );
  }
  return children;
};

const styles = StyleSheet.create({
  login_overlay: {
    position: 'absolute',
    top: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3
  },
  login_container: {
    position: 'relative',
    height: Dimensions.get('window').height / 2,
    width: Dimensions.get('window').width,
    backgroundColor: '#ffffff',
    color: 'green',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  close: {
    justifyContent: 'flex-end',
    marginLeft: 'auto',
    padding: 8
  },
  logo_image: {
    position: 'absolute',
    left: Dimensions.get('window').width / 2 - 24,
    top: -24,
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#ffffff'
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 20
  }
});

export default LoginWrapper;
