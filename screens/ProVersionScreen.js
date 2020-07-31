import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { CromaContext } from "../store/store";
import { purchase, logEvent } from "../libs/Helpers";

export default function PalettesScreen(props) {
  const { isPro, setPurchase } = React.useContext(CromaContext);
  const purchaseDevelopment = () => {
    purchase(setPurchase, "support_development");
  };
  const purchasePro = () => {
    purchase(setPurchase);
  };
  logEvent("pro_version_screen");
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>PRO BENEFITS</Text>
        <Text style={styles.line}>
          1. Add more than 4 colors in a palette 🎨
        </Text>
        <CromaButton
          style={{ backgroundColor: "#ff5c59" }}
          textStyle={{ color: "#fff" }}
          onPress={purchasePro}
        >
          {isPro ? "You are a pro user! Enjoy the app" : "Unlock pro"}
        </CromaButton>
        <Text style={styles.line}>
          2. Support the development efferts to keep the app awesome and simple
          without any ads and annoying notifications 😊
        </Text>
        <CromaButton onPress={purchaseDevelopment}>
          Support app development
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
