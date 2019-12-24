import React from 'react';
import {Text, View, Button} from 'react-native';
import { ColorPicker, fromHsv} from 'react-native-color-picker';

export class CromaColorPicker extends React.Component {
  constructor(props) { 
        super(props); 
        this.state = { color : '#4cb96b' };
  } 
  render() {
    console.log("props: " + this.props);
    const navigate = this.props.navigation;
    console.log("navigate: " + navigate);
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
      <Button
        title="See Color details"
        onPress={() =>  this.props.navigation.navigate("ColorDetails", {"color": this.state.color})}
      />  
    </View>
    );

  }
}