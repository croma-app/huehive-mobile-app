import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import { material } from "react-native-typography";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";

import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
// import googleLogo from '/assets/images/g-logo.png'

const LOGIN = "LOGIN";
const SIGN_UP = "SIGN_UP";

const LOGIN_AND_SIGNUP_TEXT = {
  LOGIN: {
    title: "Login",
    orText: "Or Login with",
    linkTitle: "Don't have an account?",
    linkText: " Sign Up Now",
    buttonText: "Login",
  },
  SIGN_UP: {
    title: "Signup",
    orText: "Or Sign Up with",
    linkTitle: "Already have and account?",
    linkText: " Login Now",
    buttonText: " Sign up",
  },
};

export default function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [screenType, setScreenType] = useState(SIGN_UP);
  const { t } = useTranslation();

  useEffect(() => {
    props.navigation.setOptions({
      title: t(LOGIN_AND_SIGNUP_TEXT[screenType].title),
    });
  }, [screenType]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com",
      // offlineAccess: false
    });
  }, [GoogleSignin]);
  // const login = () => {};
  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
      console.log({ userInfo });
    } catch (error) {
      console.log({ error });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onChangeText = useCallback((text) => {
    setEmail(text);
  }, []);
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{t("Welcome,")}</Text>
        <Text style={styles.intro}>{t("Glad to see you!,")}</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={"Email address"}
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
        {screenType === SIGN_UP && (
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            password={true}
          />
        )}
        {screenType === LOGIN && (
          <Text style={styles.forgotPassword}>{t("Forgot password ?")}</Text>
        )}
        <CromaButton
          style={{ backgroundColor: "#ff5c59" }}
          textStyle={{ color: "#fff" }}
          onPress={signIn}
        >
          {t(LOGIN_AND_SIGNUP_TEXT[screenType].buttonText)}
        </CromaButton>
        <View style={styles.orSignUpContainer}>
          <Text style={styles.leftLine}> </Text>
          <Text style={styles.orSignUp}>
            {t(LOGIN_AND_SIGNUP_TEXT[screenType].orText)}
          </Text>
          <Text style={styles.rightLine}> </Text>
        </View>
        <GoogleSigninButton
          style={{
            width: Dimensions.get("window").width * (95 / 100),
            height: 60,
          }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          // disabled={this.state.isSigninInProgress}
        />
      </View>
      <TouchableOpacity
        onPress={() => setScreenType(screenType === LOGIN ? SIGN_UP : LOGIN)}
      >
        <View style={styles.changePage}>
          <Text>{t(LOGIN_AND_SIGNUP_TEXT[screenType].linkTitle)}</Text>
          <Text style={styles.bold}>
            {t(LOGIN_AND_SIGNUP_TEXT[screenType].linkText)}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    minHeight: 460,
    flexDirection: "column",
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  intro: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15,
  },
  forgotPassword: {
    marginLeft: "auto",
    fontSize: 13,
  },
  orSignUp: {
    padding: 10,
    fontSize: 13,
  },
  logo: {
    width: 30,
    height: 30,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  orSignUpContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changePage: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  leftLine: {
    height: 1,
    width: "25%",
    backgroundColor: "#000",
  },
  rightLine: {
    height: 1,
    width: "25%",
    backgroundColor: "#000",
  },
  bold: {
    fontWeight: "bold",
  },
});
