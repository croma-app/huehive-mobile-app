import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { View } from "react-native-animatable";

export default function PalettesScreen(props) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={styles.title}>PRO BENEFITS</Text>
        <Text style={styles.line}>
          1. Add more than 4 colors in a palette 🎨
        </Text>
        <Text style={styles.line}>
          2. Support the development efferts to keep the app awesome and simple
          without any ads and annoying notifications 😊
        </Text>
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
    fontSize: 15
  },
  line: {
    paddingBottom: 4
  }
});
