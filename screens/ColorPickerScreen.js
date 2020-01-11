import React from "react";
import { CromaColorPicker } from "../components/CromaColorPicker";
import { ScrollView } from "react-native";

export default function ColorPickerScreen(props) {
  return (
    <ScrollView>
      <CromaColorPicker navigation={props.navigation}></CromaColorPicker>
    </ScrollView>
  );
}
