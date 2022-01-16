import React from "react";
import { Dimensions, View, Linking, Platform, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import ColorDetailsScreen from "../screens/ColorDetailScreen";
import ColorPickerScreen from "../screens/ColorPickerScreen";
import PalettesScreen from "../screens/PalettesScreen";
import SavePaletteScreen from "../screens/SavePaletteScreen";
import AddPaletteManuallyScreen from "../screens/AddPaletteManuallyScreen";
import ColorListScreen from "../screens/ColorListScreen";
import PaletteScreen from "../screens/PaletteScreen";
import HomeScreen from "../screens/HomeScreen";
import ProVersionScreen from "../screens/ProVersionScreen";
import SyncPalettesScreen from "../screens/SyncPalettesScreen";
import CommonPalettesScreen from "../screens/CommonPalettesScreen";
import PaletteLibraryScreen from "../screens/PaletteLibraryScreen";
import Colors from "../constants/Colors";
import {
  Entypo,
  FontAwesome,
  MaterialCommunityIcons
} from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import AboutUsScreen from "../screens/AboutUsScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerContentScrollView from "@react-navigation/drawer/src/views/DrawerContentScrollView";
import HamburgerMenu from "../components/HamburgerMenu";
import { HEADER_HEIGHT } from "../constants/Layout";

const screens = [
  { name: "AboutUs", component: AboutUsScreen, options: { title: "About Us" } },
  {
    name: "AddPaletteManually",
    component: AddPaletteManuallyScreen,
    options: { title: "" }
  },
  { name: "ColorDetails", component: ColorDetailsScreen },
  { name: "ColorList", component: ColorListScreen },
  { name: "CommonPalettes", component: CommonPalettesScreen },
  { name: "ColorPicker", component: ColorPickerScreen, options: { title: "" } },
  { name: "Home", component: HomeScreen, options: { title: "Croma" } },
  { name: "Palette", component: PaletteScreen },
  {
    name: "PaletteLibrary",
    component: PaletteLibraryScreen,
    options: { title: "Palette library" }
  },
  { name: "Palettes", component: PalettesScreen },
  { name: "ProVersion", component: ProVersionScreen, options: { title: "" } },
  { name: "SavePalette", component: SavePaletteScreen, options: { title: "" } },
  {
    name: "SyncPalettes",
    component: SyncPalettesScreen,
    options: { title: "Import/Export your palettes" }
  }
];

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export const getDrawerNavigator = () => {
  const hamburgerMenuIcon = navigation => (
    <Touchable
      style={{ marginLeft: 8 }}
      onPress={() => navigation.openDrawer()}
    >
      <Entypo name="menu" style={styles.icon} />
    </Touchable>
  );

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerType="front"
      drawerContent={getDrawerContent}
    >
      {screens.map(screen => {
        const stackNavigatorComponent = () => (
          <Stack.Navigator
            screenOptions={{
              ...screenOptions,
              headerStyle: {
                ...screenOptions.headerStyle,
                height: HEADER_HEIGHT
              }
            }}
            initialRouteName={screen.name}
          >
            <Stack.Screen
              name={screen.name}
              component={screen.component}
              options={({ navigation }) => {
                return {
                  ...screen.options,
                  headerLeft: () => hamburgerMenuIcon(navigation),
                  headerTitleContainerStyle: { left: 40 }
                };
              }}
            />
          </Stack.Navigator>
        );

        return (
          <Drawer.Screen
            name={screen.name}
            key={screen.name}
            component={stackNavigatorComponent}
          />
        );
      })}
    </Drawer.Navigator>
  );
};

const getDrawerContent = props => (
  <DrawerContentScrollView {...props} style={{ paddingTop: 0 }}>
    <HamburgerMenu navigation={props.navigation} />
  </DrawerContentScrollView>
);

export const getStackNavigator = () => {
  const wrappedScreens = screens.map(screen => ({
    ...screen,
    component: props => (
      <View style={styles.contentWrapper}>
        <screen.component {...props} />
      </View>
    )
  }));

  return (
    <Stack.Navigator initialRouteName={"Home"} screenOptions={screenOptions}>
      {wrappedScreens.map(screen => (
        <Stack.Screen
          name={screen.name}
          key={screen.name}
          options={{
            ...screen.options
          }}
        >
          {screen.component}
        </Stack.Screen>
      ))}
    </Stack.Navigator>
  );
};

// box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;

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
  headerRight: () =>
    Platform.OS === "web" ? (
      <View style={{ flexDirection: "row" }}>
        <Touchable
          style={{ padding: "5px", marginRight: "10px" }}
          onPress={() => {
            Linking.openURL("https://discord.gg/ZSBVsBqDtg");
          }}
        >
          <MaterialCommunityIcons name="discord" style={styles.icon} />
        </Touchable>
        <Touchable
          style={{ padding: "5px" }}
          onPress={() => {
            Linking.openURL(
              "https://play.google.com/store/apps/details?id=app.croma"
            );
          }}
        >
          <Entypo name="google-play" style={styles.icon} />
        </Touchable>
        <Touchable
          style={{ padding: "5px", marginRight: "10px" }}
          onPress={() => {
            Linking.openURL("https://github.com/croma-app/croma-react");
          }}
        >
          <Entypo name="github" style={styles.icon} />
        </Touchable>
      </View>
    ) : (
      ""
    ),
  headerTintColor: "#fff"
};

export const linking = ({ setColorList, setSuggestedName }) => ({
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
  icon: { fontSize: 25, height: 25, color: "white" },
  contentWrapper: {
    maxWidth: 600,
    right: Math.max((Dimensions.get("window").width - 600) / 2, 0),
    left: Math.max((Dimensions.get("window").width - 600) / 2, 0)
  }
});
