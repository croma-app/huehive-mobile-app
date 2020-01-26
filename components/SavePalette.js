import React from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import CromaButton from "../components/CromaButton";
import { Croma } from "../screens/store";

export const SavePalette = props => {
  console.log("props.natigation: ", props.navigation);
  const [paletteName, setPaletteName] = React.useState("");
  const { addPalette } = React.useContext(Croma);
  const { title, navigationPath } = props;
  return (
    <ScrollView>
      <View style={styles.card}>
        <Text style={styles.label}>{title}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter a name for the palette"
          onChangeText={name => setPaletteName(name)}
        />
      </View>
      <CromaButton
        onPress={async () => {
          const colors = [
            ...new Set(props.navigation.getParam("colors") || [])
          ];
          const palette = { name: paletteName, colors: colors };
          addPalette(palette);
          console.log("navigating to home");
          if (navigationPath === "Palette") {
            props.navigation.navigate(navigationPath, palette);
          } else {
            props.navigation.navigate(navigationPath);
          }
        }}
      >
        Save palette
      </CromaButton>
    </ScrollView>
  );
};

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
    padding: 10
  },
  label: {
    flex: 1,
    color: Colors.darkGrey,
    fontWeight: "700"
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1
  }
});
