import React from "react";
import { ScrollView, StyleSheet, Text, ToastAndroid } from "react-native";
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
        {user && user.github && <GithubView user={user} />}
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

function GithubView(props) {
  const { user, setUser, isPro } = React.useContext(CromaContext);
  const githubData = user.github;
  const githubUser = user.github.user;
  const jsonToSync = { time: new Date() };
  return (
    <View style={styles.githubContainer}>
      <View>
        <Text>Welcome {githubUser.login}</Text>
      </View>
      <View style={styles.syncToGithub}>
        <Text>
          This will create a repo named color-palettes in your github account.{" "}
        </Text>
        {isPro ? (
          <Text> Since you are a pro user. It will create a private repo</Text>
        ) : (
          <Text>
            By default the repository will be public. Unlock pro to create a
            private repository.
          </Text>
        )}
        <CromaButton
          onPress={() => {
            (async () => {
              try {
                await writeToGithubRepo(
                  githubData.authState.accessToken,
                  githubUser.login,
                  "croma-color-palettes",
                  JSON.stringify(jsonToSync),
                  isPro
                );
                ToastAndroid.show(
                  "Palettes are synced to github repo croma-color-palettes",
                  ToastAndroid.LONG
                );
              } catch (e) {
                ToastAndroid.show(
                  "Error while calling github APIs " + e.toString(),
                  ToastAndroid.LONG
                );
              }
            })();
          }}
        >
          Sync palettes to your github repo
        </CromaButton>
      </View>
      <View>
        <Text>Update all your palettes from color-palettes repo</Text>
        <CromaButton
          onPress={() => {
            (async () => {
              content = await readFromGithubRepo(
                githubData.authState.accessToken,
                githubUser.login,
                "croma-color-palettes"
              );
              ToastAndroid.show("Content" + content, ToastAndroid.LONG);
            })();
          }}
        >
          Sync palettes from your github repo
        </CromaButton>
      </View>
    </View>
  );
}

async function writeToGithubRepo(
  accessToken,
  username,
  repoName,
  contentStr,
  privateRepo
) {
  const octokit = new Octokit({
    auth: accessToken
  });
  await createRepoIfDoesNotExist(octokit, repoName, privateRepo);
  const sha = await getExistingFileSHAIfExist(octokit, username, repoName);

  await octokit.repos.createOrUpdateFileContents({
    owner: username,
    repo: repoName,
    path: "croma.json",
    message: "update color palettes - from croma android app.",
    content: Buffer.from(contentStr).toString("base64"),
    branch: "master",
    sha: sha
  });
}
async function getExistingFileSHAIfExist(octokit, username, repoName) {
  let sha = undefined;
  try {
    let res = await octokit.repos.getContent({
      owner: username,
      path: "croma.json",
      repo: repoName
    });
    sha = res.data.sha;
  } catch (e) {
    if (e.status != 404) {
      throw e;
    }
  }
  return sha;
}

async function createRepoIfDoesNotExist(octokit, repoName, privateRepo) {
  try {
    await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description:
        "Created by - Croma - https://play.google.com/store/apps/details?id=app.croma",
      private: privateRepo
    });
  } catch (e) {
    if (
      !(
        e.errors &&
        e.errors[0] &&
        e.errors[0].message === "name already exists on this account"
      )
    ) {
      throw e;
    }
  }
}

async function readFromGithubRepo(accessToken, username, repoName) {
  const octokit = new Octokit({
    auth: accessToken
  });
  let result = await octokit.repos.getContent({
    owner: username,
    path: "croma.json",
    repo: repoName
  });
  return Buffer.from(result.data.content, "base64").toString();
}

SyncPalettesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Import/Export your palettes"
  };
};
const styles = StyleSheet.create({
  container: {
    padding: 12
  },
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
