import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";

import applicationHook, { initState, Croma } from "./store/store";

export default function App(props) {
  return (
    <Croma.Provider value={applicationHook(initState)}>
      <View style={[styles.container]}>
      <StatusBar
        barStyle = "light-content"
        // dark-content, light-content and default
        hidden = {false}
        //To hide statusBar
        backgroundColor = {Colors.primaryDark}
        //Background color of statusBar only works for Android
        translucent = {false}
        //allowing light, but not detailed shapes
        networkActivityIndicatorVisible = {true}
    />
        <View
          style={[{ flex: 1, backgroundColor: "transparent", maxWidth: 600 }]}
        >
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </View>
    </Croma.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row"
  }
});
