/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, TextInput, ScrollView, Platform } from 'react-native';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import Colors from '../constants/Styles';
import CromaButton from '../components/CromaButton';
import { TextDialog } from '../components/CommonDialogs';
import { useTranslation } from 'react-i18next';
import { logEvent, notifyMessage } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import AdBanner from '../components/AdBanner';
import { NUMBER_OF_COLORS_PRO_COUNT } from '../libs/constants';

export default function SavePaletteScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { addPalette, allPalettes, pro } = useApplicationStore();

  const [finalColors, setFinalColors] = useState([]);
  const [isPaletteNameExist, setIsPaletteNameExist] = React.useState(false);

  useEffect(() => {
    let colorsFromParams = route.params?.colors;
    const colors = [...new Set(colorsFromParams || [])];
    setFinalColors(colors);
  }, [route.params?.colors]);

  const inputRef = useRef(null);

  useEffect(() => {
    logEvent('save_palette_screen');
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [paletteName, setPaletteName] = useState(route.params?.suggestedName ?? '');

  const handleUnlockPro = () => {
    navigation.navigate('ProVersion', { highlightFeatureId: 9 });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ margin: 8 }} showsVerticalScrollIndicator={false}>
        <PalettePreviewCard
          colors={finalColors.slice(0, pro.plan != 'starter' ? finalColors.length : NUMBER_OF_COLORS_PRO_COUNT)}
          name={paletteName}
        />
        <View style={styles.card}>
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={paletteName}
              autoFocus
              placeholder={t('Enter a name for the palette')}
              onChangeText={(name) => setPaletteName(name)}
            />
            <CromaButton
              style={styles.saveButton}
              textStyle={styles.saveButtonText}
              onPress={async () => {
                if (allPalettes.findIndex((palette) => palette.name === paletteName) !== -1) {
                  setIsPaletteNameExist(true);
                  setTimeout(() => {
                    setIsPaletteNameExist(false);
                  }, 3000);
                  return null;
                }
                const palette = {
                  name: paletteName,
                  colors: finalColors.slice(0, pro.plan != 'starter' ? finalColors.length : NUMBER_OF_COLORS_PRO_COUNT)
                };
                addPalette(palette);
                notifyMessage("Successfully saved to Your Palettes");
                navigation.popToTop();
              }}
            >
              {t('Save')}
            </CromaButton>
          </View>
        </View>
        {pro.plan == 'starter' && finalColors.length > NUMBER_OF_COLORS_PRO_COUNT && (
          <View style={styles.proVersionContainer}>
            <Text style={styles.proVersionText}>
              {t(
                'Upgrade to Pro to save unlimited colors in a palette. Starter Plan allows saving up to ' + NUMBER_OF_COLORS_PRO_COUNT + ' colors.'
              )}
            </Text>
            <CromaButton
              style={styles.proVersionButton}
              textStyle={{ color: Colors.white }}
              onPress={handleUnlockPro}
            >
              {t('Upgrade to Pro')}
            </CromaButton>
          </View>
        )}
        {isPaletteNameExist && (
          <TextDialog text={t('A palette with the same name already exists.')} />
        )}
      </ScrollView>
      {Platform.OS =='android' && <AdBanner plan={pro.plan} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: Colors.white,
    elevation: 2,
    marginVertical: 10,
    padding: 10,
    borderRadius: 8
  },
  title: {
    fontWeight: '700'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginRight: 10
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
  },
  proVersionContainer: {
    marginTop: 24,
    marginBottom: 32,
    alignItems: 'center'
  },
  proVersionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12
  },
  proVersionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8
  },
  saveButtonText: {
    color: Colors.primary
  }
});
