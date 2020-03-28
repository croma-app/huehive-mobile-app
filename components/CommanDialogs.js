import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

export const DialogContainer = props => (
  <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
    {props.children}
  </View>
);

export const UndoDialog = props => {
  /*
    Todo - need to add deletion based on type 
  */
  const { name, undoDeletionByName } = props;
  return (
    <View style={styles.undoCard}>
      <View style={{ width: "80%" }}>
        <Text style={styles.undoText}>Deleted {name}. tab to dismiss.</Text>
      </View>
      <Touchable
        onPress={event => {
          event.stopPropagation();
          event.preventDefault();
          undoDeletionByName(name);
        }}
      >
        <Text style={styles.undoButton}> UNDO </Text>
      </Touchable>
    </View>
  );
};

export const TextDialog = props => (
  <View style={styles.undoCard}>
    <View style={{ width: "80%" }}>
      <Text style={styles.undoText}>{props.text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  undoCard: {
    backgroundColor: "#303036",
    flexDirection: "row",
    padding: 15,
    marginTop: 1
  },
  undoText: {
    color: "#fff"
  },
  undoButton: {
    fontWeight: "bold",
    color: "#e6be0b"
  }
});
