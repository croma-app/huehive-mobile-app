import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
export default function MultiColorView(props) {
  return (
    <View style={styles.palette}>
      {props.colors &&
        props.colors.map((item, index) => (
          <View
            style={[styles.color, { backgroundColor: item.color }]}
            key={`${item.color}-${index}`}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  palette: {
    alignItems: "stretch",
    flexDirection: "row",
    height: 112
  },
  color: {
    flex: 1
  }
});
