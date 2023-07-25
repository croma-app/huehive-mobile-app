import React, { useLayoutEffect, useContext } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { logEvent } from '../libs/Helpers';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { CromaContext } from '../store/store';

export default function CommonPalettesScreen({ navigation }) {
  logEvent('common_palettes_screen');
  const { commonPalettes, setColorList, setSuggestedName } = useContext(CromaContext);
  const { palettes, name } = commonPalettes;

  useLayoutEffect(() => {
    navigation.setOptions({ title: name });
  }, [navigation]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {palettes.map((palette, index) => (
        <PalettePreviewCard
          key={palette?.name ?? index}
          onPress={() => {
            setColorList(palette.colors);
            setSuggestedName(name + ' - ' + palette.name);
            navigation.navigate('ColorList');
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
