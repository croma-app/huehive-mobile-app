import * as React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { logEvent } from "../libs/Helpers";
import Touchable from "react-native-platform-touchable";
import { material } from "react-native-typography";
const allPalettes = require("../constants/palettes/palettes").default;

export default function PaletteLibraryScreen(props) {
  logEvent("palette_library_screen");
  console.log("AllPalettes: ", JSON.stringify(allPalettes));
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {allPalettes.map(palettes => {
        return (
          <Touchable
            onPress={() => {
              logEvent("hm_matrial_palettes");
              props.navigation.navigate("CommonPalettes", { input: palettes });
            }}
          >
            <View>
              <View>
                <Text style={styles.title}>{palettes.name}</Text>
              </View>
              <View>
                <Text style={styles.desc}>{palettes.desc}</Text>
              </View>
            </View>
          </Touchable>
        );
      })}
    </ScrollView>
  );
}
PaletteLibraryScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Palette library"
  };
};
const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    ...material.title
  },
  desc: {
    ...material.body1
  }
});
