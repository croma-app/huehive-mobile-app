import React, { useLayoutEffect } from 'react';
import { SingleColorView } from '../components/SingleColorView';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Platform,
  Button,
  TouchableOpacity
} from 'react-native';
import CromaButton from '../components/CromaButton';
import { logEvent } from '../libs/Helpers';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { CromaContext } from '../store/store';
import { useTranslation } from 'react-i18next';

export default function ColorListScreen({ navigation }) {
  const { t } = useTranslation();

  const { colorList } = React.useContext(CromaContext);
  const colors = uniqueColors(colorList);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? () => <CustomHeader navigation={navigation} />
          : t('Colors')
    });
  }, []);

  logEvent('color_list_screen');
  return (
    <ScrollView style={styles.listview} showsVerticalScrollIndicator={false}>
      {colors.map((color) => (
        <SingleColorView key={color.color} color={color} />
      ))}
      {Platform.OS == 'web' && (
        <CromaButton
          onPress={() => {
            navigation.navigate('SavePalette');
          }}
        >
          {t('SAVE AS NEW PALETTE')}
        </CromaButton>
      )}
    </ScrollView>
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

const CustomHeader = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
      }}
    >
      <Text
        style={{
          color: '#ffffff',
          fontSize: 18
        }}
      >
        {t('New palette')}
      </Text>
      <>
        <TouchableOpacity
          style={[styles.doneButton]}
          onPress={() => navigation.navigate('SavePalette')}
        >
          <MaterialIcons name="done" size={24} color="white" />
        </TouchableOpacity>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  listview: {
    margin: 8
  },
  doneButton: {
    marginRight: '20%'
  }
});
