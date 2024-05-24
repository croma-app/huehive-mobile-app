import React, { useEffect, useState } from 'react';
import Color from 'pigment/full';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { PaletteCard } from '../components/PaletteCard';
import GridActionButton from '../components/GridActionButton';
import * as Permissions from 'expo-permissions';
import ShareMenu from '../libs/ShareMenu';
import { logEvent, notifyMessage } from '../libs/Helpers';
import PropTypes from 'prop-types';
import { material } from 'react-native-typography';
import Spacer from '../components/Spacer';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';

const HomeScreen = function ({ navigation, route }) {
  const { isLoading, allPalettes, isPro } = useApplicationStore();
  const [pickImageLoading, setPickImageLoading] = useState(false);
  const getPermissionAsync = async () => {
    if (Platform?.OS === 'ios') {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  useEffect(() => {
    logEvent('home_screen');
  }, []);

  useEffect(() => {
    if (Platform?.OS === 'android') {
      // Deep linking code
      // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
      // https://huehive.co/color_palettes/f8a6a1-dcdcdc-f2b3ad-e0e0e0-aec6cf-c4c4c4?name=hello
      Linking.getInitialURL().then((url) => {
        if (url) {
          logEvent('deep_linking_open_link');

          try {
            // Manually parse the URL
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

            // Navigate to the SavePalette screen with the extracted colors and name
            navigation.navigate('SavePalette', {
              colors: [...new Set(colors)], // Ensuring unique colors
              suggestedName: suggestedName
            });
          } catch (error) {
            notifyMessage('Error parsing url: ' + error.message);
            navigation.navigate('Home');
          }
        }
      });

      ShareMenu.getSharedText((text) => {
        if (text && typeof text === 'string') {
          const colors = Color.parse(text);
          logEvent('get_shared_text', { length: colors.length });
          for (var i = 0, l = colors.length; i < l; i++) {
            colors[i] = { color: colors[i].tohex().toLowerCase() };
          }
          navigation.navigate('SavePalette', { colors });
        }
      });
    }
    getPermissionAsync();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Retriving your stunning color palettes...</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {pickImageLoading ? <ActivityIndicator /> : <View />}
        <ScrollView showsVerticalScrollIndicator={false}>
          {allPalettes.length == 0 && (
            <Text style={styles.noColorPaletteMessage}>
              No color palettes found. Tap the + button below to create a new one.
            </Text>
          )}
          {allPalettes.map((palette) => {
            return (
              <PaletteCard
                key={palette.id}
                colors={palette.colors.slice(0, isPro ? palette.colors.length : 4)}
                name={palette.name}
                navigation={navigation}
                route={route}
                paletteId={palette.id}
              />
            );
          })}
          <Spacer />
        </ScrollView>
        <GridActionButton navigation={navigation} setPickImageLoading={setPickImageLoading} />
      </View>
    );
  }
};

HomeScreen.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    height: 200,
    padding: 8,
    justifyContent: 'center',
    position: 'relative'
  },
  noColorPaletteMessage: {
    ...material.headline,
    textAlign: 'center',
    marginTop: 100
  },
  loadingContainer: {
    display: 'flex',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  loadingText: {
    color: Colors.black,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20
  }
});
