import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";

export default function AddPaletteManuallyScreen(props) {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SavePalette
        title={"ADD PALETTE NAME"}
        navigationPath={"Palette"}
        navigation={props.navigation}
      />
    </ScrollView>
  );
}
