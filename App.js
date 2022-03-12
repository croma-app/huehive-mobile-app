import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  NativeModules,
  StatusBar,
  StyleSheet,
  View
} from "react-native";
import AboutUsScreen from "./screens/AboutUsScreen";
import ColorPickerScreen from "./screens/ColorPickerScreen";
import HomeScreen from "./screens/HomeScreen";
import Colors from "./constants/Colors";
import applicationHook, { CromaContext } from "./store/store";
import {NavigationContainer, useNavigationContainerRef} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ColorDetailsScreen from "./screens/ColorDetailScreen";
import PalettesScreen from "./screens/PalettesScreen";
import SavePaletteScreen from "./screens/SavePaletteScreen";
import AddPaletteManuallyScreen from "./screens/AddPaletteManuallyScreen";
import ColorListScreen from "./screens/ColorListScreen";
import PaletteScreen from "./screens/PaletteScreen";
import ProVersionScreen from "./screens/ProVersionScreen";
import SyncPalettesScreen from "./screens/SyncPalettesScreen";
import CommonPalettesScreen from "./screens/CommonPalettesScreen";
import PaletteLibraryScreen from "./screens/PaletteLibraryScreen";
import HamburgerMenu from "./components/HamburgerMenu";
import SideMenu from "react-native-side-menu";
import {HEADER_HEIGHT} from "./constants/Layout";
import Touchable from "react-native-platform-touchable";
import Entypo from "react-native-vector-icons/Entypo";
const Stack = createNativeStackNavigator();

export default function App() {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook();
  const [isMenuOpen, setMenu] = useState(false);
  const navigationRef = useNavigationContainerRef();
  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
     setIsPalettesLoaded(true);
     /*const isFree =
          (await NativeModules.CromaModule.getConfigString("isProFree")) ===
          "true";*/

     /* applicationState.setPurchase({
        platform: "android",
        isProFree: true
      });*/

    })();

  }, []);

  const spinner = (
      <View style={{ flex: 1, marginTop: "20%" }}>
        <ActivityIndicator size="large" color="#ef635f" animating={true} />
      </View>
  );
  const hamburgerMenuIcon = () => (
      <Touchable
          style={{ marginLeft: 8 }}
          onPress={() => setMenu(!isMenuOpen)}
      >
        <Entypo name="menu" style={styles.sideMenuIcon} />
      </Touchable>
  );

  const MainContent = (
    <CromaContext.Provider value={applicationState}>
      <SideMenu
          menu={<HamburgerMenu navigation={navigationRef} toggleSideMenu={() => setMenu(!isMenuOpen)} />}
          isOpen={isMenuOpen}
          onChange={isOpen => setMenu(isOpen)}
      >
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
            <NavigationContainer ref={navigationRef}>
              <Stack.Navigator screenOptions={{
                ...screenOptions,
                headerStyle: {
                  ...screenOptions.headerStyle,
                  height: HEADER_HEIGHT
                }
              }}>
                <Stack.Screen name="Home" options={() => {
                  return {
                    title: "Croma",
                    headerLeft: () => hamburgerMenuIcon(),
                    headerTitleContainerStyle: { left: 40 }
                  };
                }} component={HomeScreen} />
                <Stack.Screen name="ColorPicker" options={{title: "Color picker"}} component={ColorPickerScreen} />
                <Stack.Screen name={"AboutUs"} options={{title: "About us"}} component={AboutUsScreen}/>
                <Stack.Screen name="ColorDetails" options={{title: "Color details"}}  component={ColorDetailsScreen} />
                <Stack.Screen name="Palettes" component={PalettesScreen} />
                <Stack.Screen name="SavePalette" options={{title: "Save palette"}}  component={SavePaletteScreen} />
                <Stack.Screen name="AddPaletteManually" component={AddPaletteManuallyScreen} />
                <Stack.Screen name="Palette" component={PaletteScreen} />
                <Stack.Screen name="ProVersion" component={ProVersionScreen} />
                <Stack.Screen name="SyncPalettes" options={{ title: "Import/Export your palettes" }} component={SyncPalettesScreen} />
                <Stack.Screen name="CommonPalettes" component={CommonPalettesScreen} />
                <Stack.Screen name="PaletteLibrary"  options={{ title: "Palette library" }} component={PaletteLibraryScreen} />
                <Stack.Screen name="ColorList" options={{ title: "New palette" }} component={ColorListScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </View>
      </SideMenu>
    </CromaContext.Provider>
  );

  return !isPalettesLoaded ? spinner : MainContent;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row"
  },
  sideMenuIcon: {
    fontSize: 25, height: 25, color: "white", paddingRight: 4
  }
});
const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: "black",
    shadowOffset: { height: 3, width: 0 },
    borderBottomWidth: 0
  },
  cardStyle: {
    backgroundColor: "rgb(242, 242, 242)"
  },
  headerTintColor: "#fff"
};
