import React from "react";
import { Text, View } from "react-native";
import { ColorPicker, fromHsv } from "react-native-color-picker";
import CromaButton from "./CromaButton";

export class CromaColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: "#4cb96b" };
  }
  render() {
    return (
      <View>
        <ColorPicker
          onColorChange={color => this.setState({ color: fromHsv(color) })}
          style={{ height: 400 }}
        />
        <Text>{this.state.color}</Text>
        <CromaButton
          onPress={() =>
            this.props.navigation.navigate("ColorDetails", {
              color: this.state.color
            })
          }
        >
          SEE COLOR DETAILS
        </CromaButton>
      </View>
    );
  }
}
