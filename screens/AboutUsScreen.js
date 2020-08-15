import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import { logEvent } from "../libs/Helpers";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
export default function AboutUsScreen(props) {
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text>
          Croma is a open source app. Designed for awesome people like you to
          simplifying picking and saving colors. Our mission is to provide
          simplest palette manager app for you.
        </Text>
        <Text>Please help us in making the app awesome. </Text>
      </View>
      <MenuLink
        id={"feedback"}
        link={"https://github.com/croma-app/croma-react/issues/new"}
        icon={
          <MaterialCommunityIcons name="lightbulb-on" style={styles.icon} />
        }
      >
        Github - Feedback or suggestions?
      </MenuLink>
      <MenuLink
        id={"github-repo"}
        link={"https://github.com/croma-app/croma-react"}
        icon={<Entypo name="github" style={styles.icon} />}
      >
        Contribute on github 👨‍💻
      </MenuLink>
      <MenuLink
        id={"web-link"}
        link={"https://croma.app"}
        icon={<MaterialCommunityIcons name="web" style={styles.icon} />}
      >
        https://croma.app - Web version
      </MenuLink>
    </ScrollView>
  );
}
function MenuLink(props) {
  return (
    <Touchable
      style={[styles.menuItem]}
      onPress={() => {
        logEvent("about_us_screen_link_" + props.id);
        Linking.openURL(props.link);
      }}
    >
      <View style={styles.menuItemView}>
        <View style={styles.menuIcon}>{props.icon}</View>
        <Text style={styles.textAreaMenuItem}>{props.children}</Text>
      </View>
    </Touchable>
  );
}
AboutUsScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: "About us"
  };
};
const menuHeight = 50;
const padding = 10;
const styles = StyleSheet.create({
  container: {
    padding: 12,
    flex: 1,
    flexDirection: "column"
  },
  logo: {
    width: 48,
    height: 48,
    padding: padding
  },
  title: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: padding,
    color: "white"
  },
  menu: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  menuItem: {
    height: menuHeight
  },
  menuItemView: {
    flex: 1,
    flexDirection: "row"
  },
  textAreaMenuItem: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: padding,
    alignItems: "flex-start"
  },
  menuIcon: {},
  icon: {
    fontSize: menuHeight - 2 * padding,
    padding: padding,
    color: "black"
  }
});
