import React, { useState, useEffect } from "react";
import { Header } from "react-navigation";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Linking,
  NativeModules
} from "react-native";
import Colors from "../constants/Colors";
import {
  Entypo,
  MaterialIcons,
  MaterialCommunityIcons,
  Foundation
} from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { logEvent } from "../libs/Helpers";
import { ScrollView } from "react-native-gesture-handler";
export default function HamburgerMenu(props) {
  const [appInstallTime, setAppInstallTime] = useState(null);
  useEffect(() => {
    (async () => {
      const appInstallTime = await NativeModules.CromaModule.getAppInstallTime();
      setAppInstallTime(parseInt(appInstallTime, 10));
    })();
  });
  return (
    <View style={[styles.container]}>
      <View style={[styles.titleArea]}>
        <Image
          style={styles.logo}
          source={require("../assets/images/dots.png")}
        />
        <Text style={styles.title}>Croma - Save you colors</Text>
      </View>
      <ScrollView>
        <View style={styles.menu}>
          <Touchable
            style={[styles.menuItem]}
            onPress={() => {
              NativeModules.CromaModule.navigateToColorPicker(pickedColors => {
                logEvent("pick_text_colors_from_camera", pickedColors.length);
                props.navigation.navigate(
                  "ColorList",
                  JSON.parse(pickedColors)
                );
              });
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <Foundation name="text-color" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>
                Read hex codes using camera
              </Text>
            </View>
          </Touchable>
          <MenuLink
            id={"feedback"}
            link={"https://github.com/croma-app/croma-react/issues/new"}
            icon={
              <MaterialCommunityIcons name="lightbulb-on" style={styles.icon} />
            }
          >
            Feedback or suggestions?
          </MenuLink>
          <MenuLink
            id={"github-repo"}
            link={"https://github.com/croma-app/croma-react"}
            icon={<Entypo name="github" style={styles.icon} />}
          >
            View Source on Github
          </MenuLink>
          {hasRateUsPeriodExpired(appInstallTime) && (
            <MenuLink
              id={"rate-us"}
              link={"market://details?id=app.croma"}
              icon={<MaterialIcons name="rate-review" style={styles.icon} />}
            >
              Like the App? Rate us
            </MenuLink>
          )}
          <MenuLink
            id={"web-link"}
            link={"https://croma.app"}
            icon={<MaterialCommunityIcons name="web" style={styles.icon} />}
          >
            https://croma.app
          </MenuLink>
        </View>
      </ScrollView>
    </View>
  );

  function hasRateUsPeriodExpired(appInstallTime) {
    if (appInstallTime == null) return false;
    return appInstallTime + tenDaysDurationMillis() < new Date().getTime();
  }
  function tenDaysDurationMillis() {
    return 10 * 24 * 60 * 60 * 1000;
  }
}

function MenuLink(props) {
  return (
    <Touchable
      style={[styles.menuItem]}
      onPress={() => {
        logEvent("hamburger_menu_link_" + props.id);
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
const menuHeight = 55;
const padding = 10;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  titleArea: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    padding: padding,
    height: Header.HEIGHT
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
    justifyContent: "flex-start",
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
    alignItems: "center"
  },
  menuIcon: {},
  icon: {
    fontSize: menuHeight - 2 * padding,
    padding: padding,
    color: "black"
  }
});
