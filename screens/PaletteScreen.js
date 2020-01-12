import React, {useState} from "react";
import SingleColorCard from "../components/SingleColorCard";
import { ScrollView, StyleSheet } from "react-native";
import CromaButton from "../components/CromaButton";

export default function PaletteScreen(props) {
  const [colors, setColors] = useState(props.navigation.getParam("colors"));
  return (
    <ScrollView style={styles.listview}>
      {colors.map(colorObj => (
        <SingleColorCard
          onPress={() =>
            props.navigation.navigate("ColorDetails", { color: colorObj.color })
          }
          color={colorObj.color}
        ></SingleColorCard>
      ))}
      <CromaButton onPress={() => props.navigation.navigate("ColorPicker", {onDone: (color) => {
        let newColors = [...colors, color];
        console.log("color:", color, "nc", newColors);
        palette = {
          name: this.params.navigation.getParam("name"),
          colors: newColors,
        }

        setColors(newColors);

      }})}>Add color</CromaButton>
    </ScrollView>
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
