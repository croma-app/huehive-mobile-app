import * as React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { logEvent } from "../libs/Helpers";
import { PalettePreviewCard } from "../components/PalettePreviewCard";

export default function CommonPalettesScreen(props) {
  logEvent("common_palettes_screen");
  const palettes = props.navigation.getParam("input").palettes;
  console.log(
    "palettes",
    palettes,
    palettes.map(p => p.name)
  );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {palettes.map(palette => (
        <PalettePreviewCard
          onPress={() =>
            props.navigation.navigate("ColorList", { colors: palette.colors })
          }
          colors={palette.colors}
          name={palette.name}
        ></PalettePreviewCard>
      ))}
    </ScrollView>
  );
}
CommonPalettesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("input").name
  };
};
const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});
