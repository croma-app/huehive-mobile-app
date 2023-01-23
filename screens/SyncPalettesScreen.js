import React, { useContext } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  PermissionsAndroid,
  TouchableOpacity
} from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import AntDesign from "react-native-vector-icons/AntDesign";
import { logEvent } from "../libs/Helpers";
import { Octokit } from "@octokit/rest";
import { authorize } from "react-native-app-auth";
import DocumentPicker from "react-native-document-picker";
import { material } from "react-native-typography";
const RNFS = require("react-native-fs");
import { notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { t } from "i18next";

export default function SyncPalettesScreen(props) {
  const { t } = useTranslation();

  const { user, setUser, allPalettes, addPalette } = React.useContext(
    CromaContext
  );
  const importFromFile = async () => {
    try{
      const palettesFromFile = await importPalettes();
      addExportedPalettes(palettesFromFile, allPalettes, addPalette);
    } catch(error) {
      longToast("Error when importing colors: " + error.toString());
    }
  };
  logEvent("sync_palettes_screen");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <View style={styles.fileContainer}>
          <Text style={material.headline}>{t('Export to file')}</Text>
          <View style={{ padding: 10 }}>
            <Text style={material.body1}>
            {t('Export all palettes to your downloads directory')}
            </Text>
            <CromaButton
              onPressWithLoader={async () => {
                logEvent("sync_palettes_screen_export");
                await saveFile(allPalettes);
              }}
            >
              {t('Export palettes to a file')}
            </CromaButton>
            <Text style={material.body1}>
            {t('Import palettes from previously saved file.')}
            </Text>
            <CromaButton
              onPressWithLoader={() => {
                logEvent("sync_palettes_screen_import");
                importFromFile();
              }}
            >
              {t('Import palettes from file.')}
            </CromaButton>
          </View>
        </View>
        <View style={styles.githubContainer}>
          <Text style={material.headline}>{t('Github sync')}</Text>
          <View style={{ padding: 10 }}>
            {user && user.github && <GithubView user={user} />}
            {user && user.github && (
              <TouchableOpacity
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
                  <Text style={styles.githubText}>{t('logout from github')}</Text>
                </View>
              </TouchableOpacity>
            )}
            {!(user && user.github) && (
              <View>
                <Text style={material.body1}>
                {t('Login using github to sync your palettes to a github repository')}
                </Text>
                <TouchableOpacity
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
                    {t('Github login to sync palettes')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  longToast(added + " " + t("palettes added successfully."));
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
        {t('This will create a repo named croma-color-palettes in your github account.')}{" "}
        </Text>
        {isPro ? (
          <Text style={[material.body1]}>
            {" "}
            {t('Since you are a pro user. It will create a private repo')}
          </Text>
        ) : (
          <Text style={[material.body2]}>
            {t('By default the repository will be public. Unlock pro to create a private repository.')}
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
              notifyMessage(
                t("Palettes are synced to github repo croma-color-palettes")
              );
            } catch (e) {
              notifyMessage(
                t("Error while calling github APIs ") + e.toString()
              );
            }
          }}
        >
          {t("Sync palettes to your github repo")}
        </CromaButton>
      </View>
      <View>
        <Text style={[material.body1]}>
        {t("Update all your palettes from color-palettes repo")}
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
          {t("Sync palettes from your github repo")}
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
    message: t("update color palettes - from croma android app."),
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
        t("Created by - Croma - ") + "https://play.google.com/store/apps/details?id=app.croma",
      private: privateRepo
    });
  } catch (e) {
    if (
      !(
        e.errors &&
        e.errors[0] &&
        e.errors[0].message === t("name already exists on this account")
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
  notifyMessage(msg);
};

const importPalettes = async () => {
  const options = {
    type: DocumentPicker.types.plainText
  };
  const file = await DocumentPicker.pickSingle(options);
  const contents = await RNFS.readFile(file.fileCopyUri || file.uri, "utf8");
  return contents;
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
      longToast(t("Saved in Downloads!"));
    } else {
      longToast(t("Permission denied!"));
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
const palettesFromJsonString = exportedPalettesStr => {
  const exportedPalettes = JSON.parse(exportedPalettesStr);
  const palettes = [];
  exportedPalettes.palettes.forEach(palette => {
    const p = {};
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
