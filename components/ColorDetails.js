import React from 'react';
import {StyleSheet, Text, View, Button,TouchableNativeFeedback } from 'react-native';
import Color from 'pigment/full';

export function ColorDetail(props) {
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
      padding: 16,
    },
  });
  const color = new Color(props.color);
  let items = 
    [
      { key: 'HEX', value: props.color },
      { key: 'RGB', value: color.torgb() },
      { key: 'HSL', value: color.tohsl() },
      { key: 'HSV', value: color.tohsv() },
      { key: 'HWB', value: color.tohwb() },
      { key: 'CMYK', value: color.tocmyk() },
      { key: 'CIELAB', value: color.tolab() },
      { key: 'Luminance', value: (color.luminance() * 100).toFixed(2) + '%' },
      { key: 'Darkness', value: (color.darkness() * 100).toFixed(2) + '%' },
    ];
  this._copyToClipboard = function(value) {
    
  }
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={[styles.backgroundColor]} ></View>
      {/* <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text> */}
      <View >
        {items.map(item => (
          <TouchableNativeFeedback
           key={item.key}
           onPress={() => this._copyToClipboard(item.value)}
          >  
            <View style={styles.info}>
              
              <Text>{item.key}</Text>
              <Text>:</Text
              ><Text>{item.value}</Text>
              <Button
                onPress={this.writeToClipboard}
                title="Read from Clipboard"
              />
              
            </View>
          </TouchableNativeFeedback>
        ))}
        
      </View>
    </View>
  );
}
