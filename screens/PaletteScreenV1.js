/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import SingleColorCard from '../components/SingleColorCard';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import MultiColorView from '../components/MultiColorView';
import ActionButton from 'react-native-action-button';
import Colors, { Spacing } from '../constants/Styles';
import { useHeaderHeight } from '@react-navigation/elements';
import { logEvent } from '../libs/Helpers';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../libs/Helpers';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import PropTypes from 'prop-types';
import ColorPickerModal from '../components/ColorPickerModal';
import useApplicationStore from '../hooks/useApplicationStore';
import { ColorDetailItems } from '../components/ColorDetails';

import { ColorDetail } from '../components/ColorDetails';
import CromaButton from '../components/CromaButton';
import { useTranslation } from 'react-i18next';

export default function PaletteScreen({ navigation, route }) {
  const {
    isPro,
    allPalettes,
    updatePalette,
    deleteColorFromPalette,
    addNewColorToPalette,
    setDetailedColor
  } = useApplicationStore();

  const [selectedColor, setSelectedColor] = useState(0);
  const { t } = useTranslation();

  const paletteId = route.params.paletteId;

  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const { height } = Dimensions.get('window');
  const palette = allPalettes.find((palette) => palette.id === paletteId);
  const colors = palette?.colors;
  const onColorDelete = React.useCallback(
    (hex) => {
      deleteColorFromPalette(palette.id, palette.colors.find((c) => c.color === hex).id || null);
    },
    [deleteColorFromPalette, palette.colors, palette.id]
  );
  useEffect(() => {
    logEvent('palette_screen');
  });

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteId: palette.id });
  }, [navigation, palette.id]);

  const renderItem = React.useCallback(
    (renderItemParams) => {
      return (
        <ScaleDecorator key={`${renderItemParams.item.id}`}>
          <SingleColorCard
            onPress={() => {
              setDetailedColor(renderItemParams.item.color);
              navigation.navigate('ColorDetails');
            }}
            onPressDrag={renderItemParams.drag}
            color={renderItemParams.item}
            onColorDelete={onColorDelete}
          />
        </ScaleDecorator>
      );
    },
    [navigation, onColorDelete, setDetailedColor]
  );

  const keyExtractor = useCallback((item) => {
    return item.id;
  }, []);

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
    height: 112,
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
            backgroundColor: '#fff',
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

PaletteScreen.propTypes = {
  navigation: PropTypes.any
};

const CustomHeader = ({ paletteId }) => {
  const { updatePalette, allPalettes } = useApplicationStore();
  const palette = allPalettes.find((p) => p.id === paletteId);
  const [paletteName, setPaletteName] = useState(palette.name);
  const [isEditingPaletteName, setIsEditingPaletteName] = useState(false);

  const onDone = () => {
    updatePalette(palette.id, { ...palette, name: paletteName });
    setIsEditingPaletteName(false);
  };

  const onEdit = () => {
    logEvent('edit_palette_name');
    setIsEditingPaletteName(true);
  };

  return (
    <View style={styles.headerContainer}>
      {isEditingPaletteName ? (
        <>
          <TextInput
            style={styles.input}
            value={paletteName}
            autoFocus={true}
            onChangeText={(name) => {
              setPaletteName(name);
            }}
          />
          <TouchableOpacity onPress={onDone} style={styles.marginTop}>
            <MaterialIcons name="done" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.headerTitle}>
            {paletteName.substring(0, 25) + (paletteName.length > 25 ? '...' : '')}
          </Text>
          <TouchableOpacity onPress={onEdit} style={styles.marginTop}>
            <AntDesign name="edit" size={20} color="white" />
          </TouchableOpacity>
        </>
      )}
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
  listview: {
    margin: 8
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%'
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20
  },
  input: {
    color: '#ffffff',
    fontSize: 20,
    maxWidth: '80%'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  marginTop: {
    marginTop: 4
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
