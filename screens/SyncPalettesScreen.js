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
import { authorize } from "react-native-app-auth";
import DocumentPicker from "react-native-document-picker";
import { material } from "react-native-typography";
const RNFS = require("react-native-fs");
import { notifyMessage } from '../libs/Helpers';
import { useTranslation } from 'react-i18next';
import { t } from "i18next";
import RNFetchBlob from 'rn-fetch-blob';

export default function SyncPalettesScreen(props) {
  const { t } = useTranslation();
  const navigation = props.navigation;
  const { user, setUser, allPalettes, addPalette } = React.useContext(
    CromaContext
  );
  const importFromFile = async () => {
    try{
      const palettesFromFile = await importPalettes();
      addExportedPalettes(palettesFromFile, allPalettes, addPalette);
    } catch(error) {
      notifyMessage("Error when importing colors: " + error.toString());
    }
  };
  logEvent("sync_palettes_screen");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {user.loggedIn ? (<View>
        <Text>Your palettes are safely stored in our servers</Text>
      <View>) :
        (
        <View>
          <View><Text style={material.headline}> Login/signup to sync your palettes </Text></View>
          <CromaButton
          onPress={async () => {
              logEvent("login");
              navigation.navigate("Login");
            }}
          >
            {t('Login/Signup')}
          </CromaButton>
        </View>
        )
      }
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
      </View>
    </ScrollView>
  );
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
  notifyMessage(added + " " + t("palettes added successfully."));
}

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
    let granted = Platform.OS == 'ios';
    if (Platform.OS == 'android') {
      granted = (await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      )) === PermissionsAndroid.RESULTS.GRANTED;
    }
    const downloadPath = Platform.OS === 'ios' ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
    if (granted) {
      let fileName = 'croma.palettes.txt';
      let path = downloadPath + "/" + fileName;
      const isFileExists = await RNFS.exists(path);
      if (isFileExists) {
        fileName = "croma.palettes." + Math.floor(Math.random() * 100000) + ".txt";
        path = downloadPath + "/" + fileName;
      }
      await RNFS.writeFile(path, palettesToJsonString(allPalettes), "utf8");
      if (Platform.OS == 'android') {
        RNFetchBlob.android.addCompleteDownload({
          title: fileName,
          description: t('Croma palettes exported successfully'),
          mime: 'text/json',
          path: path,
          showNotification: true,
        });
      } 
      if (Platform.OS == 'ios') {
        await RNFetchBlob.ios.previewDocument(path);
        // notifyMessage("Saved in documents");
      }
    } else {
      notifyMessage(t("Permission denied!"));
    }
  } catch (err) {
    notifyMessage(err);
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
  }
});
