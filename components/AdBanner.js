// AdBanner.js
import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, TestIds, AdsConsent } from 'react-native-google-mobile-ads';

const AdBanner = ({ plan }) => {
  const [mobileAdConsent, setMobileAdConsent] = useState(false);

  useEffect(() => {
    async function requestConsent() {
      const consentInfo = await AdsConsent.requestInfoUpdate();
      let canRequestAds = false;
      if (consentInfo.status === 'REQUIRED') {
        const adsConsentInfo = await AdsConsent.loadAndShowConsentFormIfRequired();
        canRequestAds = adsConsentInfo.canRequestAds;
      } else {
        canRequestAds = consentInfo.canRequestAds;
      }

      if (canRequestAds) {
        await mobileAds().initialize();
      }

      setMobileAdConsent(canRequestAds);
    }

    requestConsent();
  }, []);

  // Return null if ads shouldn't be displayed
  if (plan === 'proPlus' || !mobileAdConsent || Platform.OS !== 'android') {
    return null;
  }

  return (
    <View>
      <BannerAd
        unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-6847037498271557/2834003395'}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

export default AdBanner;
