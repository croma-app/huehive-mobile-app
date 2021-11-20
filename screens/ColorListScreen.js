import React, { useLayoutEffect } from "react";
import { SingleColorView } from "../components/SingleColorView";
import {ScrollView, StyleSheet, View, Text, Platform, Button} from "react-native";
import CromaButton from "../components/CromaButton";
import { logEvent } from "../libs/Helpers";
import Touchable from "react-native-platform-touchable";
import MaterialIcons  from "react-native-vector-icons/MaterialIcons";
import { CromaContext } from "../store/store";

export default function ColorListScreen({ navigation }) {
  const { colorList } = React.useContext(CromaContext);
  const colors = uniqueColors(colorList);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle:
        Platform.OS === "android" || Platform.OS === 'ios'
          ? () => <CustomHeader navigation={navigation} />
          : "Colors"
    });
  }, []);

  logEvent("color_list_screen");
  return (
    <ScrollView style={styles.listview} showsVerticalScrollIndicator={false}>
      {colors.map(color => (
        <SingleColorView key={color.color} color={color} />
      ))}
      {Platform.OS == "web" && (
        <CromaButton
          onPress={() => {
            navigation.navigate("SavePalette");
          }}
        >
          SAVE AS NEW PALETTE
        </CromaButton>
      )}
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

const CustomHeader = ({ navigation }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%"
      }}
    >
      <Text
        style={{
          color: "#ffffff",
          fontSize: 18
        }}
      >
        New palette
      </Text>
      <>
        <Touchable style={[styles.doneButton]} onPress={() => navigation.navigate("SavePalette")}>
          <MaterialIcons name="done" size={24} color="white" />
        </Touchable>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  listview: {
    margin: 8
  },
  doneButton: {
    marginRight: "20%"
  }
});
