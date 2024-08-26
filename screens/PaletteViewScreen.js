/* eslint-disable react/prop-types */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MultiColorView from '../components/MultiColorView';
import { Spacing } from '../constants/Styles';
import { logEvent } from '../libs/Helpers';
import PropTypes from 'prop-types';
import useApplicationStore from '../hooks/useApplicationStore';
import { ColorDetailItems } from '../components/ColorDetails';
import Colors from '../constants/Styles';
import CromaButton from '../components/CromaButton';
import { useTranslation } from 'react-i18next';
export default function PaletteViewScreen({ navigation, route }) {
  const { allPalettes, pro } = useApplicationStore();
  const { t } = useTranslation();

  const [selectedColor, setSelectedColor] = useState(0);

  const paletteId = route.params.paletteId;
  const palette = allPalettes.find((palette) => palette.id === paletteId);
  const colors = palette?.colors;

  useEffect(() => {
    logEvent('palette_view_screen');
  });

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteId: palette.id });
  }, [navigation, palette.id]);

  const colorsToShow = React.useMemo(
    () => colors?.slice(0, pro.plan != 'starter' ? colors.length : 4),
    [colors, pro.plan]
  );

  const color = colorsToShow[selectedColor].color;
  const colorName = colorsToShow[selectedColor].name;

  const backgroundColor = {
    backgroundColor: color,
    height: 80,
    alignSelf: 'stretch',
    borderRadius: 8
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'column',
            padding: 6,
            backgroundColor: Colors.white,
            borderRadius: 8,
            marginTop: 8
          }}>
          <View style={backgroundColor}></View>
          <ColorDetailItems colorName={colorName} color={color} />
          <View style={{ paddingTop: 8 }}>
            <MultiColorView
              colors={colorsToShow}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}></MultiColorView>
          </View>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <CromaButton
          textStyle={{ color: Colors.primary }}
          style={styles.buttonSecondary}
          onPress={() => {
            navigation.navigate('Palettes', { hexColor: color });
          }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 14 }}>{t('Generate Palettes')}</Text>
            <Text style={{ fontSize: 8, color: Colors.grey, textAlign: 'center' }}>
              {t('Using ' + color)}
            </Text>
          </View>
        </CromaButton>

        <CromaButton
          textStyle={{ color: Colors.white }}
          style={styles.buttonPrimary}
          onPress={() => {
            navigation.navigate('PaletteEdit', { paletteId });
          }}>
          {t('Edit')}
        </CromaButton>
      </View>
    </>
  );
}

PaletteViewScreen.propTypes = {
  navigation: PropTypes.any
};

const CustomHeader = ({ paletteId }) => {
  const { allPalettes } = useApplicationStore();
  const palette = allPalettes.find((p) => p.id === paletteId);
  const [paletteName, setPaletteName] = useState(palette.name);

  return (
    <View style={styles.headerContainer}>
      <Text
        style={styles.headerText}
        autoFocus={true}
        onChangeText={(name) => {
          setPaletteName(name);
        }}>
        {paletteName}
      </Text>
    </View>
  );
};

CustomHeader.propTypes = { paletteId: PropTypes.string };

const setNavigationOptions = (props) => {
  const { navigation, paletteId } = props;
  navigation.setOptions({
    headerTitle: () => <CustomHeader paletteId={paletteId} />
  });
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.medium,
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  headerText: {
    color: Colors.white,
    fontSize: 20,
    maxWidth: '80%'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '50%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: Spacing.medium
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    flex: 1
  },
  buttonSecondary: {
    backgroundColor: Colors.white,
    color: Colors.black,
    borderColor: Colors.primary,
    borderWidth: 1,
    flex: 1,
    marginRight: 10
  }
});
