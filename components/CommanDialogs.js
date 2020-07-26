import React from "react";
import * as Animatable from "react-native-animatable";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import Touchable from "react-native-platform-touchable";

export const DialogContainer = props => (
  <View
    style={
      Platform.OS === "web" ? styles.DailogContainerWeb : styles.DailogContainer
    }
  >
    {props.children}
  </View>
);

export const UndoDialog = props => {
  /*
    Todo - need to add deletion based on type
  */
  const { name, undoDeletionByName } = props;
  return (
    <Animatable.View
      animation={"fadeInUpBig"}
      duration={500}
      style={[styles.undoCard, styles.marginAndRadius]}
      useNativeDriver={true}
    >
      <View>
        <Text style={styles.undoText}>Deleted {name}. </Text>
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
    </Animatable.View>
  );
};

export const TextDialog = props => (
  <Animatable.View
    animation={"fadeInUp"}
    duration={500}
    useNativeDriver={true}
    style={styles.undoCard}
  >
    <View>
      <Text style={styles.undoText}>{props.text}</Text>
    </View>
  </Animatable.View>
);

const styles = StyleSheet.create({
  undoCard: {
    backgroundColor: "#303036",
    padding: 15,
    flexDirection: "row",
    display: "flex",
    justifyContent: "space-between"
  },
  marginAndRadius: {
    margin: 2,
    borderRadius: 6
  },
  undoText: {
    color: "#fff",
    fontSize: 15
  },
  undoButton: {
    fontWeight: "bold",
    color: "#e6be0b",
    fontSize: 15
  },
  DailogContainerWeb: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: Math.min(Dimensions.get("window").width, 400) - 10,
    margin: 5,
    zIndex: 10
  },
  DailogContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10
  }
});
