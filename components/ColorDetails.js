import React from 'react';
import {StyleSheet, Text, View, Clipboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'
import Touchable from 'react-native-platform-touchable';

import Color from 'pigment/full';

export function ColorDetail(props) {
  const styles = StyleSheet.create({
    backgroundColor: {
      backgroundColor: props.color, height: 112, alignSelf: 'stretch'
    },
    info: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
    },
    colorNameText: {
      fontSize: 16,
      fontWeight: "500",
    },
  });
  const color = new Color(props.color);
  let items = 
    [
      { key: 'HEX', value: color.tohex() },
      { key: 'RGB', value: color.torgb() },
      { key: 'HSL', value: color.tohsl() },
      { key: 'HSV', value: color.tohsv() },
      { key: 'HWB', value: color.tohwb() },
      { key: 'CMYK', value: color.tocmyk() },
      { key: 'CIELAB', value: color.tolab() },
      { key: 'Luminance', value: (color.luminance() * 100).toFixed(2) + '%' },
      { key: 'Darkness', value: (color.darkness() * 100).toFixed(2) + '%' },
    ];
  let writeToClipboard = function(value) {
    Clipboard.setString(value);
  }
  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 8, backgroundColor: "#fff"}}>
      <View style={[styles.backgroundColor]} ></View>
      {/* <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text> */}
      <View >
        {items.map(item => (
          <Touchable
           key={item.key}
           onPress={() => writeToClipboard(item.value)}
          >  
            <View style={styles.info}>
              <Text style={styles.colorNameText}>{item.key} : </Text>
              
              <Text >{item.value}</Text>
              <FontAwesomeIcon icon={ faCopy } />
            </View>
          </Touchable>
        ))}
        
      </View>
    </View>
  );
}
