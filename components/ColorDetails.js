import React from 'react';
import { Text } from 'react-native';

export function ColorDetail(props) {
  return (
    <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text>
  );
}
