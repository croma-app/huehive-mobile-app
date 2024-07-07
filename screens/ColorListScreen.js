import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import { StyleSheet, View, Text, Platform, Animated, TouchableOpacity } from 'react-native';
import { logEvent, notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Color from 'pigment/full';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../constants/Styles';
import { generateRandomColorPaletteWithLockedColors } from '../libs/ColorHelper';
import useApplicationStore from '../hooks/useApplicationStore';

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

export default function ColorListScreen({ navigation, route }) {
  const { t } = useTranslation();
  const [colorListHistory, setColorListHistory] = useState([route.params?.colors || []]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { pro } = useApplicationStore();
  const colorList = colorListHistory[currentIndex];
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
    const opacity = item.opacity;
    return (
      <SingleColorView
        onColorChange={(updatedColor) => {
          const updatedColors = [...colors];
          updatedColors[item.index] = updatedColor;
          updateColorList(updatedColors);
        }}
        opacity={opacity}
        key={item.color + '-' + item.locked}
        color={item}
        showUnlockPro={pro.plan == 'starter' && item.index >= 4}
        drag={drag}
        currentPlan={pro.plan}
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
          updateColorList(updatedColors);
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
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true
          }).start(() => {
            logEvent('remove_color_from_palette');
            updateColorList(colors.filter((color) => color.color !== item.color));
          });
        }}
      />
    );
  };

  const onDragEnd = ({ data }) => {
    logEvent('drag_end_event_color_list');
    updateColorList(data);
  };
  const regenerateUnlockedColors = () => {
    logEvent('regenerate_unlocked_colors', colors.filter((color) => !color.locked).length);
    if (colors.filter((color) => !color.locked).length == 0) {
      notifyMessage('Please unlock some colors or add colors to generate new colors');
    } else {
      const newColors = generateRandomColorPaletteWithLockedColors([...colors]);
      updateColorList(newColors);
    }
  };
  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < colorListHistory.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const updateColorList = (updatedColors) => {
    setColorListHistory([...colorListHistory.slice(0, currentIndex + 1), updatedColors]);
    setCurrentIndex(currentIndex + 1);
  };
  useEffect(() => {
    logEvent('color_list_screen');
  }, []);

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
        <View style={styles.undoRedoContainer}>
          <TouchableOpacity
            style={[styles.smallButton, currentIndex === 0 && styles.disabledButton]}
            onPress={undo}
            disabled={currentIndex === 0}>
            <View style={styles.smallButtonContent}>
              <Icon name="undo" size={16} color={currentIndex === 0 ? Colors.gray : Colors.black} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.smallButton,
              currentIndex === colorListHistory.length - 1 && styles.disabledButton
            ]}
            onPress={redo}
            disabled={currentIndex === colorListHistory.length - 1}>
            <View style={styles.smallButtonContent}>
              <Icon
                name="repeat"
                size={16}
                color={currentIndex === colorListHistory.length - 1 ? Colors.gray : Colors.black}
              />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            regenerateUnlockedColors();
          }}>
          <View style={styles.buttonContent}>
            <Text style={styles.buttonText}>{t('Generate')}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => {
            navigation.navigate('SavePalette', {
              colors: colors.map((color) => {
                return { color: color.color, name: color.name };
              }),
              suggestedName: route.params?.suggestedName
            });
          }}>
          <View style={styles.buttonContent}>
            <MaterialIcons name="done" size={24} color={Colors.black} />
          </View>
        </TouchableOpacity>
      </View>
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
          color: Colors.white,
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'white',
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  doneButton: {
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: 'white',
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    color: Colors.black,
    marginLeft: 8,
    fontSize: 18
  },
  infoIcon: {},
  infoIconContainer: {
    paddingHorizontal: 8
  },
  smallButton: {
    marginHorizontal: 4,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallButtonContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  undoRedoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: Colors.white,
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
  },
  disabledButton: {
    opacity: 0.5
  }
});
