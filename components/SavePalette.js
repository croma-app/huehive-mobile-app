import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import Storage from '../libs/Storage';
import CromaButton from '../components/CromaButton';
import { Croma } from "../App";

// constructor(props) {
//   super(props);
//   this.state = { paletteName: "", colors: this.props.navigation.getParam("colors") || [] };
// }

export const SavePalette = (props) => {
  console.log("props.natigation: ", props.navigation);
  const [paletteName, setPaletteName] = React.useState('')
  const { addPalette } = React.useContext(Croma)
  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.label}>ADD NEW PALETTE</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a name for the palette"
          onChangeText={name => setPaletteName(name)}
        />
      </View>
      <CromaButton onPress={async () => {
        const colors = props.navigation.getParam("colors") || []
        addPalette({name: paletteName, colors: colors})
        console.log("navigating to home");
        props.navigation.navigate("Home");
      }} >
        Save palette
        </CromaButton>
    </ScrollView >
  );
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
    height: 92,
    marginVertical: 10,
    padding: 10,
  },
  label: {
    flex: 1,
    color: Colors.darkGrey,
    fontWeight: "700",
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1,
  }
});

