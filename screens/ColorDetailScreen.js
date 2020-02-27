import React from "react";
import { ScrollView, StyleSheet, Button } from "react-native";
import { ColorDetail } from "../components/ColorDetails";
import CromaButton from "../components/CromaButton";

export default function ColorDetailScreen(props) {
  const color = props.navigation.getParam("color");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ColorDetail navigation={props.navigation} color={color}>
        {color}
      </ColorDetail>
      <CromaButton
        onPress={() => props.navigation.navigate("Palettes", { color: color })}
      >
        See color palettes
      </CromaButton>
    </ScrollView>
  );
}

ColorDetailScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("color")
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12
  }
});
