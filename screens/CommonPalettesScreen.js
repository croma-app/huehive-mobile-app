import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { logEvent } from '../libs/Helpers';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import useApplicationStore from '../hooks/useApplicationStore';

export default function CommonPalettesScreen({ navigation }) {
  const { commonPalettes } = useApplicationStore();
  const { palettes, name } = commonPalettes;

  useEffect(() => {
    logEvent('common_palettes_screen');
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {palettes.map((palette, index) => (
        <PalettePreviewCard
          key={palette?.name ?? index}
          onPress={() => {
            navigation.navigate('ColorList', {
              colors: palette.colors,
              suggestedName: name + ' - ' + palette.name
            });
          }}
          colors={palette.colors}
          name={palette.name}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});
