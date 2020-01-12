import React from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";
import { CromaColorPicker as ColorPicker } from "croma-color-picker";
export default function ColorPickerScreen(props) {
  return (
    <ScrollView>
      <CromaColorPicker navigation={props.navigation}></CromaColorPicker>
    </ScrollView>
  );
}

class CromaColorPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: "#db0a5b" };
  }
  render() {
    return (
      <View style={styles.container}>
        <ColorPicker
          onChangeColor={color => {
            console.log("oncolorchange called", color);
            this.setState({ color: color });
          }}
          style={[{ height: 300, verticalMargin: 8, flex: 1 }]}
        />
        <CromaButton
          onPress={() =>
            this.props.navigation.goBack({
              color: this.state.color
            })
          }
        >
          Done
        </CromaButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    margin: 8
  }
});
