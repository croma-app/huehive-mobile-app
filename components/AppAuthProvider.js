/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { View, Image } from 'react-native-animatable';
import { StyleSheet, Dimensions, Modal, TouchableWithoutFeedback, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Login from './Login';
import SignUp from './SignUp';
import useAuth from '../hooks/useAuth';
import useUserData from '../hooks/useUserData';
import { useNavigation } from '@react-navigation/native';
import { PRIVATE_ROUTES } from '../libs/contants';
import GoogleButton from './GoogleButton';
import { storeUserSession } from '../libs/EncryptedStoreage';
import { notifyMessage, sendClientError } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { googleLogin } from '../network/login-and-signup';

const SCREEN_TYPES = {
  LOGIN: 'LOGIN',
  SIGN_UP: 'SIGN_UP'
};

const AuthOverlay = function () {
  const navigation = useNavigation();
  const { closeLoginOverlay } = useAuth();
  const { t } = useTranslation();
  const { loadUserData } = useUserData();
  const onPress = () => {
    const currentRoute = navigation.getCurrentRoute();
    if (PRIVATE_ROUTES.has(currentRoute.name)) {
      navigation.goBack();
    }
    closeLoginOverlay();
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      offlineAccess: false
    });
  }, []);

  const [screenType, setScreenType] = useState(SCREEN_TYPES.SIGN_UP);

  const setScreenLogin = () => {
    setScreenType(SCREEN_TYPES.LOGIN);
  };

  const setScreenSignup = () => {
    setScreenType(SCREEN_TYPES.SIGN_UP);
  };

  const setScreenForgetPassword = () => {
    setScreenType(SCREEN_TYPES.FORGET_PASSWORD);
  };

  const googleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const res = await googleLogin(userInfo);
      await storeUserSession(
        res.data.user.full_name,
        res.data.user.email,
        res.data.userToken,
        res.data.user.avatar_url
      );

      loadUserData();
    } catch (error) {
      sendClientError('google_sign_in', error?.message || '', error);
      notifyMessage(t('Google login failed!'));
    }
  };

  return (
    <Modal transparent visible animationType="slide">
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Image
              style={styles.logo_image}
              // eslint-disable-next-line no-undef
              source={require('../assets/images/icon.png')}
            />
            <View style={styles.form_container}>
              <GoogleButton buttonType={screenType} onPress={googleSignIn} />
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>OR</Text>
                <View style={styles.separatorLine} />
              </View>
              {screenType === SCREEN_TYPES.LOGIN ? (
                <Login
                  setScreenLogin={setScreenLogin}
                  setScreenForgetPassword={setScreenForgetPassword}
                  setScreenSignup={setScreenSignup}
                />
              ) : (
                <SignUp
                  setScreenLogin={setScreenLogin}
                  setScreenForgetPassword={setScreenForgetPassword}
                  setScreenSignup={setScreenSignup}
                />
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const AppAuthProvider = function ({ children }) {
  const { isAuthOverlayActive } = useAuth();
  const { userData } = useUserData();
  return (
    <>
      {isAuthOverlayActive && !userData && <AuthOverlay />}
      {children}
    </>
  );
};

const styles = StyleSheet.create({
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
  },
  form_container: {
    display: 'flex',
    padding: 10
  },
  separator: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  separatorLine: {
    width: 120,
    height: 1,
    backgroundColor: '#000'
  },
  separatorText: {
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
    fontSize: 12
  }
});

export default AppAuthProvider;
