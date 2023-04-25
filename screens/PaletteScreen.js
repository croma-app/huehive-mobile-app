import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';

import SingleColorCard from '../components/SingleColorCard';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { CromaContext } from '../store/store';
import ActionButton from 'react-native-action-button';
import Colors from '../constants/Colors';
import { useHeaderHeight } from '@react-navigation/elements';
import { logEvent } from '../libs/Helpers';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../libs/Helpers';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import PropTypes from 'prop-types';

export default function PaletteScreen({ navigation }) {
  const {
    isPro,
    allPalettes,
    updatePalette,
    deleteColorFromPalette,
    addNewColorToPalette,
    setDetailedColor,
    currentPalette,
    setColorPickerCallback
  } = useContext(CromaContext);

  const paletteName = currentPalette?.name ?? '';

  const { height } = Dimensions.get('window');
  const palette = allPalettes.find((palette) => palette.name === paletteName);
  const colors = palette?.colors;
  const onColorDelete = React.useCallback(
    (hex) => {
      deleteColorFromPalette(palette.id, palette.colors.find((c) => c.color === hex).id || null);
    },
    [deleteColorFromPalette, palette.colors, palette.id]
  );

  logEvent('palette_screen');

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteName });
  }, [navigation, paletteName]);
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

  return (
    <>
      <View style={(styles.container, { minHeight: height - useHeaderHeight() - 16 })}>
        <DraggableFlatList
          data={colorsToShow}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.listview}
          onDragEnd={({ data: reorderedColors }) => {
            //notifyMessage(JSON.stringify(reorderedColors));
            updatePalette(palette.id, { ...palette, colors: reorderedColors });
          }}
        />
        <ActionButton
          offsetY={76}
          bgColor="rgba(68, 68, 68, 0.6)"
          hideShadow={Platform.OS === 'web' ? true : false}
          fixNativeFeedbackRadius={true}
          buttonColor={Colors.fabPrimary}
          onPress={() => {
            logEvent('palette_screen_add_color');
            if (
              (Platform.OS === 'android' || Platform.OS === 'ios') &&
              colors.length >= 4 &&
              isPro === false
            ) {
              notifyMessage('Unlock pro to add more than 4 colors!');
              navigation.navigate('ProVersion');
            } else {
              setColorPickerCallback((color) => {
                addNewColorToPalette(palette.id, { hex: color.color });
              });
              navigation.navigate('ColorPicker');
            }
          }}
          style={styles.actionButton}
        />
      </View>
    </>
  );
}

PaletteScreen.propTypes = {
  navigation: PropTypes.any
};

const CustomHeader = ({ currentPaletteName }) => {
  const [paletteName, setPaletteName] = useState(currentPaletteName);
  const { renamePalette, currentPalette, setCurrentPalette } = useContext(CromaContext);
  const [isEditingPaletteName, setIsEditingPaletteName] = useState(false);

  useEffect(() => {
    setPaletteName(currentPaletteName);
  }, [currentPaletteName]);

  const onDone = () => {
    renamePalette(currentPaletteName, paletteName);
    //setting new name in query params
    setCurrentPalette({ ...currentPalette, name: paletteName });
    setIsEditingPaletteName(false);
  };

  const onEdit = () => {
    logEvent('edit_palette_name');
    setIsEditingPaletteName(true);
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '95%'
      }}>
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
          <TouchableOpacity onPress={onDone} style={{ marginTop: 12 }}>
            <MaterialIcons name="done" size={24} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text
            style={{
              color: '#ffffff',
              fontSize: 18
            }}>
            {paletteName}
          </Text>
          <TouchableOpacity onPress={onEdit}>
            <Feather name="edit" size={24} color="white" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

CustomHeader.propTypes = { currentPaletteName: PropTypes.string };

const setNavigationOptions = ({ navigation, paletteName }) => {
  navigation.setOptions({
    headerTitle: () => <CustomHeader currentPaletteName={paletteName} />
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listview: {
    margin: 8
  },
  actionButton: {},
  input: {
    color: '#ffffff',
    fontSize: 18
  }
});
