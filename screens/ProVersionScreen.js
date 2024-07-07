import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';
import { purchase, logEvent, initPurchase } from '../libs/Helpers';
import { material } from 'react-native-typography';
import CromaButton from '../components/CromaButton';

export default function ProScreen() {
  const { t } = useTranslation();
  const { pro, setPurchase } = useApplicationStore();
  const isFree = pro.plan === 'free';
  const isBasic = pro.plan === 'basic';
  const isAdvance = pro.plan === 'advance';

  const planFeatures = [
    { feature: t('Generate and modify palettes with up to 4 colors'), free: true, basic: true, advance: true },
    { feature: t('Extract colors from images'), free: true, basic: true, advance: true },
    { feature: t('Manually pick colors'), free: true, basic: true, advance: true },
    { feature: t('View and convert color codes'), free: true, basic: true, advance: true },
    { feature: t('Access Material Design, CSS, and Tailwind palettes'), free: true, basic: true, advance: true },
    { feature: t('Download palettes as PNG images'), free: true, basic: true, advance: true },
    { feature: t('Explore AI-generated color palettes'), free: true, basic: true, advance: true },
    { feature: t('Add more than 4 colors to a palette'), free: false, basic: true, advance: true },
    { feature: t('AI chat assistant to create palettes'), free: false, basic: false, advance: true },
    { feature: t('AI color picker'), free: false, basic: false, advance: true },
  ];

  const purchasePro = async () => {
    const success = await purchase(setPurchase, pro.plan, 'basic');
    logEvent(success ? 'pro_version_screen_pur_pro_success' : 'pro_version_screen_pur_pro_failed');
  };

  const purchaseAdvance = async () => {
    const success = await purchase(setPurchase, pro.plan, 'advance');
    logEvent(success ? 'pro_version_screen_pur_advance_success' : 'pro_version_screen_pur_advance_failed');
  };

  useEffect(() => {
    logEvent('pro_version_screen');
  }, []);

  const renderTickOrCross = (isAvailable) => (
    <FontAwesome
      name={isAvailable ? 'check' : 'times'}
      size={18}
      color={isAvailable ? Colors.darkGreen : Colors.darkRed}
    />
  );

  const handlePlanSelection = (plan) => {
    if (plan === 'basic') purchasePro();
    if (plan === 'advance') purchaseAdvance();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <View>
        <Text style={styles.title}>{t('Choose Your Plan')}</Text>
        <View>
          <Text>Your current plan is {pro.plan}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.feature}></Text>
            <Text style={styles.header}>{t('Free')}</Text>
            <Text style={styles.header}>{t('Basic')}</Text>
            <Text style={styles.header}>{t('Advance')}</Text>
          </View>
          {planFeatures.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.feature}>{item.feature}</Text>
              <View style={styles.icon}>{renderTickOrCross(item.free)}</View>
              <View style={styles.icon}>{renderTickOrCross(item.basic)}</View>
              <View style={styles.icon}>{renderTickOrCross(item.advance)}</View>
            </View>
          ))}
        </View>
        
        {isFree && <TouchableOpacity
          style={[styles.planButton]}
          onPress={() => handlePlanSelection('basic')}
        >
          <Text style={styles.planButtonText}>{ t('Upgrade to Basic pro plan')}</Text>
        </TouchableOpacity>
        }
        { isFree && isBasic &&
        <TouchableOpacity
          style={[styles.planButton]}
          onPress={() => handlePlanSelection('advance')}
        >
          <Text style={styles.planButtonText}>{t('Upgrade to Advance pro plan')}</Text>
        </TouchableOpacity>
        }
        { isAdvance && <View>
            <Text>You are already Advance Pro user. Thanks for supporting HueHive. Enjoy the App.</Text>
          </View>
        }
        {isFree && (
          <View style={styles.restoreProView}>
            <Text style={styles.title}>{t('Restore Purchase')}</Text>
            <CromaButton
              style={styles.restoreButton}
              onPress={async () => await initPurchase(setPurchase)}
            >
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
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.darkGrey,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  priceHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  table: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  header: {
    flex: 1,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    fontSize: 14,
  },
  feature: {
    flex: 2,
    ...material.body1,
    fontSize: 14,
    color: Colors.darkGrey,
  },
  icon: {
    flex: 1,
    alignItems: 'center',
  },
  planButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
  },
  planButtonText: {
    color: Colors.white,
    fontSize: 16,
  },
  currentPlan: {
    backgroundColor: Colors.primary,
  },
  restoreButton: {
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: Colors.secondary,
  },
  restoreProView: {
    marginBottom: 24,
  },
});

