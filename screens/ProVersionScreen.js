import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import Colors, { Spacing } from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';
import { purchase, logEvent, initPurchase, planLabels, getPlanPrice } from '../libs/Helpers';
import { material } from 'react-native-typography';
import CromaButton from '../components/CromaButton';
import Spacer from '../components/Spacer';

export default function ProScreen() {
  const { t } = useTranslation();
  const { pro, setPurchase } = useApplicationStore();
  const isStarter = pro.plan === 'starter';
  const isPro = pro.plan === 'pro';
  const isProPlus = pro.plan === 'proPlus';
  const [prices, setPrices] = useState({
    pro: '',
    proPlus: ''
  });

  useEffect(() => {
    logEvent('pro_version_screen');
    async function fetchPrices() {
      try {
        let priceData =  [];
        if (pro.plan == 'starter') {
          priceData = await getPlanPrice('starter', ['pro', 'proPlus']);
        } else if (pro.plan == 'pro') {
          priceData = await getPlanPrice('pro', ['proPlus']);
        }
        const prices = priceData.reduce((acc, plan) => {
          acc[plan.toPlan] = plan.price;
          return acc;
        }, {});
        setPrices(prices);
      } catch (error) {
        console.error('Failed to fetch prices', error);
      }
    }
    fetchPrices();
  }, []);
  const planFeatures = [
    {
      feature: t('Generate and modify palettes with up to 4 colors'),
      starter: true,
      pro: true,
      proPlus: true
    },
    { feature: t('Extract colors from images and camera'), starter: true, pro: true, proPlus: true },
    { feature: t('Manually pick colors'), starter: true, pro: true, proPlus: true },
    { feature: t('Generate harmonious color schemes'), starter: true, pro: true, proPlus: true },
    { feature: t('View and convert color codes'), starter: true, pro: true, proPlus: true },
    {
      feature: t('Access Material Design, CSS, and Tailwind palettes'),
      starter: true,
      pro: true,
      proPlus: true
    },
    { feature: t('Download palettes as PNG'), starter: true, pro: true, proPlus: true },
    { feature: t('Explore AI-generated color palettes'), starter: false, pro: true, proPlus: true },
    { feature: t('Add more than 4 colors to a palette'), starter: false, pro: true, proPlus: true },
    {
      feature: t('AI chat assistant to create palettes'),
      starter: false,
      pro: false,
      proPlus: true
    },
    { feature: t('AI color picker'), starter: false, pro: false, proPlus: true }
  ];

  const purchasePro = async () => {
    const success = await purchase(setPurchase, pro.plan, 'pro');
    logEvent(success ? 'pro_version_screen_pur_pro_success' : 'pro_version_screen_pur_pro_failed');
  };

  const purchaseProPlus = async () => {
    const success = await purchase(setPurchase, pro.plan, 'proPlus');
    logEvent(
      success ? 'pro_version_screen_pur_proPlus_success' : 'pro_version_screen_pur_proPlus_failed'
    );
  };

  useEffect(() => {
    logEvent('pro_version_screen');
  }, []);

  const renderTickOrCross = (isAvailable) => (
    <FontAwesome
      name={isAvailable ? 'check' : 'times'}
      size={14}
      color={isAvailable ? Colors.darkGreen : Colors.darkRed}
    />
  );

  const handlePlanSelection = (plan) => {
    if (plan === 'pro') purchasePro();
    if (plan === 'proPlus') purchaseProPlus();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View>
          <View style={styles.table}>
            <View style={[styles.row, styles.rowTitle]}>
              <Text style={styles.feature}></Text>
              <Text style={[styles.header, isStarter ? styles.currentPlanLabel : null]}>
                {t(planLabels.starter)}
                {'\n'}
                <Text style={styles.subHeader}>{t('Free')}</Text>
              </Text>
              <Text style={[styles.header, isPro ? styles.currentPlanLabel : null]}>
                {t(planLabels.pro)}
                {'\n'}
                <Text style={[ styles.subHeader] }>{`Lifetime Access`} </Text>
                { prices.pro && 
                  <Text style={[styles.price, styles.subHeader] }>{prices.pro}</Text>
                }
              </Text>
              <Text style={[styles.header, isProPlus ? styles.currentPlanLabel : null]}>
                {t(planLabels.proPlus)}
                {'\n'}
                <Text style={[ styles.subHeader] }>{`Lifetime Access`} </Text>
                { prices.proPlus &&
                  <Text style={[styles.price, styles.subHeader] }>{prices.proPlus}</Text>
                }
              </Text>
            </View>
            {planFeatures.map((item, index) => (
              <View
                style={[
                  styles.row,
                  pro.plan === 'starter' && item.starter && styles.currentPlan,
                  pro.plan === 'pro' && item.pro && styles.currentPlan,
                  pro.plan === 'proPlus' && item.proPlus && styles.currentPlan
                ]}
                key={index}>
                <Text style={styles.feature}>{item.feature}</Text>
                <View style={styles.icon}>{renderTickOrCross(item.starter)}</View>
                <View style={styles.icon}>{renderTickOrCross(item.pro)}</View>
                <View style={styles.icon}>{renderTickOrCross(item.proPlus)}</View>
              </View>
            ))}
          </View>
          <View style={styles.proPlusUserMessage}>
            <Text style={styles.proPlusUserText}>
              {t(
                'You are a ' + planLabels[pro.plan] + ' user.'
              )}
            </Text>
          </View>
          {isStarter && (
            <TouchableOpacity
              style={[styles.planButton]}
              onPress={() => handlePlanSelection('pro')}>
              <Text style={styles.planButtonText}>{t('Upgrade to Pro')}</Text>
            </TouchableOpacity>
          )}
          {(isStarter || isPro) && (
            <TouchableOpacity
              style={[styles.planButton]}
              onPress={() => handlePlanSelection('proPlus')}>
              <Text style={styles.planButtonText}>{t('Upgrade to Pro Plus')}</Text>
            </TouchableOpacity>
          )}
          {isStarter && (
            <View style={styles.restoreProView}>
              <Text style={styles.title}>{t('Already bought click below to restore 👇')}</Text>
              <CromaButton
                style={styles.restoreButton}
                onPress={async () => await initPurchase(setPurchase)}>
                {t('Restore Purchase')}
              </CromaButton>
            </View>
          )}
        </View>
        <Spacer></Spacer>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.medium,
    paddingTop: 24
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.darkGrey
  },
  currentPlanContainer: {
    marginBottom: 16,
    backgroundColor: Colors.lightGrey,
    padding: 10,
    borderRadius: 8
  },
  currentPlanText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center'
  },
  table: {
    borderColor: Colors.lightGrey,
    borderRadius: 8
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderColor: Colors.lightGrey
  },
  rowTitle: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderWidth: 0
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    fontSize: 14,
    height: 70 
  },
  subHeader: {
    fontSize: 10,
    fontWeight: 'normal',
  },
  price: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    color: Colors.royalBlue
  },
  feature: {
    flex: 3,
    ...material.body1,
    fontSize: 14,
    color: Colors.darkGrey
  },
  icon: {
    flex: 1,
    alignItems: 'center'
  },
  planButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center'
  },
  planButtonText: {
    color: Colors.white,
    fontSize: 16
  },
  proPlusUserMessage: {
    padding: 10,
    borderRadius: 8,
    marginTop: 16
  },
  proPlusUserText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  restoreProView: {
    marginVertical: 24
  },
  currentPlan: {
    backgroundColor: Colors.lightBlue
  },
  currentPlanLabel: {
    backgroundColor: Colors.lightBlue
  }
});
