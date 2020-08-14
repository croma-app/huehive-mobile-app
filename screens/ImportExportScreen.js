import React, { useContext } from "react";
import {
  ScrollView,
  ToastAndroid,
  StyleSheet,
  PermissionsAndroid
} from "react-native";
import { View } from "react-native-animatable";
import { CromaContext } from "../store/store";
import CromaButton from "../components/CromaButton";
import { purchase, logEvent } from "../libs/Helpers";
const longToast = function(msg) {
  ToastAndroid.show(msg, ToastAndroid.LONG);
};
const exportPalettes = allPalettes => {
  var RNFS = require("react-native-fs");

  var path = RNFS.DownloadDirectoryPath + "/croma.palettes.json";
  // write the file
  allPalettes["version"] = "V1";
  RNFS.writeFile(path, JSON.stringify(allPalettes), "utf8")
    .then(success => {
      longToast("Saved in Downloads...");
    })
    .catch(err => {
      longToast(err.message);
    });
};

saveFile = async allPalettes => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      exportPalettes(allPalettes);
    } else {
      longToast("Permission denied");
    }
  } catch (err) {
    longToast(err);
  }
};

export default function ImportExportScreen(props) {
  const { allPalettes } = useContext(CromaContext);
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <CromaButton>Import palettes from file</CromaButton>
        <CromaButton
          onPress={() => {
            saveFile(allPalettes);
          }}
        >
          Export palettes as a file
        </CromaButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: "bold"
  },
  line: {
    paddingBottom: 4,
    fontSize: 15
  }
});
