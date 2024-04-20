import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Platform, ScrollView } from 'react-native';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import Colors from '../constants/Colors';
import CromaButton from '../components/CromaButton';
import { CromaContext } from '../store/store';
import { TextDialog } from '../components/CommonDialogs';
import { StackActions } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { logEvent } from '../libs/Helpers';

export default function SavePaletteScreen({ navigation, route }) {
  logEvent('save_palette_screen');

  const { t } = useTranslation();
  const { addPalette, allPalettes, isPro, setCurrentPalette } = React.useContext(CromaContext);

  const [finalColors, setFinalColors] = useState([]);
  const [isPaletteNameExist, setIsPaletteNameExist] = React.useState(false);
  const [isUnlockProNotification, setIsUnlockProNotification] = useState(false);

  useEffect(() => {
    let colorsFromParams = route.params?.colors;
    const colors = [...new Set(colorsFromParams || [])];
    setIsUnlockProNotification(!isPro && colors.length > 4);
    setFinalColors(colors);
    setTimeout(() => {
      setIsUnlockProNotification(false);
    }, 5000);
  }, [isPro]);

  const [paletteName, setPaletteName] = useState(route.params?.suggestedName ?? '');

  return (
    <ScrollView style={{ margin: 8 }} showsVerticalScrollIndicator={false}>
      <PalettePreviewCard
        colors={finalColors.slice(0, isPro ? finalColors.length : 4)}
        name={paletteName}
      />
      <View style={styles.card}>
        <Text style={[styles.label, styles.title]}>ADD NEW PALETTE</Text>
        <TextInput
          style={styles.input}
          value={paletteName}
          placeholder={t('Enter a name for the palette')}
          onChangeText={(name) => setPaletteName(name)}
        />
      </View>
      <CromaButton
        onPress={async () => {
          if (allPalettes.findIndex((palette) => palette.name === paletteName) !== -1) {
            setIsPaletteNameExist(true);
            setTimeout(() => {
              setIsPaletteNameExist(false);
            }, 3000);
            return null;
          }
          const palette = { name: paletteName, colors: finalColors };
          addPalette(palette);
          setPaletteName(undefined);
          navigation.path === 'Palette' ? setCurrentPalette(palette) : setCurrentPalette({});
          Platform.OS === 'android' || Platform.OS === 'ios'
            ? navigation.dispatch(StackActions.popToTop())
            : navigation.replace('Home');
        }}>
        {t('Save palette')}
      </CromaButton>
      {isPaletteNameExist && <TextDialog text={t('A palette with same name already exists.')} />}
      {isUnlockProNotification && <TextDialog text={t('Unlock pro to save more than 4 colors!')} />}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: '#fff',
    elevation: 2,
    height: 92,
    marginVertical: 10,
    padding: 10,
    borderRadius: 8
  },
  title: {
    fontWeight: '700'
  },
  input: {
    flex: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 54
  },
  label: {
    flex: 1,
    color: Colors.darkGrey
  }
});
