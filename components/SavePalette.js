import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { PalettePreviewCard } from "../components/PalettePreviewCard";
import Colors from "../constants/Colors";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import { TextDialog } from "./CommanDialogs";

export const SavePalette = props => {
  const [paletteName, setPaletteName] = useState(
    props.navigation.getParam("name") ? props.navigation.getParam("name") : ""
  );
  const [finalColors, setFinalColors] = useState([]);
  const [isUnlockProNotification, setIsUnlockProNotifiction] = useState(false);
  const [isPaletteNameExist, setIsPaletteNameExist] = React.useState(false);
  const { addPalette, allPalettes, isPro } = React.useContext(CromaContext);

  useEffect(() => {
    let colorsFromParams = props.navigation.getParam("colors");
    if (typeof colorsFromParams === "string") {
      colorsFromParams = JSON.parse(colorsFromParams);
    }
    const colors = [...new Set(colorsFromParams || [])];
    setIsUnlockProNotifiction(!isPro && colors.length > 4);
    setFinalColors(colors);
    setTimeout(() => {
      setIsUnlockProNotifiction(false);
    }, 5000);
  }, []);

  const { title, navigationPath } = props;
  return (
    <ScrollView style={{ margin: 8 }} showsVerticalScrollIndicator={false}>
      <PalettePreviewCard
        colors={finalColors.slice(0, isPro ? finalColors.length : 4)}
        name={paletteName}
      />
      <View style={styles.card}>
        <Text style={[styles.label, styles.title]}>{title}</Text>
        <TextInput
          style={styles.input}
          value={paletteName}
          placeholder="Enter a name for the palette"
          onChangeText={name => setPaletteName(name)}
        />
      </View>
      <CromaButton
        onPress={async () => {
          if (allPalettes[paletteName]) {
            setIsPaletteNameExist(true);
            setTimeout(() => {
              setIsPaletteNameExist(false);
            }, 3000);
            return null;
          }
          const palette = { name: paletteName, colors: finalColors };
          addPalette(palette);
          if (navigationPath === "Palette") {
            props.navigation.replace(navigationPath, palette);
          } else {
            props.navigation.navigate(navigationPath);
          }
        }}
      >
        Save palette
      </CromaButton>
      {isPaletteNameExist && (
        <TextDialog text={"A palette with same name already exists."} />
      )}
      {isUnlockProNotification && (
        <TextDialog text={"Unlock pro to save more than 4 colors!"} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 2,
    height: 92,
    marginVertical: 10,
    padding: 10
  },
  title: {
    fontWeight: "700"
  },
  input: {
    flex: 1,
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 54
  },
  label: {
    flex: 1,
    color: Colors.darkGrey
  }
});
