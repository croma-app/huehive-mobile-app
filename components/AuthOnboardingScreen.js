/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from './CromaButton';
import { useTranslation } from 'react-i18next';
import Storage from '../libs/Storage';
import { PropTypes } from 'prop-types';
import { AuthForm } from './AppAuthProvider';
import useUserData from '../hooks/useUserData';
import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';

function AuthOnboardingScreen({ markLoginStepDone }) {
  const { t } = useTranslation();
  const { userData } = useUserData();
  const authStepMarkDone = useCallback(() => {
    Storage.markOverflowStepDone();
    markLoginStepDone(true);
  }, [markLoginStepDone]);
  useEffect(() => {
    if (userData) {
      authStepMarkDone();
    }
  }, [authStepMarkDone, userData]);

  return (
    <ScrollView style={styles.rootContainer} showsVerticalScrollIndicator={true}>
      <LinearGradient colors={['#f36a64', '#f89f9b', '#fcd8d6']} style={styles.backgroundGradient}>
        <View style={[styles.container]}>
          <Text style={styles.title}>{t('Welcome to HueHive!')}</Text>
          <Text style={styles.description}>
            {t('Discover the power of AI-generated color palettes and unleash your creativity.')}
          </Text>
          <View style={styles.image} resizeMode="cover">
            <View style={styles.featuresContainer}>
              <Text style={styles.features}>
                {t('- Generate stunning color palettes using AI')}
              </Text>
              <Text style={styles.features}>
                {t('- Extract colors from images and pick colors manually')}
              </Text>
              <Text style={styles.features}>
                {t('- Share and collaborate on color palettes easily')}
              </Text>
              <Text style={styles.features}>
                {t('- Access a vast library of pre-built color palettes')}
              </Text>
              <Text style={styles.features}>{t('- And much more!')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.alignSelfEnd}>
          <AuthForm></AuthForm>
          <CromaButton style={[styles.skip]} onPress={authStepMarkDone}>
            {t('Skip')}
          </CromaButton>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

AuthOnboardingScreen.propTypes = {
  markLoginStepDone: PropTypes.func
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  backgroundGradient: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  },
  container: {
    alignItems: 'center'
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF'
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF'
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  featuresContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 10
  },
  features: {
    fontSize: 18,
    textAlign: 'left',
    marginBottom: 10,
    color: '#FFFFFF'
  },
  skip: {
    marginBottom: 20
  },
  alignSelfEnd: {
    marginTop: 'auto'
  }
});

export default AuthOnboardingScreen;
