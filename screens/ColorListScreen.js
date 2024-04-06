import React, { useLayoutEffect } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import { StyleSheet, View, Text, Platform } from 'react-native';
import CromaButton from '../components/CromaButton';
import { logEvent, notifyMessage } from '../libs/Helpers';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function ColorListScreen({ navigation }) {
  const { t } = useTranslation();

  const { colorList, setColorList } = React.useContext(CromaContext);
  const colors = uniqueColors(colorList);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? () => <CustomHeader navigation={navigation} />
          : t('Colors')
    });
  }, []);
  const renderItem = ({ item, drag }) => (
    <SingleColorView
      onColorChange={(updatedColor) => {
        const index = colors.findIndex((color) => color.color === updatedColor.color);
        const updatedColors = [...colors];
        updatedColors[index] = updatedColor;
        setColorList(updatedColors);
      }}
      key={item.color + '-' + item.locked}
      color={item}
      drag={drag}
    />
  );

  const onDragEnd = ({ data }) => {
    setColorList(data);
  };
  const regenerateUnlockedColors = () => {
    if (colors.filter((color) => !color.locked).length == 0) {
      notifyMessage(t('Please unlock at least one color'));
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
      <DraggableFlatList
        data={colors}
        renderItem={renderItem}
        keyExtractor={(item) => item.color + '-' + item.locked}
        onDragEnd={onDragEnd}
      />
      <CromaButton
        onPress={() => {
          regenerateUnlockedColors();
        }}>
        {t('Generate')}
      </CromaButton>
      <CromaButton
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
    margin: 8
  },
  doneButton: {
    marginRight: '20%'
  }
});
