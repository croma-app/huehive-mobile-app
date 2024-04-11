import React, { useLayoutEffect } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import { StyleSheet, View, Text, Platform, Animated } from 'react-native';
import CromaButton from '../components/CromaButton';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';
import DraggableFlatList from 'react-native-draggable-flatlist';
import Color from 'pigment/full';

export default function ColorListScreen({ navigation }) {
  const { t } = useTranslation();
  const [helpMessage, setHelpMessage] = React.useState('Generate new colors for unlocked colors');

  const { colorList, setColorList } = React.useContext(CromaContext);
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
          const index = colors.findIndex((color) => color.color === updatedColor.color);
          const updatedColors = [...colors];
          updatedColors[index] = updatedColor;
          setColorList(updatedColors);
        }}
        opacity={opecity}
        key={item.color + '-' + item.locked}
        color={item}
        drag={drag}
        onAdd={() => {
          logEvent('add_color_to_palette');
          const index = colors.findIndex((color) => color.color === item.color);
          const currentColor = new Color(colors[index].color);
          const newColor = {
            color: currentColor.darken(0.1).tohex(),
            locked: false,
            opacity: new Animated.Value(0)
          };
          const updatedColors = [
            ...colors.slice(0, index + 1),
            newColor,
            ...colors.slice(index + 1)
          ];

          setColorList(updatedColors);

          // Find the opacity value of the newly added color
          const newColorOpacity = updatedColors[index + 1].opacity;
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
      setHelpMessage('Please unlock some colors or add colors to generate new colors');
    } else {
      // TODO: improve this algorithm.
      const newColors = colors.map((color) => {
        if (!color.locked) {
          color.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        }
        return color;
      });
      setColorList(newColors);
    }
  };

  logEvent('color_list_screen');
  return (
    <View style={styles.container}>
      {/* this is to make sure scrolling works */}
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          data={colors}
          renderItem={renderItem}
          keyExtractor={(item) => item.color + '-' + item.locked}
          onDragEnd={onDragEnd}
          autoscrollThreshold={100}
        />
      </View>
      <Text style={styles.hintText}>{helpMessage}</Text>
      <CromaButton
        style={styles.button}
        onPress={() => {
          regenerateUnlockedColors();
        }}>
        {t('Generate new colors')}
      </CromaButton>
      <View style={styles.separator} />
      <CromaButton
        style={styles.button}
        onPress={() => {
          navigation.navigate('SavePalette');
        }}>
        {t('SAVE AS NEW PALETTE')}
      </CromaButton>
    </View>
  );
}
function uniqueColors(colors) {
  let set = new Set();
  let uniqueColors = [];
  colors.forEach((color) => {
    if (!set.has(color.color)) {
      if (color.locked === undefined) {
        color.locked = true;
      }
      uniqueColors.push(color);
    }
    set.add(color.color);
  });
  return uniqueColors;
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
  hintText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
    marginHorizontal: 8
  },
  button: {
    marginLeft: 32,
    marginRight: 32
  }
});
