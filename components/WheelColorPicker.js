import React from 'react';
import { ActivityIndicator } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';

function WheelColorPicker({ color, onColorChange }) {
  return (
    <ColorPicker
      style={[{ height: 300 }]}
      color={color}
      swatchesOnly={false}
      onColorChange={onColorChange}
      onColorChangeComplete={onColorChange}
      thumbSize={40}
      sliderSize={40}
      noSnap={true}
      row={false}
      swatchesLast={true}
      swatches={true}
      discrete={true}
      wheelLodingIndicator={<ActivityIndicator size={40} />}
      sliderLodingIndicator={<ActivityIndicator size={20} />}
      useNativeDriver={false}
      useNativeLayout={true}
    />
  );
}

export default WheelColorPicker;
