/* eslint-disable react/prop-types */
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { useTranslation } from 'react-i18next';
import Storage from '../libs/Storage';
import { PropTypes } from 'prop-types';
import { AuthForm } from './AppAuthProvider';
import useUserData from '../hooks/useUserData';
import { ScrollView } from 'react-native-gesture-handler';

function LoginOverlayScreen({ markLoginStepDone }) {
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
      <View style={[styles.container]}>
        <Text style={styles.title}>{t('Welcome to HueHive,')}</Text>
      </View>
      <View style={styles.alignSelfEnd}>
        <AuthForm></AuthForm>
        <CromaButton style={[styles.skip]} onPress={authStepMarkDone}>
          {t('Skip')}
        </CromaButton>
      </View>
    </ScrollView>
  );
}

LoginOverlayScreen.propTypes = {
  markLoginStepDone: PropTypes.func
};

const styles = StyleSheet.create({
  rootContainer: {
    display: 'flex',
    paddingLeft: 12,
    paddingRight: 12,
    flex: 1,
    flexDirection: 'column'
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
    textAlign: 'center'
  },
  skip: {
    marginBottom: 20
  },
  alignSelfEnd: {
    marginTop: 'auto'
  }
});

export default LoginOverlayScreen;
