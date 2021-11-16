import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";
import { logEvent } from "../libs/Helpers";

export default function AddPaletteManuallyScreen(props) {
  logEvent("add_palette_manually_screen");
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
