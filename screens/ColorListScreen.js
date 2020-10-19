import React from "react";
import { SingleColorView } from "../components/SingleColorView";
import { ScrollView, StyleSheet, View } from "react-native";
import CromaButton from "../components/CromaButton";
import { logEvent } from "../libs/Helpers";
import Touchable from "react-native-platform-touchable";
import { MaterialIcons } from "@expo/vector-icons";

export default function ColorListScreen(props) {
  const colors = uniqueColors(props.navigation.getParam("colors"));
  const suggestedName = props.navigation.getParam("suggestedName");
  logEvent("color_list_screen");
  return (
    <ScrollView style={styles.listview} showsVerticalScrollIndicator={false}>
      {colors.map(color => (
        <SingleColorView key={color.color} color={color.color} />
      ))}
      <CromaButton
        onPress={() =>
          props.navigation.navigate("SavePalette", {
            colors: colors,
            name: suggestedName
          })
        }
      >
        SAVE AS NEW PALETTE
      </CromaButton>
    </ScrollView>
  );
}
function uniqueColors(colors) {
  let set = new Set();
  let uniqueColors = [];
  colors.forEach(color => {
    if (!set.has(color.color)) {
      uniqueColors.push(color);
    }
    set.add(color.color);
  });
  return uniqueColors;
}

const CustomHeader = props => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%"
      }}
    >
      {
        <>
          <Touchable onPress={{}} style={{ marginTop: 12 }}>
            <MaterialIcons name="done" size={24} color="white" />
          </Touchable>
        </>
      }
    </View>
  );
};
ColorListScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: <CustomHeader navigation={navigation}></CustomHeader>
  };
};
const styles = StyleSheet.create({
  listview: {
    margin: 8
  }
});
