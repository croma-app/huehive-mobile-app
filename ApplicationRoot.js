import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Linking, Platform, Animated } from 'react-native';
import AboutUsScreen from './screens/AboutUsScreen';
import HomeSearchScreen from './screens/HomeSearchScreen.js';
import ChatSessionHistoriesScreen from './screens/ChatSessionHistoriesScreen';
import MyPalettesScreen from './screens/MyPalettesScreen.js';
import Colors from './constants/Styles';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ColorDetailsScreen from './screens/ColorDetailScreen';
import PalettesScreen from './screens/PalettesScreen';
import SavePaletteScreen from './screens/SavePaletteScreen';
import ChatSessionFollowUpScreen from './screens/ChatSessionFollowUpScreen';
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
import { ROUTE_NAMES } from './libs/constants.js';
import AppAuthProvider from './components/AppAuthProvider.js';
import UserProfile from './screens/UserProfileScreen.js';
import useApplicationStore from './hooks/useApplicationStore.js';
import ExplorePaletteScreen from './screens/ExplorePaletteScreen.js';
import { notifyMessage } from './libs/Helpers.js';
import FlashMessage from 'react-native-flash-message';
import ShareMenu from 'react-native-share-menu';
import Color from 'pigment/full';
import { logEvent } from './libs/Helpers.js';

const Stack = createNativeStackNavigator();

/*import { LogBox } from 'react-native'; // enabled for recording demos
LogBox.ignoreAllLogs();//Ignore all log notifications*/
export default function App() {
  const applicationState = useApplicationStore();
  const { loadInitPaletteFromStore } = applicationState;
  const [isMenuOpen, setMenu] = useState(false);
  const navigationRef = useNavigationContainerRef();
  useIAPConnection(function (error) {
    if (error) {
      // TODO: figure out a better way to handle this error and show user a way to retry, ask for help or continue.
      notifyMessage('Error during purchase initialization. Purchase might not work. Please retry');
    }
    loadInitPaletteFromStore(); // Still load the palettes. Specially simulator will always face this issue.
  });

  const hamburgerMenuIcon = () => (
    <TouchableOpacity onPress={() => setMenu(!isMenuOpen)}>
      <Entypo name="menu" style={styles.sideMenuIcon} />
    </TouchableOpacity>
  );

  const handleDeepLink = useCallback(
    (url) => {
      try {
        const urlParts = url.split('?');
        const path = urlParts[0].split('/');
        const colorsPart = path[path.length - 1];

        // Split the colors part by `-` to get the color codes
        const colors = colorsPart.split('-');

        // Parse the query parameters
        const queryParamsString = urlParts[1] || '';
        const queryParams = {};
        queryParamsString.split('&').forEach((param) => {
          const [key, value] = param.split('=');
          queryParams[key] = decodeURIComponent(value);
        });

        const suggestedName = queryParams['name'];
        navigationRef.navigate('SavePalette', {
          colors: colors.map((color) => {
            return { color: '#' + color };
          }),
          suggestedName: suggestedName
        });
      } catch (error) {
        notifyMessage('Error parsing url: ' + error.message);
        navigationRef.navigate(ROUTE_NAMES.HOME_SEARCH);
      }
    },
    [navigationRef]
  );

  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Handle deep link when the app is launched
      Linking.getInitialURL().then((url) => {
        if (url) {
          logEvent('deep_linking_open_link');
          handleDeepLink(url);
        }
      });

      // Handle deep link when the app is already running
      const linkingListener = Linking.addEventListener('url', (event) => {
        if (event.url) {
          logEvent('deep_linking_open_link');
          handleDeepLink(event.url);
        }
      });

      // Cleanup listener on unmount
      return () => {
        linkingListener.remove();
      };
    }
  }, [handleDeepLink, navigationRef]);

  const handleShare = useCallback(
    (item) => {
      if (item && item.mimeType === 'text/plain' && item.data) {
        const text = item.data;
        notifyMessage('Shared text: ' + text);
        const colors = Color.parse(text);
        logEvent('get_shared_text', { length: colors.length });
        for (let i = 0, l = colors.length; i < l; i++) {
          colors[i] = { color: colors[i].tohex().toLowerCase() };
        }
        navigationRef.navigate('SavePalette', { colors });
      }
    },
    [navigationRef]
  );

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, [handleShare]);

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
                  name={ROUTE_NAMES.HOME_SEARCH}
                  options={{
                    headerLeft: hamburgerMenuIcon,
                    headerTitleContainerStyle: { left: 40 },
                    title: t('HueHive AI')
                  }}
                  component={HomeSearchScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.CHAT_SESSION}
                  options={{
                    headerLeft: hamburgerMenuIcon,
                    headerTitleContainerStyle: { left: 40 },
                    title: t('HueHive AI chat')
                  }}
                  component={ChatSessionFollowUpScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.MY_PALETTES}
                  options={() => {
                    return {
                      headerLeft: hamburgerMenuIcon,
                      headerTitleContainerStyle: { left: 40 },
                      title: t('My Palettes')
                    };
                  }}
                  component={MyPalettesScreen}
                />
                <Stack.Screen
                  name={ROUTE_NAMES.ABOUT_US}
                  options={{ title: t('About us') }}
                  component={AboutUsScreen}
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
        <FlashMessage floating={true} position={{ bottom: 100 }} />
      </SideMenu>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row'
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
