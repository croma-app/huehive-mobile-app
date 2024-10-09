import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import AboutUsScreen from './screens/AboutUsScreen';
import ChatSessionScreen from './screens/ChatSessionScreen';
import ChatSessionHistoriesScreen from './screens/ChatSessionHistoriesScreen';
import HomeScreen from './screens/HomeScreen';
import Colors from './constants/Styles';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ColorDetailsScreen from './screens/ColorDetailScreen';
import PalettesScreen from './screens/PalettesScreen';
import SavePaletteScreen from './screens/SavePaletteScreen';
import ColorListScreen from './screens/ColorListScreen';
import PaletteViewScreen from './screens/PaletteViewScreen.js';
import PaletteEditScreen from './screens/PaletteEditScreen.js';
import ProVersionScreen from './screens/ProVersionScreen';
import CommonPalettesScreen from './screens/CommonPalettesScreen';
import PaletteLibraryScreen from './screens/PaletteLibraryScreen';
import HamburgerMenu from './components/HamburgerMenu';
import SideMenu from 'react-native-side-menu';
import { HEADER_HEIGHT } from './constants/Layout';
import Entypo from 'react-native-vector-icons/Entypo';
import { t } from 'i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useIAPConnection from './hooks/useIAPConnection';
import { ROUTE_NAMES } from './libs/contants.js';
import AppAuthProvider from './components/AppAuthProvider.js';
import UserProfile from './screens/UserProfileScreen.js';
import useApplicationStore from './hooks/useApplicationStore.js';
import ExplorePaletteScreen from './screens/ExplorePaletteScreen.js';
import { notifyMessage } from './libs/Helpers.js';
import FlashMessage from "react-native-flash-message";


const Stack = createNativeStackNavigator();

/*import { LogBox } from 'react-native'; // enabled for recording demos
LogBox.ignoreAllLogs();//Ignore all log notifications*/
export default function App() {
  const applicationState = useApplicationStore();
  const { loadInitPaletteFromStore } = applicationState;
  const [isMenuOpen, setMenu] = useState(false);
  const navigationRef = useNavigationContainerRef();
  useIAPConnection(function(error) {
    if (error) {
      // TODO: figure out a better way to handle this error and show user a way to retry, ask for help or continue.
      notifyMessage("Error during purchase initialization. Purchase might not work. Please retry");
    } 
    loadInitPaletteFromStore(); // Still load the palettes. Specially simulator will always face this issue.
  });

  const hamburgerMenuIcon = () => (
    <TouchableOpacity onPress={() => setMenu(!isMenuOpen)}>
      <Entypo name="menu" style={styles.sideMenuIcon} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SideMenu
        animationFunction={(prop, value) =>
          Animated.spring(prop, {
            toValue: value,
            friction: 8,
            useNativeDriver: true
          })
        }
        menu={
          <HamburgerMenu navigation={navigationRef} toggleSideMenu={() => setMenu(!isMenuOpen)} />
        }
        isOpen={isMenuOpen}
        onChange={(isOpen) => setMenu(isOpen)}>
        <View style={styles.container}>
          <NavigationContainer ref={navigationRef}>
            <AppAuthProvider>
              <Stack.Navigator
                screenOptions={{
                  ...screenOptions,
                  headerStyle: {
                    ...screenOptions.headerStyle,
                    height: HEADER_HEIGHT
                  }
                }}>
                <Stack.Screen
                  name={ROUTE_NAMES.HOME}
                  options={() => {
                    return {
                      title: t('HueHive'),
                      headerLeft: hamburgerMenuIcon,
                      headerTitleContainerStyle: { left: 40 }
                    };
                  }}
                  component={HomeScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.ABOUT_US}
                  options={{ title: t('About us') }}
                  component={AboutUsScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.CHAT_SESSION}
                  options={{ title: t('HueHive AI assistant') }}
                  component={ChatSessionScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.CHAT_SESSION_HISTORIES}
                  options={{ title: t('Your chats') }}
                  component={ChatSessionHistoriesScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.COLOR_DETAILS}
                  options={{ title: t('Color details') }}
                  component={ColorDetailsScreen}
                />
                <Stack.Screen name={ROUTE_NAMES.PALETTES} component={PalettesScreen} />
                <Stack.Screen
                  name={ROUTE_NAMES.SAVE_PALETTE}
                  options={{ title: t('Save palette') }}
                  component={SavePaletteScreen}
                />
                <Stack.Screen name="Palette" component={PaletteViewScreen} />
                <Stack.Screen name="PaletteEdit" component={PaletteEditScreen} />
                <Stack.Screen
                  name={ROUTE_NAMES.PRO_VERSION}
                  options={{ title: t('Pro benefits') }}
                  component={ProVersionScreen}
                />
                <Stack.Screen name="CommonPalettes" component={CommonPalettesScreen} />
                <Stack.Screen
                  name={ROUTE_NAMES.PALETTE_LIBRARY}
                  options={{ title: t('Palette library') }}
                  component={PaletteLibraryScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.COLOR_LIST}
                  options={{ title: t('New palette') }}
                  component={ColorListScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.USER_PROFILE}
                  options={{ title: t('Profile') }}
                  component={UserProfile}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.EXPLORE_PALETTE}
                  options={{ title: t('Explore palette') }}
                  component={ExplorePaletteScreen}
                />
              </Stack.Navigator>
            </AppAuthProvider>
          </NavigationContainer>
        </View>
        <FlashMessage floating={true} position={{bottom: 100}} />
      </SideMenu>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
  },
  sideMenuIcon: {
    fontSize: 25,
    height: 25,
    color: 'white',
    paddingRight: 15
  }
});
const screenOptions = {
  headerStyle: {
    backgroundColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowColor: 'black',
    shadowOffset: { height: 3, width: 0 },
    borderBottomWidth: 0
  },
  headerTintColor: Colors.white
};
