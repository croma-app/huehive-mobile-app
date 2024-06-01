import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';

import Color from 'pigment/full';
import Colors from '../constants/Styles';

export const ColorDetailItems = function ({ color, colorName }) {
  const fullColor = new Color(color);
  const [copyiedIndex, setCopyiedIntex] = useState(-1);
  const { t } = useTranslation();

  const formatedHwb = () => {
    const hwb = fullColor.tohwb(); // Call the original function

    // Extract the individual values from the returned string
    const regex = /hwb\((\d+), ([\d.]+)%, ([\d.]+)%\)/;
    const [, hue, saturation, lightness] = regex.exec(hwb);

    // Round off the percentage values
    const roundedSaturation = parseFloat(saturation);
    const roundedLightness = parseFloat(lightness);

    const roundedSaturationStr =
      roundedSaturation % 1 !== 0 ? roundedSaturation.toFixed(2) : roundedSaturation.toFixed(0);
    const roundedLightnessStr =
      roundedLightness % 1 !== 0 ? roundedLightness.toFixed(2) : roundedLightness.toFixed(0);

    // Construct the modified HWB color string with rounded percentage values
    const modifiedHwb = `hwb(${hue}, ${roundedSaturationStr}%, ${roundedLightnessStr}%)`;
    return modifiedHwb;
  };
  let writeToClipboard = function (value, index) {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      notifyMessage(t('Text copied to clipboard!'));
    }
    Clipboard.setString(value);
    setCopyiedIntex(index);
    debouncedSetCopiedIndex();
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const debouncedSetCopiedIndex = debounce(() => setCopyiedIntex(-1), 2000);
  let items = [
    { key: 'HEX', value: fullColor.tohex() },
    { key: 'RGB', value: fullColor.torgb() },
    { key: 'HSL', value: fullColor.tohsl() },
    { key: 'HSV', value: fullColor.tohsv() },
    { key: 'HWB', value: formatedHwb() },
    { key: 'CMYK', value: fullColor.tocmyk() },
    { key: 'CIELAB', value: fullColor.tolab() },
    { key: 'Luminance', value: (fullColor.luminance() * 100).toFixed(2) + '%' },
    { key: 'Darkness', value: (fullColor.darkness() * 100).toFixed(2) + '%' },
    { key: 'NAME', value: colorName || '-' }
  ];

  return (
    <View style={{ marginTop: 20 }}>
      {items.map((item, index) => (
        <TouchableOpacity key={item.key} onPress={() => writeToClipboard(item.value, index)}>
          <View style={styles.info}>
            <Text style={styles.colorNameKey}>{item.key} : </Text>

            <Text style={styles.colorNameValue}>{item.value}</Text>
            {index === copyiedIndex && Platform.OS === 'web' && (
              <Text
                style={{
                  position: 'absolute',
                  backgroundColor: 'rgb(64, 64, 58)',
                  top: '-25px',
                  right: '-10px',
                  color: Colors.white,
                  padding: '5px',
                  textAlign: 'center',
                  borderRadius: '6px'
                }}>
                Copied!
              </Text>
            )}
            <MaterialIcons style={{ marginLeft: 'auto' }} name="content-copy" size={16} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export const ColorDetail = ({ color }) => {
  const backgroundColor = {
    backgroundColor: color,
    height: 112,
    alignSelf: 'stretch',
    borderRadius: 8
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 8,
        backgroundColor: Colors.white,
        borderRadius: 8,
        marginTop: 12
      }}>
      <View style={backgroundColor}></View>
      <ColorDetailItems color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center'
  },
  colorNameKey: {
    fontWeight: '400'
  },
  colorNameValue: {
    fontSize: 18
  }
});
