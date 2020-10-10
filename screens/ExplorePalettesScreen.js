import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { logEvent } from "../libs/Helpers";
import Touchable from "react-native-platform-touchable";
const allPalettes = require("../constants/palettes/palettes").default;

export default function ExplorePalettesScreen(props) {
  logEvent("explore_palettes_screen");
  console.log("AllPalettes: ", JSON.stringify(allPalettes));
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {allPalettes.map(palettes => {
        return (
          <Touchable
            onPress={() => {
              logEvent("hm_matrial_palettes");
              props.navigation.navigate("CommonPalettes", palettes);
            }}
          >
            <Text>{palettes.name}</Text>
          </Touchable>
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});
