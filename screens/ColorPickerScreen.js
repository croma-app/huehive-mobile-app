import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import CromaButton from '../components/CromaButton';
import { CromaColorPicker as ColorPicker } from 'croma-color-picker';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
import SliderColorPicker from '../components/SliderColorPicker';
import ColorPickerDropdown from '../components/ColorPickerDropdown';

export default function ColorPickerScreen({ navigation }) {
  const [color, setColor] = useState('#db0a5b');
  const [colorPicker, setColorPicker] = useState('basic'); // ['basic', 'HSB']
  const { colorPickerCallback } = useContext(CromaContext);

  logEvent('color_picker_screen');
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ColorPickerDropdown onChange={(value) => setColorPicker(value)} />
      <View style={styles.container}>
        {colorPicker === 'HSB' ? (
          <SliderColorPicker color={`${color}`} setColor={setColor} />
        ) : (
          <ColorPicker
            onChangeColor={(color) => {
              setColor(color);
            }}
            style={[{ height: 350 }]}
          />
        )}
        <CromaButton
          onPress={() => {
            navigation.goBack();
            colorPickerCallback({ color });
          }}>
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
