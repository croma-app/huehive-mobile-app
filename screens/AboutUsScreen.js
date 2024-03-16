import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { material } from 'react-native-typography';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { logEvent } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';

const INSTAGRAM_URL = 'https://www.instagram.com/huehiveco/';
const CROMA_APP_URL = 'https://huehive.co';
const DISCORD_URL = 'https://discord.com/invite/ZSBVsBqDtg';

const AboutUsScreen = () => {
  const { t } = useTranslation();

  logEvent('about_us_screen');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.line}>
          {t(
            'Huehive is a simple color palette manager and color picker made for designers, aiming to make it quick and fun to create and share color palettes on the go.'
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

        <TouchableOpacity onPress={() => Linking.openURL(`${CROMA_APP_URL}`)}>
          <View style={styles.linkView}>
            <MaterialCommunityIcons name="web" style={styles.icon} />
            <Text style={[styles.line, styles.subtitle]}>{t('Web version with ')}</Text>
            <Text style={[styles.line, styles.subtitle]}>{t('ChatGPT support')}</Text>
            <Text style={[styles.line, styles.link]}>{CROMA_APP_URL}</Text>
          </View>
        </TouchableOpacity>
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
