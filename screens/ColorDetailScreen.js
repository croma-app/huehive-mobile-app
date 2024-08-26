import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ColorDetail } from '../components/ColorDetails';
import { logEvent } from '../libs/Helpers';

export default function ColorDetailScreen({ navigation, route }) {
  const hexColor = route.params?.hexColor;

  useLayoutEffect(() => {
    navigation.setOptions({ title: hexColor });
  }, [hexColor]);

  useEffect(() => {
    logEvent('color_details_screen');
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ColorDetail color={hexColor}>{hexColor}</ColorDetail>
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
