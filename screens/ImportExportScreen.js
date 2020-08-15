import React, { useContext } from "react";
import {
  ScrollView,
  ToastAndroid,
  StyleSheet,
  PermissionsAndroid
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { View } from "react-native-animatable";
import { CromaContext } from "../store/store";
import CromaButton from "../components/CromaButton";
import { purchase, logEvent } from "../libs/Helpers";
const RNFS = require("react-native-fs");

export default function ImportExportScreen(props) {
  const { allPalettes, addPalette } = useContext(CromaContext);
  const importFromFile = async () => {
    const palettesFromFile = await importPalettes();
    Object.keys(palettesFromFile).forEach(palette => {
      if (!allPalettes[palette] && palette != "version") {
        addPalette(palettesFromFile[palette]);
      }
    });
    longToast("Imported sucessfully.");
  };
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <CromaButton onPress={importFromFile}>
          Import palettes from file
        </CromaButton>
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
