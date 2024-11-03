import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import useUserData from '../hooks/useUserData';
import { removeUserSession } from '../libs/EncryptedStorage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ROUTE_NAMES } from '../libs/constants';
import useApplicationStore from '../hooks/useApplicationStore';
import { logout } from '../network/login-and-signup';
import { logEvent } from '../libs/Helpers';
import Colors from '../constants/Styles';
import useAuth from '../hooks/useAuth';
import { AdsConsent, AdsConsentStatus } from 'react-native-google-mobile-ads';

function UserProfile(props) {
  const applicationState = useApplicationStore();
  const { reloadPalettes } = applicationState;
  const { userData, loadUserData } = useUserData();
  const { openAuthOverlay } = useAuth();
  const [consentInfo, setConsentInfo] = useState(false);

  useEffect(() => {
    logEvent('user_profile_screen');
  }, []);

  const { t } = useTranslation();
  
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '865618605576-j2tb9toevqc7tonmbp01dim1ddvod7r0.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
      offlineAccess: false
    });

    // Fetch current ad consent status
    async function fetchConsentStatus() {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      setConsentInfo(consentInfo);
    }
    
    fetchConsentStatus();
  }, []);

  // Function to handle ad consent
  const handleAdConsent = useCallback(async () => {
    if (consentInfo.canRequestAds) {
      // Withdraw consent
      await AdsConsent.reset();
      setConsentInfo(null);
    } else {
      // Request consent
      const consentInfo = await AdsConsent.loadAndShowConsentFormIfRequired();
      setAdConsent(consentInfo);
    }
  }, [consentInfo]);

  const onLogout = useCallback(async () => {
    await logout();
    await removeUserSession();
    await loadUserData();
    reloadPalettes();
    props.navigation.navigate(ROUTE_NAMES.HOME);
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error(error);
    }
  }, [reloadPalettes, loadUserData, props.navigation]);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {userData && 
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
            style={{ backgroundColor: Colors.primary, width: '100%' }}
            textStyle={{ color: Colors.white }}
            onPressWithLoader={onLogout}>
            {t('Logout')}
          </CromaButton>
        </View>
      }
      
      {!userData && 
        <CromaButton
          style={{ backgroundColor: Colors.primary, width: '100%' }}
          textStyle={{ color: Colors.white }}
          onPressWithLoader={() => {
            openAuthOverlay();
          }}>
          {t('Sign In / Sign Up')}
        </CromaButton>
      }

      { consentInfo.status == 'REQUIRED' && 
      <TouchableOpacity
        style={styles.consentButton}
        onPress={handleAdConsent}>
        <Text style={styles.consentText}>
          {consentInfo.canRequestAds ? t('Withdraw Ad Consent') : t('Give Ad Consent')}
        </Text>
      </TouchableOpacity>
      }
    </ScrollView>
  );
}

UserProfile.propTypes = {
  navigation: PropTypes.any,
  hideWelcomeMessage: PropTypes.bool,
  reloadScreen: PropTypes.func,
  signupMessage: PropTypes.string
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
  },
  consentButton: {
    marginTop: 20,
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  consentText: {
    color: Colors.white,
    fontSize: 16
  }
});

export default UserProfile;
