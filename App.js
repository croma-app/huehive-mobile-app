import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  Platform,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import Colors from "./constants/Colors";
import {
  getDrawerNavigator,
  getStackNavigator
} from "./navigation/MainTabNavigator";
import applicationHook, { CromaContext } from "./store/store";
import ErrorBoundary from "./components/ErrorBoundary";
import NavigationContainer from "@react-navigation/native/src/NavigationContainer";

export default function App() {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook();

  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
      setIsPalettesLoaded(true);
      if (Platform.OS === "android") {
        const isFree =
          (await NativeModules.CromaModule.getConfigString("isProFree")) ===
          "true";
        if (isFree) {
          applicationState.setPurchase({
            platfrom: "android",
            isProFree: true
          });
        }
      }
    })();

    if (Platform.OS === "web") {
      applicationState.setPurchase({
        platfrom: "web"
      });
    }
  }, []);

  const spinner = (
    <View style={{ flex: 1, marginTop: "20%" }}>
      <ActivityIndicator size="large" color="#ef635f" animating={true} />
    </View>
  );

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
            style={[{ flex: 1, backgroundColor: "transparent" }]}
            className={"navigation-workplace"}
          >
            <NavigationContainer linking={linking(applicationState)}>
              {navigator}
            </NavigationContainer>
          </View>
        </View>
      </ErrorBoundary>
    </CromaContext.Provider>
  );

  return !isPalettesLoaded ? spinner : MainContent;
}

const getNavigator = () => {
  return Platform.OS === "android" ? getDrawerNavigator() : getStackNavigator();
};

const navigator = getNavigator();

const linking = ({ setColorList, setSuggestedName }) => ({
  enabled: Platform.OS === "web",
  prefixes: ["https://croma.app/"],
  config: {
    screens: {
      SavePalette: {
        path: "Main/SavePalette",
        parse: {
          name: name => {
            setSuggestedName(name);
            return name;
          },
          colors: colors => {
            setColorList(colors);
            return colors;
          }
        }
      }
    }
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row"
  }
});
