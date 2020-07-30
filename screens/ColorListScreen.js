import React from "react";
import { SingleColorView } from "../components/SingleColorView";
import { ScrollView, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";
import { logEvent } from "../libs/Helpers";

export default function ColorListScreen(props) {
  const colors = uniqueColors(props.navigation.getParam("colors"));
  logEvent("color_list_screen");
  return (
    <ScrollView style={styles.listview} showsVerticalScrollIndicator={false}>
      {colors.map(color => (
        <SingleColorView key={color.color} color={color.color} />
      ))}
      <CromaButton
        onPress={() =>
          props.navigation.navigate("SavePalette", { colors: colors })
        }
      >
        SAVE AS NEW PALETTE
      </CromaButton>
    </ScrollView>
  );
}
function uniqueColors(colors) {
  let set = new Set();
  let uniqueColors = [];
  colors.forEach(color => {
    if (!set.has(color.color)) {
      uniqueColors.push(color);
    }
    set.add(color.color);
  });
  return uniqueColors;
}

ColorListScreen.navigationOptions = {
  title: "Colors"
};

const styles = StyleSheet.create({
  listview: {
    margin: 8
  }
});
