import React from "react";
import { Header } from "react-navigation";
import { Text, View, StyleSheet, Image } from "react-native";
import Colors from "../constants/Colors";
export default function HamburgerMenu(props) {
  return (
    <View style={[styles.container]}>
      <View style={[styles.titleArea]}>
        <Image
          style={styles.logo}
          source={require("../assets/images/dots.png")}
        />
        <Text style={styles.title}>Croma - Save you colors</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  titleArea: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    height: Header.HEIGHT
  },
  logo: {
    width: 48,
    height: 48,
    padding: 12
  },
  title: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: 12,
    color: "white"
  }
});
