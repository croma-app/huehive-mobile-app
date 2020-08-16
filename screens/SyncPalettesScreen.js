import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  PermissionsAndroid
} from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import Touchable from "react-native-platform-touchable";
import { AntDesign } from "@expo/vector-icons";
import { logEvent } from "../libs/Helpers";
import { Octokit } from "@octokit/rest";
import { authorize } from "react-native-app-auth";
import DocumentPicker from "react-native-document-picker";
import { material } from "react-native-typography";
const RNFS = require("react-native-fs");

export default function SyncPalettesScreen(props) {
  const { user, setUser, allPalettes, addPalette } = React.useContext(
    CromaContext
  );
  const importFromFile = async () => {
    const palettesFromFile = await importPalettes();
    addExportedPalettes(palettesFromFile, allPalettes, addPalette);
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <View style={styles.fileContainer}>
          <Text style={material.headline}>Export to file</Text>
          <Text style={material.body1}>
            Export all palettes to your downloads directory
          </Text>
          <Text style={material.body1}>
            Import palettes from previously saved file.
          </Text>
          <CromaButton
            onPressWithLoader={async () => {
              await saveFile(allPalettes);
            }}
          >
            Export palettes as a file
          </CromaButton>
          <CromaButton
            onPressWithLoader={() => {
              logEvent("sync_palettes_screen_import");
              importFromFile();
            }}
          >
            Import palettes from file
          </CromaButton>
        </View>
        <View style={styles.githubContainer}>
          <Text style={material.headline}>Github sync</Text>
          {user && user.github && <GithubView user={user} />}
          {user && user.github && (
            <Touchable
              style={[styles.githubButton]}
              onPress={() => {
                logEvent("github_logout");
                githubLogout();
              }}
            >
              <View style={styles.githubButtonView}>
                <View style={styles.githubIcon}>
                  <AntDesign name="github" style={styles.icon} />
                </View>
                <Text style={styles.githubText}>logout from github</Text>
              </View>
            </Touchable>
          )}
          {!(user && user.github) && (
            <Touchable
              style={[styles.githubButton]}
              onPress={() => {
                logEvent("github_login");
                githubLogin();
              }}
            >
              <View style={styles.githubButtonView}>
                <View style={styles.githubIcon}>
                  <AntDesign name="github" style={styles.icon} />
                </View>
                <Text style={styles.githubText}>
                  Github login to sync palettes
                </Text>
              </View>
            </Touchable>
          )}
        </View>
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
  async function githubLogout() {
    setUser({ ...user, github: undefined });
  }
}

function addExportedPalettes(palettesFromFile, allPalettes, addPalette) {
  let added = 0;
  const palettes = palettesFromJsonString(palettesFromFile);
  palettes.forEach(palette => {
    if (!allPalettes[palette.name]) {
      addPalette(palette);
      added++;
    }
  });
  longToast(added + " palettes added sucessfully.");
}

function GithubView(props) {
  const { user, setUser, allPalettes, addPalette, isPro } = React.useContext(
    CromaContext
  );
  const githubData = user.github;
  const githubUser = user.github.user;

  return (
    <View>
      <View>
        <Text style={[material.body2]}>Welcome {githubUser.login}</Text>
      </View>
      <View style={[styles.syncToGithub]}>
        <Text style={[material.body1]}>
          This will create a repo named color-palettes in your github account.{" "}
        </Text>
        {isPro ? (
          <Text style={[material.body1]}>
            {" "}
            Since you are a pro user. It will create a private repo
          </Text>
        ) : (
          <Text style={[material.body2]}>
            By default the repository will be public. Unlock pro to create a
            private repository.
          </Text>
        )}
        <CromaButton
          onPressWithLoader={async () => {
            try {
              await writeToGithubRepo(
                githubData.authState.accessToken,
                githubUser.login,
                "croma-color-palettes",
                palettesToJsonString(allPalettes),
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
          }}
        >
          Sync palettes to your github repo
        </CromaButton>
      </View>
      <View>
        <Text style={[material.body1]}>
          Update all your palettes from color-palettes repo
        </Text>
        <CromaButton
          onPressWithLoader={async () => {
            const fileContentFromGithub = await readFromGithubRepo(
              githubData.authState.accessToken,
              githubUser.login,
              "croma-color-palettes"
            );
            addExportedPalettes(fileContentFromGithub, allPalettes, addPalette);
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

const longToast = function(msg) {
  ToastAndroid.show(msg, ToastAndroid.LONG);
};

const importPalettes = async () => {
  try {
    const options = {
      type: DocumentPicker.types.plainText
    };
    const file = await DocumentPicker.pick(options);
    const contents = await RNFS.readFile(file.fileCopyUri, "utf8");
    return contents;
  } catch (error) {
    console.error(error);
  }
};

const saveFile = async allPalettes => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const path = RNFS.DownloadDirectoryPath + "/croma.palettes.txt";
      const isFileExists = await RNFS.exists(path);
      if (isFileExists) {
        // remove old file
        await RNFS.unlink(path);
      }
      // write a new file
      await RNFS.writeFile(path, palettesToJsonString(allPalettes), "utf8");
      longToast("Saved in Downloads!");
    } else {
      longToast("Permission denied!");
    }
  } catch (err) {
    longToast(err);
  }
};
const palettesToJsonString = allPalettes => {
  allPalettes = JSON.parse(JSON.stringify(allPalettes));
  var jsonToExport = {};
  jsonToExport.version = "V1";
  jsonToExport.createdAt = new Date();
  jsonToExport.palettes = [];
  Object.values(allPalettes).forEach(palette => {
    palette.createdAt = new Date(palette.createdAt);
    jsonToExport.palettes.push(palette);
  });
  return JSON.stringify(jsonToExport, null, 2);
};
SyncPalettesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Import/Export your palettes"
  };
};
const palettesFromJsonString = exportedPalettesStr => {
  exportedPalettes = JSON.parse(exportedPalettesStr);
  const palettes = [];
  exportedPalettes.palettes.forEach(palette => {
    const p = {};
    console.log("color:", palette);
    p.name = palette.name;
    p.colors = palette.colors;
    palettes.push(p);
  });
  return palettes;
};
const styles = StyleSheet.create({
  container: {
    padding: 12
  },
  icon: {
    fontSize: 25,
    padding: 12,
    color: "white"
  },
  githubButton: {
    backgroundColor: "#333333",
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  githubButtonView: {
    flex: 1,
    flexDirection: "row"
  },
  githubText: {
    fontWeight: "800",
    textAlignVertical: "center",
    padding: 12,
    color: "white",
    alignItems: "flex-start",
    textTransform: "uppercase"
  },
  githubContainer: {
    marginTop: 24,
    marginBottom: 24
  }
});
