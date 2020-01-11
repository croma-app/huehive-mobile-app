import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";

export default function SavePaletteScreen(props) {
  console.log(props);
  return (
    <ScrollView>
      <SavePalette navigation={props.navigation}></SavePalette>
    </ScrollView>
  );
}
