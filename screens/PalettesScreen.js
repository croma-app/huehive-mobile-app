import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import Color from "pigment/full";
import { PalettePreviewCard } from "../components/PalettePreviewCard";
export default function PalettesScreen(props) {
  // Convert camelCase to sentence
  const parseCamelCase = text => {
    if (typeof text !== "string") {
      return "";
    }
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
      .replace(/^./, str => str.toUpperCase());
  };
  const color = new Color(props.navigation.getParam("color"));
  let items = [];
  for (const i in color) {
    if (/.*scheme$/i.test(i) && typeof color[i] === "function") {
      let colors = [];
      const paletteColors = color[i]();
      paletteColors.forEach(c => colors.push({ color: c.tohex() }));
      items.push(
        <PalettePreviewCard
          onPress={() =>
            props.navigation.navigate("ColorList", { colors: colors })
          }
          key={i.toString()}
          colors={colors}
          name={parseCamelCase(i.toString())}
        ></PalettePreviewCard>
      );
    }
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {items}
    </ScrollView>
  );
}

PalettesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("color")
  };
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});
