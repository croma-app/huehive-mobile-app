/* eslint-disable react/prop-types */
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableWithoutFeedback } from 'react-native';
import MultiColorView from '../components/MultiColorView';
import { Spacing } from '../constants/Styles';
import { logEvent } from '../libs/Helpers';
import PropTypes from 'prop-types';
import ColorPickerModal from '../components/ColorPickerModal';
import useApplicationStore from '../hooks/useApplicationStore';
import { ColorDetailItems } from '../components/ColorDetails';
import Colors from '../constants/Styles';
export default function PaletteViewScreen({ navigation, route }) {
  const { isPro, allPalettes, addNewColorToPalette } = useApplicationStore();

  const [selectedColor, setSelectedColor] = useState(0);

  const paletteId = route.params.paletteId;

  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const palette = allPalettes.find((palette) => palette.id === paletteId);
  const colors = palette?.colors;

  useEffect(() => {
    logEvent('palette_view_screen');
  });

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteId: palette.id });
  }, [navigation, palette.id]);

  const colorsToShow = React.useMemo(
    () => colors?.slice(0, isPro ? colors.length : 4),
    [colors, isPro]
  );

  const handleColorSelected = (color) => {
    addNewColorToPalette(palette.id, { hex: color });
    setIsColorPickerVisible(false);
  };

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
            padding: 8,
            backgroundColor: Colors.white,
            borderRadius: 8,
            marginTop: 12
          }}>
          <View style={backgroundColor}></View>
          <ColorDetailItems colorName={colorName} color={color} />
          <View style={{ paddingTop: 10 }}>
            <MultiColorView
              colors={colorsToShow}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}></MultiColorView>
          </View>
        </View>
      </View>
      <Modal
        visible={isColorPickerVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsColorPickerVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setIsColorPickerVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent}>
          <ColorPickerModal
            onColorSelected={handleColorSelected}
            onClose={() => setIsColorPickerVisible(false)}
          />
        </View>
      </Modal>
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
  }
});
