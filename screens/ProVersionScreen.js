import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { CromaContext } from '../store/store';
import { purchase, logEvent, readRemoteConfig } from '../libs/Helpers';
import { material } from 'react-native-typography';
import { initPurchase } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';

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
      <ActivityIndicator size="large" color="#ff5c59" />
    </View>
  ) : (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>{t('Pro benefits')}</Text>
        {aiBehindFF && (
          <Text style={[styles.line]}>
            {t('• Use HiveHive AI assistant to create, explain and modify color palettes')}
          </Text>
        )}
        <Text style={[styles.line]}>{t('• Add more than 4 colors in a palette 🎨')}</Text>
        <Text style={[styles.line]}>{t('• Lifetime access to all current set of features')}</Text>
        <CromaButton
          style={{ backgroundColor: '#ff5c59' }}
          textStyle={{ color: '#fff' }}
          onPress={purchasePro}>
          {isPro ? t('You are a pro user! Enjoy the app') : t('Unlock pro for lifetime access')}
        </CromaButton>
        <Text style={styles.line}>
          {t(
            '• Support the development efforts to keep the app awesome and simple without any ads and annoying notifications 😊'
          )}
        </Text>
        <Text style={styles.line}>{t('• Help us keep the app open source')}</Text>
        <CromaButton onPress={purchaseDevelopment}>{t('Support development')}</CromaButton>

        {!isPro && (
          <View>
            <Text style={[styles.title]}>{t('Restore purchase')}</Text>
            <CromaButton
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
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: 'bold'
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15
  }
});
