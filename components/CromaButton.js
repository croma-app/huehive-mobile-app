import React, { useState } from "react";
import Touchable from "react-native-platform-touchable";
import { StyleSheet, Text, ActivityIndicator } from "react-native";
import MaterialIcons  from "react-native-vector-icons/MaterialIcons";

const LOADER_DEFAULT = 0;
const LOADER_LOADING = 1;
const LOADER_DONE = 2;

const CromaButton = function(props) {
  const { style, onPress, onPressWithLoader, children, textStyle } = props;
  const [loaderState, setLoaderState] = useState(LOADER_DEFAULT);
  const _onPress = async () => {
    if (onPressWithLoader) {
      try {
        setLoaderState(LOADER_LOADING);
        await onPressWithLoader();
        setLoaderState(LOADER_DONE);
      } catch (error) {
        setLoaderState(LOADER_DEFAULT);
        console.error(error);
      }
    } else {
      onPress();
    }
  };
  return (
    <Touchable style={[styles.button, style]} onPress={_onPress}>
      {loaderState === LOADER_LOADING ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={[styles.text, textStyle]}> {children} </Text>
          {loaderState === LOADER_DONE && (
            <MaterialIcons name="check-circle" size={24} color="green" />
          )}
        </>
      )}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: "rgba(0,0,0, .4)",
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: "#fff",
    elevation: 2,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
  },
  text: {
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#484a4c"
  }
});

export default CromaButton;
