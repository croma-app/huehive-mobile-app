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
          style={[styles.menuItem]}
          onPress={() => {
            Linking.openURL("https://github.com/croma-app/croma-react");
          }}
        >
          <View style={styles.menuItemView}>
            <View style={styles.menuIcon}>
              <Entypo name="github" style={styles.icon} />
            </View>
            <Text style={styles.textAreaMenuItem}>View Source on github</Text>
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
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    alignSelf: "stretch"
  },
  menuItem: {
    height: 60
  },
  menuItemView: {
    flex: 1,
    flexDirection: "row"
  },
  textAreaMenuItem: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: 12,
    alignItems: "center"
  },
  menuIcon: {},
  icon: {
    fontSize: 36,
    padding: 12,
    color: "black"
  }
});
