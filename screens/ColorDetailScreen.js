import React, { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ColorDetail } from '../components/ColorDetails';
import CromaButton from '../components/CromaButton';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';

export default function ColorDetailScreen({ navigation }) {
  const { detailedColor, setDetailedColor } = React.useContext(CromaContext);
  const { t } = useTranslation();

  useLayoutEffect(() => {
    navigation.setOptions({ title: detailedColor });
  }, [detailedColor]);

  logEvent('color_details_screen');
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ColorDetail color={detailedColor}>{detailedColor}</ColorDetail>
      <CromaButton
        onPress={() => {
          setDetailedColor(detailedColor);
          navigation.navigate('Palettes');
        }}>
        {t('See color palettes')}
      </CromaButton>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  }
});
