import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import Touchable from "react-native-platform-touchable";
import { Entypo } from "@expo/vector-icons";
import { logEvent } from "../libs/Helpers";
import { Octokit } from "@octokit/rest";
import { authorize } from "react-native-app-auth";

export default function SyncPalettesScreen(props) {
  const { user, setUser } = React.useContext(CromaContext);
  console.log("User: ", user);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        {user && user.github && user.github.user && (
          <View>
            <Text>Welcome {user.github.user.login}</Text>
          </View>
        )}
        <Touchable
          style={styles.menuItem}
          onPress={() => {
            logEvent("github_login");
            githubLogin();
          }}
        >
          <View style={styles.menuItemView}>
            <View style={styles.menuIcon}>
              <Entypo name="github" style={styles.icon} />
            </View>
            <Text style={styles.textAreaMenuItem}>
              Github login to sync palettes
            </Text>
          </View>
        </Touchable>
      </View>
    </ScrollView>
  );
  async function githubLogin() {
    const config = {
      redirectUrl: "app.croma://oauthredirect",
      clientId: "7c314acf0acaae3133fa",
      clientSecret: "cb11b965876b36ff7fd682588dff284b49543343",
      scopes: ["user", "identity", "repo"],
      serviceConfiguration: {
        authorizationEndpoint: "https://github.com/login/oauth/authorize",
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
    const response = await octokit.request("/user");
    console.log("AuthState data: ", response);
    setUser({ ...user, github: { authState: authState, user: response.data } });
  }
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 25,
    padding: 12,
    color: "black"
  },
  menuItemView: {
    flex: 1,
    flexDirection: "row"
  },
  textAreaMenuItem: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: 12,
    alignItems: "flex-start"
  }
});
