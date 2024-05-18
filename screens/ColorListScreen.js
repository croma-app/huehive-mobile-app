import React, { useLayoutEffect, useState } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import { StyleSheet, View, Text, Platform, Animated, TouchableOpacity, Modal } from 'react-native';
import { logEvent, notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Color from 'pigment/full';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../constants/Colors';
import { generateRandomColorPaletteWithLockedColors } from '../libs/ColorHelper';

function uniqueColors(colors) {
  let set = new Set();
  let uniqueColors = [];
  colors.forEach((color, index) => {
    if (!set.has(color.color)) {
      if (color.locked === undefined) {
        color.locked = true;
      }
      color.index = index;
      uniqueColors.push(color);
    }
    set.add(color.color);
  });
  return uniqueColors;
}

const GenerateInfoModal = ({ toggleGenerateInfo, showGenerateInfo }) => {
  const { t } = useTranslation();

  return (
    <Modal visible={showGenerateInfo} transparent animationType="fade">
      <TouchableOpacity style={styles.modalBackground} onPress={toggleGenerateInfo}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {t(
              'The "Generate" button creates new color variations for the unlocked colors in the list. It helps you explore different color combinations and discover new palettes.'
            )}
          </Text>
          <TouchableOpacity style={styles.modalCloseButton} onPress={toggleGenerateInfo}>
            <Text style={styles.modalCloseButtonText}>{t('Close')}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default function ColorListScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [showGenerateInfo, setShowGenerateInfo] = useState(false);
  const toggleGenerateInfo = () => {
    setShowGenerateInfo(!showGenerateInfo);
  };
  const [colorList, setColorList] = useState(route.params?.colors || []);
  const colors = uniqueColors(colorList).map((color) => ({
    ...color,
    opacity: color.opacity || new Animated.Value(1)
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? () => <CustomHeader navigation={navigation} />
          : t('Colors')
    });
  }, []);
  const renderItem = ({ item, drag }) => {
    const opecity = item.opacity;
    return (
      <SingleColorView
        onColorChange={(updatedColor) => {
          const updatedColors = [...colors];
          updatedColors[item.index] = updatedColor;
          setColorList(updatedColors);
        }}
        opacity={opecity}
        key={item.color + '-' + item.locked}
        color={item}
        drag={drag}
        onAdd={() => {
          logEvent('add_color_to_palette');
          const currentColor = new Color(colors[item.index].color);
          const newColor = {
            color: currentColor.darken(0.1).tohex(),
            locked: false,
            opacity: new Animated.Value(0)
          };
          const updatedColors = [
            ...colors.slice(0, item.index + 1),
            newColor,
            ...colors.slice(item.index + 1)
          ];
          setColorList(updatedColors);
          // Find the opacity value of the newly added color
          const newColorOpacity = updatedColors[item.index + 1].opacity;
          newColorOpacity.setValue(0);
          Animated.timing(newColorOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true
          }).start();
        }}
        onRemove={() => {
          Animated.timing(opecity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
          }).start(() => {
            logEvent('remove_color_from_palette');
            setColorList(colors.filter((color) => color.color !== item.color));
          });
        }}
      />
    );
  };

  const onDragEnd = ({ data }) => {
    logEvent('drag_end_event_color_list');
    setColorList(data);
  };
  const regenerateUnlockedColors = () => {
    logEvent('regenerate_unlocked_colors', colors.filter((color) => !color.locked).length);
    if (colors.filter((color) => !color.locked).length == 0) {
      notifyMessage('Please unlock some colors or add colors to generate new colors');
    } else {
      const newColors = generateRandomColorPaletteWithLockedColors([...colors]);
      setColorList(newColors);
    }
  };

  logEvent('color_list_screen');
  return (
    <View style={styles.container}>
      <View style={styles.colorListContainer}>
        <DraggableFlatList
          data={colors}
          renderItem={renderItem}
          keyExtractor={(item) => item.color + '-' + item.locked}
          onDragEnd={onDragEnd}
          autoscrollThreshold={100}
        />
      </View>
      <View style={styles.bottomActionArea}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            regenerateUnlockedColors();
          }}>
          <View style={styles.buttonContent}>
            <Ionicons name="shuffle" size={20} color={Colors.primary} />
            <Text style={styles.buttonText}>{t('Generate')}</Text>
            <TouchableOpacity
              style={styles.infoIconContainer}
              onPress={() => {
                toggleGenerateInfo();
              }}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color={Colors.lightGrey}
                style={styles.infoIcon}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('SavePalette', {
              colors: colors.map((color) => {
                return { color: color.color, name: color.name };
              }),
              suggestedName: route.params?.suggestedName
            });
          }}>
          <View style={styles.buttonContent}>
            <Icon name="save" size={20} color={Colors.primary} />
            <Text style={styles.buttonText}>{t('Save')}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <GenerateInfoModal
        toggleGenerateInfo={toggleGenerateInfo}
        showGenerateInfo={showGenerateInfo}
      />
    </View>
  );
}

const CustomHeader = () => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
      }}>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18
        }}>
        {t('New palette')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8
  },
  colorListContainer: {
    flex: 1
  },
  bottomActionArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  button: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: Colors.primary,
    marginLeft: 8,
    fontSize: 18
  },
  infoIcon: {},
  infoIconContainer: {
    paddingHorizontal: 8
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    width: '80%'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007AFF'
  }
});
