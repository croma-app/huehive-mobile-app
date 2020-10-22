import React from "react";
import { SingleColorView } from "../components/SingleColorView";
import { ScrollView, StyleSheet, View, Text, Platform } from "react-native";
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
        <SingleColorView key={color.color} color={color} />
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
  const colors = uniqueColors(props.navigation.getParam("colors"));
  const suggestedName = props.navigation.getParam("suggestedName");
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%"
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 18
        }}
      >
        Colors
      </Text>
      <>
        <Touchable
          onPress={() =>
            props.navigation.navigate("SavePalette", {
              colors: colors,
              name: suggestedName
            })
          }
        >
          <MaterialIcons name="done" size={24} color="white" />
        </Touchable>
      </>
    </View>
  );
};
ColorListScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle:
      Platform.OS == "android" ? (
        <CustomHeader navigation={navigation}></CustomHeader>
      ) : (
        "Colors"
      )
  };
};
const styles = StyleSheet.create({
  listview: {
    margin: 8
  }
});
