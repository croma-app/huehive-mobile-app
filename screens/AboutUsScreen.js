import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import React from 'react';
import { material } from 'react-native-typography';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { logEvent } from '../libs/Helpers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';

const GITHUB_URL = 'https://github.com/croma-app/croma-react';
const INSTAGRAM_URL = 'https://www.instagram.com/huehiveco/';
const CROMA_APP_URL = 'https://huehive.co';
const CROMA_IOS_URL = 'https://apps.apple.com/app/croma-palette-manager/id1596763657';
const CROMA_PLAYSTORE_URL = 'https://play.google.com/store/apps/details?id=app.croma';
const DISCORD_URL = 'https://discord.com/invite/ZSBVsBqDtg';

const AboutUsScreen = () => {
  const { t } = useTranslation();

  logEvent('about_us_screen');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.line}>
          {t(
            'Croma is a simple color palette manager and color picker made for designers, aiming to make it quick and fun to create and share color palettes on the go.'
          )}
        </Text>
      </View>
      <View style={styles.linksMainView}>
        <TouchableOpacity onPress={() => Linking.openURL(`${INSTAGRAM_URL}`)}>
          <View style={styles.linkView}>
            <Entypo name="instagram" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>{t('Follow us on instagram')}</Text>
            <Text style={[styles.line, styles.link]}>{INSTAGRAM_URL}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(`${DISCORD_URL}`)}>
          <View style={styles.linkView}>
            <MaterialCommunityIcons name="discord" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>{t('Join discord')}</Text>
            <Text style={[styles.line, styles.link]}>{DISCORD_URL}</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => Linking.openURL(`${GITHUB_URL}`)}>
          <View style={styles.linkView}>
            <Entypo name="github-with-circle" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>{t('Find us on Github !')}</Text>
            <Text style={[styles.line, styles.link]}>{GITHUB_URL}</Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => Linking.openURL(`${CROMA_APP_URL}`)}>
          <View style={styles.linkView}>
            <MaterialCommunityIcons name="web" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>{t('Web version with ')}</Text>
            <Text style={[styles.line, styles.subtitle]}>{t('ChatGPT support')}</Text>
            <Text style={[styles.line, styles.link]}>{CROMA_APP_URL}</Text>
          </View>
        </TouchableOpacity>
        {/* {Platform.OS == 'android' && (
          <TouchableOpacity onPress={() => Linking.openURL(`${CROMA_IOS_URL}`)}>
            <View style={styles.linkView}>
              <FontAwesome5 name="app-store-ios" style={styles.icon} />
              <Text style={[styles.line, styles.subtitle]}>{t('Croma on App store')}</Text>
              <Text style={[styles.line, styles.link]}>{CROMA_IOS_URL}</Text>
            </View>
          </TouchableOpacity>
        )}
        {Platform.OS == 'ios' && (
          <TouchableOpacity onPress={() => Linking.openURL(`${CROMA_PLAYSTORE_URL}`)}>
            <View style={styles.linkView}>
              <FontAwesome5 name="google-play" style={styles.icon} />
              <Text style={[styles.line, styles.subtitle]}>{t('Croma on Playstore')}</Text>
              <Text style={[styles.line, styles.link]}>{CROMA_PLAYSTORE_URL}</Text>
            </View>
          </TouchableOpacity>
        )} */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  line: {
    ...material.body1,
    fontSize: 15,
    textAlign: 'justify'
  },
  icon: {
    fontSize: 40,
    color: 'black'
  },
  linksMainView: {
    paddingVertical: 15
  },
  linkView: {
    paddingVertical: 20,
    alignItems: 'center'
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center'
  },
  link: {
    fontSize: 14,
    color: 'blue'
  }
});

export default AboutUsScreen;
