import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { CromaContext } from '../store/store';
import { purchase, logEvent, readRemoteConfig } from '../libs/Helpers';
import { material } from 'react-native-typography';
import { initPurchase } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

export default function ProScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const { isPro, setPurchase } = React.useContext(CromaContext);
  const [aiBehindFF, setAiBehindFF] = useState();

  const purchaseDevelopment = () => {
    purchase(setPurchase, 'support_development');
  };

  useEffect(() => {
    const fetchData = async () => {
      setAiBehindFF(await readRemoteConfig('ai_behind_pro_version'));
      setLoading(false);
    };
    fetchData();
  }, []);

  const purchasePro = async () => {
    if (await purchase(setPurchase)) {
      logEvent('pro_version_screen_pur_pro_success');
    } else {
      logEvent('pro_version_screen_pur_pro_failed');
    }
  };

  logEvent('pro_version_screen');

  return loading ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  ) : (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>{t('Unlock Pro Benefits')}</Text>
        {aiBehindFF && (
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>
              {t(
                'Use HiveHive AI assistant to create, explain, and modify color palettes with ease'
              )}
            </Text>
          </View>
        )}
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            {t('Add unlimited colors to your palettes for greater flexibility and creativity 🎨')}
          </Text>
        </View>
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            {t('Enjoy lifetime access to all current and future pro features')}
          </Text>
        </View>
        <CromaButton style={styles.proButton} textStyle={{ color: '#fff' }} onPress={purchasePro}>
          {isPro ? t('You are a pro user! Enjoy the app') : t('Unlock Pro for Lifetime Access')}
        </CromaButton>
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>
            {t(
              'Support the development efforts to keep the app awesome and simple without any ads or annoying notifications 😊'
            )}
          </Text>
        </View>
        <View style={styles.benefit}>
          <Text style={styles.bulletPoint}>•</Text>
          <Text style={styles.benefitText}>{t('Help us keep the app open source')}</Text>
        </View>
        <CromaButton style={styles.devButton} onPress={purchaseDevelopment}>
          {t('Support Development')}
        </CromaButton>

        {!isPro && (
          <View>
            <Text style={styles.title}>{t('Restore Purchase')}</Text>
            <CromaButton
              style={styles.restoreButton}
              onPress={async () => {
                await initPurchase(setPurchase);
              }}>
              {t('Restore Pro')}
            </CromaButton>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.darkGrey
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  bulletPoint: {
    fontSize: 16,
    marginRight: 8,
    color: Colors.darkGrey
  },
  benefitText: {
    ...material.body1,
    flex: 1,
    fontSize: 16,
    color: Colors.darkGrey
  },
  proButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 24,
    marginBottom: 32
  },
  devButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 32
  },
  restoreButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16
  }
});
