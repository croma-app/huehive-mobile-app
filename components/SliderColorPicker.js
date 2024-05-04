import React from 'react';
import {
  SliderHuePicker,
  SliderSaturationPicker,
  SliderValuePicker
} from 'react-native-slider-color-picker';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import tinycolor from 'tinycolor2'; // TODO: change tinycolor to pigment
import { logEvent } from '../libs/Helpers';

const { width } = Dimensions.get('window');

export default function SliderColorPicker(props) {
  const [color, setColor] = React.useState(props.color);
  const hsv = tinycolor(color).toHsv();
  logEvent('slider_color_picker_component');
  const changeColor = (colorHsvOrRgb, resType) => {
    if (resType === 'end') {
      setColor(tinycolor(colorHsvOrRgb).toHexString());
      if (props.setColor) {
        // console.log('colorHsvOrRgb', tinycolor(colorHsvOrRgb).toHexString());
        props.setColor(tinycolor(colorHsvOrRgb).toHexString());
      }
    }
  };
  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          marginHorizontal: 24,
          marginTop: 20,
          height: 36,
          width: width - 48
        }}>
        <Text>Hue({hsv.h.toFixed(1)}) </Text>
        <SliderHuePicker
          oldColor={color}
          trackStyle={[{ height: 12, width: width - 48 }]}
          thumbStyle={styles.thumb}
          useNativeDriver={true}
          onColorChange={changeColor}
        />
      </View>
      <View style={{ marginHorizontal: 24, marginTop: 20, height: 36, width: width - 48 }}>
        <Text>Seturation({hsv.s.toFixed(2)})</Text>
        <SliderSaturationPicker
          oldColor={color}
          trackStyle={[{ height: 12, width: width - 48 }]}
          thumbStyle={styles.thumb}
          useNativeDriver={true}
          onColorChange={changeColor}
          style={{
            height: 12,
            borderRadius: 6,
            backgroundColor: tinycolor({
              h: tinycolor(color).toHsv().h,
              s: 1,
              v: 1
            }).toHexString()
          }}
        />
      </View>
      <View style={{ marginHorizontal: 24, marginTop: 20, height: 36, width: width - 48 }}>
        <Text>Brightness({hsv.v.toFixed(2)})</Text>
        <SliderValuePicker
          oldColor={color}
          minimumValue={0.02}
          step={0.05}
          trackStyle={[{ height: 12, width: width - 48 }]}
          trackImage={require('react-native-slider-color-picker/brightness_mask.png')}
          thumbStyle={styles.thumb}
          onColorChange={changeColor}
          style={{ height: 12, borderRadius: 6, backgroundColor: 'black' }}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  thumb: {
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.35
  }
});
