import React, { useState } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';

import Color from 'pigment/full';
import Colors from '../constants/Styles';

export const ColorDetailItems = ({ color, colorName }) => {
  const fullColor = new Color(color);
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const { t } = useTranslation();

  const formatHwb = () => {
    const hwb = fullColor.tohwb();
    const regex = /hwb\((\d+), ([\d.]+)%, ([\d.]+)%\)/;
    const [, hue, saturation, lightness] = regex.exec(hwb);

    const roundedSaturation = parseFloat(saturation).toFixed(2);
    const roundedLightness = parseFloat(lightness).toFixed(2);

    return `hwb(${hue}, ${roundedSaturation}%, ${roundedLightness}%)`;
  };

  const writeToClipboard = (value, index) => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      notifyMessage(t('Text copied to clipboard!'));
    }
    Clipboard.setString(value);
    setCopiedIndex(index);
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

  const debouncedSetCopiedIndex = debounce(() => setCopiedIndex(-1), 2000);

  const items = [
    { key: 'HEX', value: fullColor.tohex() },
    { key: 'RGB', value: fullColor.torgb() },
    { key: 'HSL', value: fullColor.tohsl() },
    { key: 'HSV', value: fullColor.tohsv() },
    { key: 'HWB', value: formatHwb() },
    { key: 'CMYK', value: fullColor.tocmyk() },
    { key: 'CIELAB', value: fullColor.tolab() },
    { key: 'Luminance', value: (fullColor.luminance() * 100).toFixed(2) + '%' },
    { key: 'Darkness', value: (fullColor.darkness() * 100).toFixed(2) + '%' },
    { key: 'NAME', value: colorName || '-' }
  ];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <TouchableOpacity key={item.key} onPress={() => writeToClipboard(item.value, index)}>
          <View style={[styles.info, copiedIndex === index && styles.copied]}>
            <Text style={styles.colorNameKey}>{item.key}: </Text>
            <Text style={styles.colorNameValue}>{item.value}</Text>
            <MaterialIcons style={styles.icon} name="content-copy" size={16} />
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
    <View style={styles.detailContainer}>
      <View style={backgroundColor}></View>
      <ColorDetailItems color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    paddingHorizontal: 10
  },
  info: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  copied: {
    backgroundColor: '#e0f7fa'
  },
  colorNameKey: {
    fontWeight: '500',
    fontSize: 18,
    color: '#333'
  },
  colorNameValue: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5
  },
  icon: {
    marginLeft: 'auto',
    color: '#888'
  },
  detailContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
});
