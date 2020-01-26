import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";

export default function AddPaletteManuallyScreen(props) {
  console.log(props, 'AddPaletteManuallyScreen ');
  return (
    <ScrollView>
      <SavePalette 
        title={'ADD PALETTE NAME'}
        navigationPath={'Palette'}
        navigation={props.navigation}
      />
    </ScrollView>
  );
}
