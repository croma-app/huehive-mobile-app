import React, { useState } from "react";

import SingleColorCard from "../components/SingleColorCard";
import {
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform
} from "react-native";
import { UndoDialog, DialogContainer } from "../components/CommanDialogs";
import { Croma } from "../store/store";
import ActionButton from "react-native-action-button";
import Colors from "../constants/Colors";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";
export default function PaletteScreen(props) {
  const { height, width } = Dimensions.get("window");
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
      <View
        style={(styles.container, { minHeight: height - Header.HEIGHT - 16 })}
      >
        <ScrollView
          style={styles.listview}
          showsVerticalScrollIndicator={false}
        >
          {colors.map((colorObj, index) => {
            return (
              <SingleColorCard
                key={colorObj.color}
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
          <EmptyView />
        </ScrollView>
        <ActionButton
          bgColor="rgba(68, 68, 68, 0.6)"
          hideShadow={Platform.OS === "web" ? "true" : "false"}
          buttonColor={Colors.accent}
          onPress={() => {
            props.navigation.navigate("ColorPicker", {
              onDone: color => {
                addColorToPalette(paletteName, color);
              }
            });
          }}
        />
      </View>
      <DialogContainer>
        {deletedColors.map(colorObj => (
          <UndoDialog
            name={colorObj.color}
            undoDeletionByName={colorName => {
              undoColorDeletion(paletteName, colorName);
            }}
          />
        ))}
      </DialogContainer>
    </>
  );
}
PaletteScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("name")
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listview: {
    margin: 8
  }
});
