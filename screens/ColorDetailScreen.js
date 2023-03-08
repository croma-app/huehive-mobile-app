import React, { useLayoutEffect } from "react";
import { ScrollView, StyleSheet, Button } from "react-native";
import { ColorDetail } from "../components/ColorDetails";
import CromaButton from "../components/CromaButton";
import { logEvent } from "../libs/Helpers";
import { CromaContext } from "../store/store";
import { useTranslation } from 'react-i18next';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function ColorDetailScreen({ navigation }) {
  const { detailedColor, setDetailedColor } = React.useContext(CromaContext);
  const { t } = useTranslation();
  GoogleSignin.configure({
    webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
  });
  useLayoutEffect(() => {
    navigation.setOptions({ title: detailedColor });
  }, [detailedColor]);

  logEvent("color_details_screen");
  const signIn = async () => {
            try {
              await GoogleSignin.hasPlayServices();
              const userInfo = await GoogleSignin.signIn();
              console.log("userInfo", userInfo);
              //this.setState({ userInfo });
            } catch (error) {
              if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
              } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
              } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
              } else {
                // some other error happened
                console.log(error);
              }
            }
          };
        
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ColorDetail color={detailedColor}>{detailedColor}</ColorDetail>
      <CromaButton
        onPress={() => {
          GoogleSignin.hasPlayServices().then((hasPlayService) => {
                  if (hasPlayService) {
                      GoogleSignin.signIn().then((userInfo) => {
                                console.log(JSON.stringify(userInfo))
                      }).catch((e) => {
                      console.log("ERROR IS: " + JSON.stringify(e));
                      })
                  }
          }).catch((e) => {
              console.log("ERROR IS: " + JSON.stringify(e));
          })
          }}
      >
        {t('See color palettes')}
      </CromaButton>
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  }
});
