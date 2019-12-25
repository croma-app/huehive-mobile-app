import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export class SingleColorView extends React.Component {
  render() {
    return (
      <View style={[styles.container, {backgroundColor: this.props.color}]}>
        <Text style={styles.colorText}>{this.props.color}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  colorText: {
    fontWeight: "700",
    backgroundColor: "#FFF",
    paddingLeft: 5,
    paddingRight: 5,

  }
});