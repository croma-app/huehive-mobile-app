import React, { useState } from "react";
import SingleColorCard from "../components/SingleColorCard";
import { ScrollView, StyleSheet, View, Dimensions } from "react-native";
import { UndoCard } from "../components/UndoCard";
import { Croma } from "../screens/store";
import { FloatingAction } from "react-native-floating-action";
import Colors from "../constants/Colors";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";
const actions = [
  {
    text: "Add color",
    icon: require("../assets/images/add.png"),
    name: "add_color",
    position: 1
  }
];
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
          <EmptyView />
        </ScrollView>
        <FloatingAction
          actions={actions}
          overrideWithAction={true}
          color={Colors.accent}
          onPressItem={() =>
            props.navigation.navigate("ColorPicker", {
              onDone: color => {
                addColorToPalette(paletteName, color);
              }
            })
          }
        />
      </View>
      <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        {deletedColors.map(colorObj => (
          <UndoCard
            name={colorObj.color}
            undoDeletionByName={colorName => {
              undoColorDeletion(paletteName, colorName);
            }}
          />
        ))}
      </View>
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
