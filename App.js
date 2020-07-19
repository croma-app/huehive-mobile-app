import React, { useState, useEffect } from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  NativeModules
} from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";
import { ActivityIndicator } from "react-native";
import applicationHook, { initState, Croma } from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";
import HamburgerMenu from "./components/HamburgerMenu";
import SideMenu from "react-native-side-menu";

export default function App(props) {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook(initState);
  const isMenuOpen = applicationState.isMenuOpen;
  const setMenu = applicationState.setMenu;
  const isSideMenuEnabled = applicationState.isSideMenuEnabled;
  const setSideMenuEnabled = applicationState.setSideMenuEnabled;
  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
      if (Platform.OS === "android") {
        const value = await NativeModules.CromaModule.getConfigString(
          "hamburgerMenu"
        );
        setSideMenuEnabled(value === "true");
      }
      setIsPalettesLoaded(true);
    })();
    if (Platform.OS === "web") {
      applicationState.setPurchase({
        platfrom: "web"
      });
    }
  }, []);
  return !isPalettesLoaded ? (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <ActivityIndicator size="large" color="#ef635f" animating={true} />
    </View>
  ) : isSideMenuEnabled ? (
    <SideMenu
      menu={<HamburgerMenu />}
      isOpen={isMenuOpen}
      onChange={isOpen => setMenu(isOpen)}
    >
      <Croma.Provider value={applicationState}>
        <ErrorBoundary>
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
              style={[
                { flex: 1, backgroundColor: "transparent", maxWidth: 600 }
              ]}
              className={"navigation-workplace"}
            >
              <AppNavigator />
            </View>
          </View>
        </ErrorBoundary>
      </Croma.Provider>
    </SideMenu>
  ) : (
    <Croma.Provider value={applicationState}>
      <ErrorBoundary>
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
            <AppNavigator />
          </View>
        </View>
      </ErrorBoundary>
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
