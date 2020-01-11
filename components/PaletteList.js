import React from "react";
import { View, StyleSheet } from "react-native";
import CromaButton from "./CromaButton";

export class PaletteList extends React.Component {
  render() {
    return (
      <View style={styles.inputsContainer}>
        <CromaButton
          onPress={() => this.props.navigation.navigate("AddPalette")}
        >
          Add new palette
        </CromaButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputsContainer: {
    flex: 1,
    justifyContent: "center"
  }
});
