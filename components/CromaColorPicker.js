import React from 'react';
import {Text, View} from 'react-native';
import { ColorPicker, fromHsv} from 'react-native-color-picker';
import Color from 'pigment/full';

export class CromaColorPicker extends React.Component {
  constructor(props) { 
        super(props); 
        this.state = { color : '#4cb96b' }; 
  } 
  render() {
    return (
    <View>
      <ColorPicker 
      onColorChange={color => this.setState({color: fromHsv(color)})}
      onColorSelected={color => {
       // Color.parse(`hsv(${color.h, color.s. color.v})`)
        alert(`Color selected: ${color}`)} 
      }
      style={{height: 400}}/>
      <Text>{this.state.color}</Text>
    </View>
    );

  }
}