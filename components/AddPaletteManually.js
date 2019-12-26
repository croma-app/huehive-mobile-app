import React from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import * as Colors from "../constants/Colors";

export class AddPaletteManually extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.label}>ADD NEW PALETTE</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter a name for the palette"
            onChangeText={text => this.setState({ text })}
          />
        </View>
        <Button onPress={() => Alert.alert(this.state.text)} title="Save Palette">

        </Button>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 2,
    height: 80,
    margin: 10,
    padding: 10
  },
  label: {
    flex: 1,
    color: Colors.darkGrey
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  }
});

