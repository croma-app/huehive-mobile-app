import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Touchable from "react-native-platform-touchable";

export const UndoCard = props => {
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
        onPress={() => {
          undoDeletionByName(name);
        }}
      >
        <Text style={styles.undoButton}> UNDO </Text>
      </Touchable>
    </View>
  );
};

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
