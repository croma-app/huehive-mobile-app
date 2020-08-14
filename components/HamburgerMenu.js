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
  FontAwesome5,
  Ionicons
} from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { logEvent } from "../libs/Helpers";
import { ScrollView } from "react-native-gesture-handler";
import { navigationObject } from "../store/store";
import * as ImagePicker from "expo-image-picker";
import { Octokit } from "@octokit/rest";
import { authorize } from "react-native-app-auth";
export default function HamburgerMenu(props) {
  const pickImageResult = async base64 => {
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: base64
    });
  };
  const { setMenu } = props;
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
            style={styles.menuItem}
            onPress={() => {
              logEvent("hm_create_new_palette");
              setMenu(false);
              navigationObject.navigation.navigate("AddPaletteManually");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <Ionicons name="md-color-filter" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>Create new palette</Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              const imageResult = await pickImageResult();
              NativeModules.CromaModule.navigateToImageColorPicker(
                imageResult.uri,
                pickedColors => {
                  setMenu(false);
                  logEvent("hm_pick_colors_from_img", {
                    length: pickedColors.length
                  });
                  navigationObject.navigation.navigate(
                    "ColorList",
                    JSON.parse(pickedColors)
                  );
                }
              );
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="image" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>
                Pick colors from an image
              </Text>
            </View>
          </Touchable>
          <Touchable
            style={styles.menuItem}
            onPress={() => {
              NativeModules.CromaModule.navigateToColorPicker(pickedColors => {
                logEvent("hm_pick_text_colors_from_camera", {
                  length: pickedColors.length
                });
                setMenu(false);
                navigationObject.navigation.navigate(
                  "ColorList",
                  JSON.parse(pickedColors)
                );
              });
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons
                  name="credit-card-scan"
                  style={styles.icon}
                />
              </View>
              <Text style={styles.textAreaMenuItem}>Scan color codes</Text>
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
            Contribute 👨‍💻
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
          <Touchable
            style={styles.menuItem}
            onPress={() => {
              logEvent("hm_pro_benefits");
              setMenu(false);
              navigationObject.navigation.navigate("ProVersion");
            }}
          >
            <View style={styles.menuItemView}>
              <View style={[styles.menuIcon, { paddingLeft: 4 }]}>
                <FontAwesome5 name="unlock" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>Pro benefites</Text>
            </View>
          </Touchable>

          <Touchable
            style={styles.menuItem}
            onPress={async () => {
              logEvent("hm_import_from_git");
              const config = {
                redirectUrl: "app.croma://oauthredirect",
                clientId: "7c314acf0acaae3133fa",
                clientSecret: "cb11b965876b36ff7fd682588dff284b49543343",
                scopes: ["identity", "repo"],
                serviceConfiguration: {
                  authorizationEndpoint:
                    "https://github.com/login/oauth/authorize",
                  tokenEndpoint: "https://github.com/login/oauth/access_token",
                  revocationEndpoint:
                    "https://github.com/settings/connections/applications/7c314acf0acaae3133fa"
                }
              };

              // Log in to get an authentication token
              const authState = await authorize(config);
              console.log("AuthState: ", authState);
              const octokit = new Octokit({
                auth: authState.accessToken
              });

              octokit.repos.createForAuthenticatedUser({
                name: "repo-from-script-test-2",
                private: "yes"
              });
              /*  octokit.repos.getContent({
                owner: 'kamalkishor1991',
                repo: 'repo-from-script-test',
                path: 'readme.md'
              })
              
                .then(result => {
                  // content will be base64 encoded
                  const content = Buffer.from(result.data.content, 'base64').toString()
                  console.log(content)
                }); */
              /* let res = await octokit.repos.getContent({
                owner: "kamalkishor1991",
                path: "package.json",
                repo: "repo-from-script-test"
              });
              const content = Buffer.from(
                res.data.content,
                "base64"
              ).toString();
              console.log("content: " + content);
              octokit.repos.createOrUpdateFileContents({
                owner: "kamalkishor1991",
                repo: "repo-from-script-test",
                path: "package.json",
                message: "test",
                content: Buffer.from("new updated content ").toString("base64"),
                branch: "master",
                sha: res.data.sha
              }); */
              //https://octokit.github.io/rest.js/v16#api-Repos-updateFile
            }}
          >
            <View style={styles.menuItemView}>
              <View style={styles.menuIcon}>
                <FontAwesome5 name="git" style={styles.icon} />
              </View>
              <Text style={styles.textAreaMenuItem}>import from git</Text>
            </View>
          </Touchable>
        </View>
      </ScrollView>
    </View>
  );

  function hasRateUsPeriodExpired(appInstallTime) {
    if (appInstallTime == null) return false;
    return appInstallTime + fiveDaysDurationMillis() < new Date().getTime();
  }
  function fiveDaysDurationMillis() {
    return 5 * 24 * 60 * 60 * 1000;
  }
}

function MenuLink(props) {
  return (
    <Touchable
      style={[styles.menuItem]}
      onPress={() => {
        logEvent("hm_link_" + props.id);
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
const menuHeight = 50;
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
    alignItems: "flex-start"
  },
  menuIcon: {},
  icon: {
    fontSize: menuHeight - 2 * padding,
    padding: padding,
    color: "black"
  }
});
