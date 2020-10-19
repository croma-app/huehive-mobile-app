import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
export default function MultiColorView(props) {
  const styles = StyleSheet.create({
    palette: {
      flex: 1,
      flexDirection: "row",
      height: 112
    },
    color: {
      flex: 1
    }
  });
  return (
    <View style={styles.palette}>
      {props.colors &&
        props.colors.map(item => (
          <View
            style={[styles.color, { backgroundColor: item.color }]}
            key={item.color}
          />
        ))}
    </View>
  );
}
