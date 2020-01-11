import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Dimensions
} from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";

import applicationHook from "./screens/store";

export const Croma = React.createContext();

export default function App(props) {
  const { height, width } = Dimensions.get("window");
  console.log("height", height, "width", width);

  const initState = { allPalettes: {}, deletedPalettes: {}, isLoading: false };
  return (
    <Croma.Provider value={applicationHook(initState)}>
      <View style={[styles.container]}>
        <View
          style={[
            { backgroundColor: "transparent" },
            { width: Platform.OS == "web" ? Math.min(600, width) : width }
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
