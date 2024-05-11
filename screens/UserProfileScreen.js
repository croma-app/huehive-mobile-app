import React, { useCallback, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, Image } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useUserData from '../hooks/useUserData';
import { removeUserSession } from '../libs/EncryptedStoreage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ROUTE_NAMES } from '../libs/contants';
import useApplicationStore from '../hooks/useApplicationStore';
import { logout } from '../network/login-and-signup';

function UserProfile(props) {
  const applicationState = useApplicationStore();
  const { loadInitPaletteFromStore } = applicationState;
  const { userData, loadUserData } = useUserData();

  const { t } = useTranslation();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      offlineAccess: false
    });
  }, []);

  const onLogout = useCallback(async () => {
    await logout();
    await removeUserSession();
    await loadUserData();
    loadInitPaletteFromStore();
    props.navigation.navigate(ROUTE_NAMES.HOME);
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error(error);
    }
    // Google Account disconnected from your app.
    // Perform clean-up actions, such as deleting data associated with the disconnected account.
  }, [loadInitPaletteFromStore, loadUserData, props.navigation]);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={[styles.logoutContainer]}>
        <Image style={styles.logo} source={{ uri: userData?.avatar_url }} />
        <Text style={styles.intro}>
          {t('Name: ')}
          {userData?.fullName}
        </Text>
        <Text style={styles.intro}>
          {t('Email: ')}
          {userData?.email}
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

UserProfile.propTypes = {
  navigation: PropTypes.any,
  hideWelcomeMessage: PropTypes.bool,
  reloadScreen: PropTypes.func,
  signupMessage: PropTypes.string | undefined
};

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 12,
    paddingRight: 12
  },
  intro: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16
  },
  logoutContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  logo: {
    height: 50,
    width: 50,
    marginTop: 30
  }
});

export default UserProfile;
