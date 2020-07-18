import React from "react";
import { Header } from "react-navigation";
import { Text, View, StyleSheet, Image, Linking } from "react-native";
import Colors from "../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
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
      <View style={styles.menu}>
        <Touchable
          onPress={() => {
            Linking.openURL("https://github.com/croma-app/croma-react");
          }}
        >
          <View style={[styles.github, styles.menuItem]}>
            <View style={styles.menuIcon}>
              <Entypo name="github" style={styles.icon} />
            </View>
            <Text style={styles.githubText}>View Source on github</Text>
          </View>
        </Touchable>
      </View>
      <View></View>
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
  },
  menu: {
    flex: 1,
    flexDirection: "column"
  },
  github: {},
  menuItem: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    alignItems: "center"
  },
  githubText: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: 12
  },
  menuIcon: {
    borderColor: "#cccccc",
    borderRightWidth: 1
  },
  icon: {
    fontSize: 25,
    padding: 12,
    color: "black"
  }
});
