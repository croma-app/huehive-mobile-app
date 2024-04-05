import React, { useLayoutEffect } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import { StyleSheet, View, Text, Platform } from 'react-native';
import CromaButton from '../components/CromaButton';
import { logEvent } from '../libs/Helpers';
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
  const renderItem = ({ item, index, drag, isActive }) => (
    <SingleColorView key={item.color} color={item} drag={drag} />
  );

  const onDragEnd = ({ data }) => {
    setColorList(data);
  };

  logEvent('color_list_screen');
  return (
    <View style={styles.container}>
      <DraggableFlatList
        data={colors}
        renderItem={renderItem}
        keyExtractor={(item) => item.color}
        onDragEnd={onDragEnd}
      />
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
