import React from "react";
import {
  Text,
  View,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight
} from "react-native";

export class PaletteList extends React.Component {
  render() {
    return (
      <View style={styles.inputsContainer}>
        <TouchableHighlight
          style={styles.fullWidthButton}
          onPress={() => this.props.navigation.navigate("AddPalette")}
        >
          <Text style={styles.fullWidthButtonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputsContainer: {
    flex: 1,
    justifyContent: "center"
  },
  fullWidthButton: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  fullWidthButtonText: {
    fontSize: 24
  }
});
