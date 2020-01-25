import React, { useState } from "react";
import SingleColorCard from "../components/SingleColorCard";
import { ScrollView, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";
import { UndoCard } from "../components/UndoCard";
import { Croma } from "../screens/store";

export default function PaletteScreen(props) {
  const paletteName = props.navigation.getParam("name");
  const {
    allPalettes,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette
  } = React.useContext(Croma);
  const colors = allPalettes[paletteName].colors;
  const deletedColors = allPalettes[paletteName].deletedColors
    ? allPalettes[paletteName].deletedColors
    : [];

  const deleteColor = index => {
    colorDeleteFromPalette(props.navigation.getParam("name"), index);
  };

  return (
    <>
      <ScrollView style={styles.listview}>
        {colors.map((colorObj, index) => {
          return (
            <SingleColorCard
              onPress={() =>
                props.navigation.navigate("ColorDetails", {
                  color: colorObj.color
                })
              }
              color={colorObj.color}
              colorDeleteFromPalette={() => {
                deleteColor(index);
              }}
            ></SingleColorCard>
          );
        })}
        <CromaButton
          onPress={() =>
            props.navigation.navigate("ColorPicker", {
              onDone: color => {
                addColorToPalette(paletteName, color);
              }
            })
          }
        >
          Add color
        </CromaButton>
      </ScrollView>
      {deletedColors.map(colorObj => (
        <UndoCard
          name={colorObj.color}
          undoDeletionByName={colorName => {
            undoColorDeletion(paletteName, colorName);
          }}
        />
      ))}
    </>
  );
}
PaletteScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("name")
  };
};

const styles = StyleSheet.create({
  listview: {
    margin: 8
  }
});
