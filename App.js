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
import { AppContainer } from "./navigation/MainTabNavigator";
import { ActivityIndicator } from "react-native";
import applicationHook, { CromaContext } from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";
import HamburgerMenu from "./components/HamburgerMenu";
import SideMenu from "react-native-side-menu";
import { logEvent } from "./libs/Helpers";

export default function App(props) {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook();
  const navigationObject = {
    navigation: null
  };
  const { isMenuOpen, setMenu } = applicationState;

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

  const MainContent = (
    <CromaContext.Provider value={applicationState}>
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
            <AppContainer
              ref={nav => {
                // https://reactnavigation.org/docs/3.x/app-containers
                if (nav) {
                  navigationObject.navigation = nav._navigation;
                }
              }}
            />
          </View>
        </View>
      </ErrorBoundary>
    </CromaContext.Provider>
  );

  const WithSideMenu = MainContent => {
    return Platform.OS == "android" ? (
      <SideMenu
        menu={<HamburgerMenu navigater={navigationObject} setMenu={setMenu} />}
        isOpen={isMenuOpen}
        onChange={isOpen => {
          logEvent("app_hamburger_menu_open");
          setMenu(isOpen);
        }}
      >
        {MainContent}
      </SideMenu>
    ) : (
      MainContent
    );
  };

  return !isPalettesLoaded ? (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <ActivityIndicator size="large" color="#ef635f" animating={true} />
    </View>
  ) : (
    WithSideMenu(MainContent)
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
