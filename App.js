import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  StatusBar,
  StyleSheet, Text,
  View
} from "react-native";
import AboutUsScreen from "./screens/AboutUsScreen";
import ColorPickerScreen from "./screens/ColorPickerScreen";
import Colors from "./constants/Colors";
import applicationHook, { CromaContext } from "./store/store";
import {NavigationContainer, useNavigationContainerRef} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./screens/HomeScreen";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook();
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
      setIsPalettesLoaded(true);
      const isFree =
          (await NativeModules.CromaModule.getConfigString("isProFree")) ===
          "true";
      if (isFree) {
        applicationState.setPurchase({
          platfrom: "android",
          isProFree: true
        });
      }
    })();
  }, []);

  const spinner = (
      <View style={{ flex: 1, marginTop: "20%" }}>
        <ActivityIndicator size="large" color="#ef635f" animating={true} />
      </View>
  );

  const MainContent = (
      <CromaContext.Provider value={applicationState}>

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
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="ColorPicker" component={ColorPickerScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </View>
          </View>
      </CromaContext.Provider>
  );

  return MainContent;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row"
  }
});
