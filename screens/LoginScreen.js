import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import { material } from "react-native-typography";
import { useTranslation } from 'react-i18next';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';



export default function LoginScreen() {
  const { t } = useTranslation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      // offlineAccess: false 
    });
  },[GoogleSignin])
  // const login = () => {};
  // Somewhere in your code
  const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    // this.setState({ userInfo });
    console.log({userInfo});
  } catch (error) {
    console.log({error})
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
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>{t('Welcome to croma')}</Text>
        <CromaButton
          style={{ backgroundColor: "#ff5c59" }}
          textStyle={{ color: "#fff" }}
          onPress={signIn}
        >
          {t('Click to login')}
        </CromaButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: "bold"
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15
  }
});
