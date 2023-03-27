import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { material } from 'react-native-typography';
import { useTranslation } from 'react-i18next';
import { CromaContext } from '../store/store';
// import { Dimensions } from "react-native";
import { login, signUp } from '../network/login-and-signup';
// import { notifyMessage } from "../libs/Helpers";
import PropTypes from 'prop-types';
import {
  retrieveUserSession,
  storeUserSession,
  removeUserSession
} from '../libs/EncryptedStoreage';
import Notification from '../components/Notification';

// import {
//   GoogleSignin,
//   statusCodes,
//   GoogleSigninButton,
// } from "@react-native-google-signin/google-signin";
// import googleLogo from '/assets/images/g-logo.png';

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
    linkTitle: 'Already have and account?',
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
  let fullNameError, emailError, passwordError;

  if (!fullName || fullName.length === 0) {
    fullNameError = 'Full name required.';
  }

  if (!email || !checkValidEmail(email)) {
    emailError = 'Please enter valid email.';
  }

  if (!password || password.length < 6) {
    passwordError = 'Minimum 6 characters required in password.';
  }

  if (password !== confirmPassword) {
    passwordError = 'Confirm password did not match.';
  }
  if (!fullNameError && !emailError && !passwordError) {
    return undefined;
  }
  return {
    fullName: fullNameError,
    email: emailError,
    password: passwordError
  };
}

function LoginScreen(props) {
  const [email, setEmail] = useState();
  const [fullName, setFullName] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [error, setError] = useState();
  const [userData, setUserData] = useState();
  const [validationErrors, setValidationErrors] = useState(undefined);
  const [screenType, setScreenType] = useState(SIGN_UP);
  const { t } = useTranslation();
  const { user, setUser } = React.useContext(CromaContext);
  console.log({ userData });

  useEffect(() => {
    // check if already logged in
    (async () => {
      const userData = await retrieveUserSession();
      if (userData) {
        setUserData(userData);
        // props.navigation.goBack();
      }
    })();
  }, [props.navigation]);

  useEffect(() => {
    props.navigation.setOptions({
      title: userData ? t('Profile') : t(LOGIN_AND_SIGNUP_TEXT[screenType].title)
    });
  }, [props.navigation, screenType, t, userData]);

  const onLogout = useCallback(async () => {
    await removeUserSession();
    setUserData(undefined);
    user.loggedIn = false;
    setUser(user);
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
        props.navigation.goBack();
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
        props.navigation.goBack();
      } catch (error) {
        if (error.response.data.error) {
          setError(error.response.data.error);
        } else {
          setError(error.message);
        }
      }
    }
  }, [confirmPassword, email, fullName, password, props.navigation, screenType, setUser, user]);

  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: Config.GOOGLE_AUTHOTICATION_WEB_CLIENT_ID,
  //     // offlineAccess: false
  //   });
  // }, [GoogleSignin]);
  // const login = () => {};
  // Somewhere in your code
  // const signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     // this.setState({ userInfo });
  //     console.log({ userInfo });
  //   } catch (error) {
  //     console.log({ error });
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // play services not available or outdated
  //     } else {
  //       // some other error happened
  //     }
  //   }
  // };

  const onChangeText = useCallback((text) => {
    setEmail(text);
  }, []);

  if (userData) {
    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.logoutContainer]}>
          <Image style={styles.logo} source={{ uri: userData.avator }} />
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
        <Text style={styles.title}>{t('Welcome,')}</Text>
        <Text style={styles.intro}>{t('Glad to see you!,')}</Text>
        {error && <Notification message={error} onPress={() => setError(undefined)}></Notification>}
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
          <Text style={styles.forgotPassword}>{t('Forgot password ?')}</Text>
        )}
        <CromaButton
          style={{ backgroundColor: '#ff5c59' }}
          textStyle={{ color: '#fff' }}
          onPress={onSubmit}>
          {t(LOGIN_AND_SIGNUP_TEXT[screenType].buttonText)}
        </CromaButton>
        {/* <View style={styles.orSignUpContainer}>
          <Text style={styles.leftLine}> </Text>
          <Text style={styles.orSignUp}>
            {t(LOGIN_AND_SIGNUP_TEXT[screenType].orText)}
          </Text>
          <Text style={styles.rightLine}> </Text>
        </View> */}
        {/* <GoogleSigninButton
          style={{
            width: Dimensions.get("window").width * (95 / 100),
            height: 60,
          }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          // disabled={this.state.isSigninInProgress}
        /> */}
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
  navigation: PropTypes.any
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
  orSignUp: {
    padding: 10,
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
  orSignUpContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  changePage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  leftLine: {
    height: 1,
    width: '25%',
    backgroundColor: '#000'
  },
  rightLine: {
    height: 1,
    width: '25%',
    backgroundColor: '#000'
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
    borderColor: '#000',
    height: 50,
    width: 50,
    marginTop: 30,
    padding: 3
  }
});

export default LoginScreen;
