import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import { purchase, logEvent } from "../libs/Helpers";

export default function ImportExportScreen(props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <CromaButton>Import palettes from file</CromaButton>
        <CromaButton>Export palettes as a file</CromaButton>
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
