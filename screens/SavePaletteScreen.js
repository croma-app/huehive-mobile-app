import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";

export default function SavePaletteScreen(props) {
  console.log(props, "SavePaletteScreen ");
  return (
    <ScrollView>
      <SavePalette
        title={"ADD NEW PALETTE"}
        navigationPath={"Home"}
        navigation={props.navigation}
      />
    </ScrollView>
  );
}
