import React, { useRef } from "react";
import * as Animatable from 'react-native-animatable';
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import Touchable from "react-native-platform-touchable";

export const DialogContainer = props => (
  <View style={Platform.OS === 'web' ? styles.DailogContainerWeb : styles.DailogContainer} >
    {props.children}
  </View>
);

export const UndoDialog = props => {
  /*
    Todo - need to add deletion based on type 
  */
  const { name, undoDeletionByName } = props;
  return (
    <Animatable.View animation={'fadeInUp'} duration={700} useNativeDriver={true} style={styles.undoCard}>
      <View style={{width: '80%'}}>
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
    borderRadius: 6,
    marginTop: 1
  },
  undoText: {
    color: "#fff"
  },
  undoButton: {
    fontWeight: "bold",
    color: "#e6be0b"
  },
  DailogContainerWeb: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: Math.min(Dimensions.get("window").width , 400) - 10,
    margin: 5,
    zIndex: 10
  },
  DailogContainer: {
    position: "absolute",
    bottom: 0,
    margin: '1%',
    width: "98%",
    zIndex: 10
  }
});
