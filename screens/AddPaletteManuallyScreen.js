import React from "react";
import {
  ScrollView
} from "react-native";
import { AddPaletteManually } from "../components/AddPaletteManually";

export default function AddPaletteManuallyScreen(props) {
  console.log(props)
  return (
      <ScrollView>
      <AddPaletteManually navigation={props.navigation}></AddPaletteManually>
    </ScrollView>
  );
}
