import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-animatable';
import CromaButton from '../components/CromaButton';
import { CromaContext } from '../store/store';
import { purchase, logEvent } from '../libs/Helpers';
import { material } from 'react-native-typography';
import { initPurchase } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';

export default function ProScreen() {
  const { t } = useTranslation();

  const { isPro, setPurchase } = React.useContext(CromaContext);
  const purchaseDevelopment = () => {
    purchase(setPurchase, 'support_development');
  };
  const purchasePro = async () => {
    if (await purchase(setPurchase)) {
      logEvent('pro_version_screen_pur_pro_success');
    } else {
      logEvent('pro_version_screen_pur_pro_failed');
    }
  };
  logEvent('pro_version_screen');
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>{t('Pro benefits')}</Text>
        <Text style={[styles.line]}>{t('1. Add more than 4 colors in a palette 🎨')}</Text>
        <CromaButton
          style={{ backgroundColor: '#ff5c59' }}
          textStyle={{ color: '#fff' }}
          onPress={purchasePro}>
          {isPro ? t('You are a pro user! Enjoy the app') : t('Unlock pro')}
        </CromaButton>
        <Text style={styles.line}>
          {t(
            "2. Support the development efforts to keep the app awesome and simple without any ads and annoying notifications 😊'"
          )}
        </Text>
        <Text style={styles.line}>{t("3. Help us keep the app open source'")}</Text>
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
