import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

export class SingleColorView extends React.Component {
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.color }]}>
        <Text style={styles.colorText}>{this.props.color}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    justifyContent: "center",
    alignItems: "center"
  },
  colorText: {
    fontWeight: "700",
    backgroundColor: "rgba(255, 255, 255, .3)",
    paddingLeft: 8,
    paddingRight: 8
  }
});
