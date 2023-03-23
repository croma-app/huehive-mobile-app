import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import CromaButton from '../components/CromaButton';
import { CromaColorPicker as ColorPicker } from 'croma-color-picker';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
export default function ColorPickerScreen({ navigation }) {
  const [color, setColor] = useState('#db0a5b');
  const { colorPickerCallback } = useContext(CromaContext);

  logEvent('color_picker_screen');
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <ColorPicker
          onChangeColor={(color) => {
            setColor(color);
          }}
          style={[{ height: 350 }]}
        />
        <CromaButton
          onPress={() => {
            navigation.goBack();
            colorPickerCallback({ color });
          }}
        >
          Done
        </CromaButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 8
  }
});
