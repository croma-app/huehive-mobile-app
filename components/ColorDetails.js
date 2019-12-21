import React from 'react';
import {StyleSheet, Text, View, Button,TouchableNativeFeedback,Clipboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCopy } from '@fortawesome/free-regular-svg-icons'

import Color from 'pigment/full';

export function ColorDetail(props) {
  let state = {copied: false}
  const backgroundColor = {
    backgroundColor: props.color
  };
  const styles = StyleSheet.create({
    backgroundColor: {
      backgroundColor: props.color, height: 200, alignSelf: 'stretch'
    },
    info: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 4,
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
    state.copied = true;
  }
  return (
    <View style={{flex: 1, flexDirection: 'column', padding: 8}}>
      <View style={[styles.backgroundColor]} ></View>
      {/* <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text> */}
      <View >
        {items.map(item => (
          <TouchableNativeFeedback
           key={item.key}
           onPress={() => writeToClipboard(item.value)}
          >  
            <View style={styles.info}>
              <Text>{item.key}</Text>
              <Text>:</Text>
              <Text>{item.value}</Text>
              <FontAwesomeIcon icon={ faCopy } />
            </View>
          </TouchableNativeFeedback>
        ))}
        
      </View>
    </View>
  );
}
