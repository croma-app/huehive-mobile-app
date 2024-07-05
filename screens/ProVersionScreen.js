import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CromaButton from '../components/CromaButton';
import { purchase, logEvent } from '../libs/Helpers';
import { material } from 'react-native-typography';
import { initPurchase } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';

export default function ProScreen() {
  const { t } = useTranslation();
  const { pro, setPurchase } = useApplicationStore();
  const isFree = pro.plan == 'free';
  const isBasic = pro.plan == 'basic';
  const isAdvance = pro.plan == 'advance';
  const purchasePro = async () => {
    if (await purchase(setPurchase)) {
      logEvent('pro_version_screen_pur_pro_success');
    } else {
      logEvent('pro_version_screen_pur_pro_failed');
    }
  };

  const purchaseAdvance = async () => {
    if (await purchase(setPurchase, 'advance')) {
      logEvent('pro_version_screen_pur_advance_success');
    } else {
      logEvent('pro_version_screen_pur_advance_failed');
    }
  };

  useEffect(() => {
    logEvent('pro_version_screen');
  }, []);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>{t('Choose Your Plan')}</Text>

        <View style={styles.plan}>
          <Text style={styles.planTitle}>{t('Free Plan')}</Text>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('List of features')}</Text>
          </View>
          {isFree && (
            <CromaButton style={[styles.planButton, styles.primaryButton]}>
              {t('Current Plan')}
            </CromaButton>
          )}
        </View>

        <View style={styles.plan}>
          <Text style={styles.planTitle}>{t('Pro Plan')}</Text>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('Save more than 4 colours')}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('All Free plan features')}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('1 day trial to Advance plan')}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('Explore AI generated existing palettes')}</Text>
          </View>
          {isBasic && (
            <CromaButton
              style={
                isBasic
                  ? [styles.planButton, styles.primaryButton]
                  : [styles.planButton, styles.secondaryButton]
              }
              onPress={purchasePro}>
              {isBasic ? t('Current Plan') : t('Unlock Pro')}
            </CromaButton>
          )}
        </View>

        <View style={styles.plan}>
          <Text style={styles.planTitle}>{t('Advance Plan')}</Text>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('All Pro plan features')}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('AI chat to create color palette')}</Text>
          </View>
          <View style={styles.benefit}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.benefitText}>{t('AI color picker')}</Text>
          </View>
          <CromaButton
            style={
              isAdvance
                ? [styles.planButton, styles.primaryButton]
                : [styles.planButton, styles.secondaryButton]
            }
            onPress={purchaseAdvance}>
            {isAdvance ? t('Current Plan') : t('Unlock Advance')}
          </CromaButton>
        </View>

        {isFree && (
          <View style={styles.restoreProView}>
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
  plan: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.primary
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8
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
  planButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16
  },
  primaryButton: {
    backgroundColor: Colors.primary
  },
  secondaryButton: {
    backgroundColor: Colors.secondary
  },
  restoreButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: Colors.secondary
  },
  restoreProView: {
    marginBottom: 24
  }
});
