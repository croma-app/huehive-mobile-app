import React from 'react';
import {StyleSheet, Text, View } from 'react-native';

export function ColorDetail(props) {
  const backgroundColor = {
    backgroundColor: props.color
  };
  const styles = StyleSheet.create({
    backgroundColor: {
      backgroundColor: props.color, height: 200, alignSelf: 'stretch'
    }
  });
  return (
    
  
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={[styles.backgroundColor]} ></View>
      <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text>

    </View>
  );
}
