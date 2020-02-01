import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";

import applicationHook, { initState, Croma } from "./screens/store";

export default function App(props) {
  return (
    <Croma.Provider value={applicationHook(initState)}>
      <View style={[styles.container]}>
        <View
          style={[
            { flex: 1, backgroundColor: "transparent", maxWidth: 600},
          ]}
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
