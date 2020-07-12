import React, { useState, useEffect, useRef } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";
import { ActivityIndicator } from "react-native";
import applicationHook, { initState, Croma } from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";
import Drawer from "react-native-drawer";
import SideMenu from "./components/SideMenu";

export default function App(props) {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook(initState);

  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
      setIsPalettesLoaded(true);
    })();
    if (Platform.OS === "web") {
      applicationState.setPurchase({
        platfrom: "web"
      });
    }
  }, []);
  let _drawer = useRef(null);
  return !isPalettesLoaded ? (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <ActivityIndicator size="large" color="#ef635f" animating={true} />
    </View>
  ) : (
    <Croma.Provider value={applicationState}>
      <Drawer ref={_drawer} content={<SideMenu />}>
        <View style={[styles.container]}>
          <StatusBar
            barStyle="light-content"
            // dark-content, light-content and default
            hidden={false}
            //To hide statusBar
            backgroundColor={Colors.primaryDark}
            //Background color of statusBar only works for Android
            translucent={false}
            //allowing light, but not detailed shapes
            networkActivityIndicatorVisible={true}
          />
          <View
            style={[{ flex: 1, backgroundColor: "transparent", maxWidth: 600 }]}
            className={"navigation-workplace"}
          >
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <AppNavigator screenProps={{ drawer: _drawer }} />
          </View>
        </View>
      </Drawer>
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
