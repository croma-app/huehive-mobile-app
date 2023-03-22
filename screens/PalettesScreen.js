import React, { useContext, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Color from 'pigment/full';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
export default function PalettesScreen({ navigation }) {
  const { detailedColor, setColorList } = useContext(CromaContext);

  useLayoutEffect(() => {
    navigation.setOptions({ title: detailedColor });
  }, [detailedColor]);

  // Convert camelCase to sentence
  const parseCamelCase = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      .replace(/^./, (str) => str.toUpperCase());
  };
  const fullColor = new Color(detailedColor);
  let items = [];
  for (const i in fullColor) {
    if (/.*scheme$/i.test(i) && typeof fullColor[i] === 'function') {
      let colors = [];
      const paletteColors = fullColor[i]();
      paletteColors.forEach((c) => colors.push({ color: c.tohex() }));
      items.push(
        <PalettePreviewCard
          onPress={() => {
            setColorList(colors);
            navigation.navigate('ColorList');
          }}
          key={i.toString()}
          colors={colors}
          name={parseCamelCase(i.toString())}
        />
      );
    }
  }
  logEvent('palettes_screen');
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {items}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});
