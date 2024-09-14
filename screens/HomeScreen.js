import React, { useCallback, useEffect, useState } from 'react';
import Color from 'pigment/full';
import {
  ActivityIndicator,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';
import { PaletteCard } from '../components/PaletteCard';
import GridActionButton from '../components/GridActionButton';
import ShareMenu from 'react-native-share-menu';
import { logEvent, notifyMessage } from '../libs/Helpers';
import PropTypes from 'prop-types';
import { material } from 'react-native-typography';
import Spacer from '../components/Spacer';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';

const HomeScreen = function ({ navigation, route }) {
  const { isLoading, allPalettes, pro } = useApplicationStore();
  const [pickImageLoading, setPickImageLoading] = useState(false);

  useEffect(() => {
    logEvent('home_screen');
  }, []);

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
        navigation.navigate('SavePalette', {
          colors: colors.map((color) => {
            return { color: '#' + color };
          }),
          suggestedName: suggestedName
        });
      } catch (error) {
        notifyMessage('Error parsing url: ' + error.message);
        navigation.navigate('Home');
      }
    },
    [navigation]
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
  }, [handleDeepLink, navigation]);

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
        navigation.navigate('SavePalette', { colors });
      }
    },
    [navigation]
  );

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
    const listener = ShareMenu.addNewShareListener(handleShare);
    return () => {
      listener.remove();
    };
  }, [handleShare]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Retrieving your stunning color palettes...</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {pickImageLoading ? <ActivityIndicator /> : <View />}
        <ScrollView showsVerticalScrollIndicator={false}>
          {allPalettes.length === 0 && (
            <Text style={styles.noColorPaletteMessage}>
              No color palettes found. Tap the + button below to create a new one.
            </Text>
          )}
          {allPalettes.map((palette) => {
            return (
              <PaletteCard
                key={palette.id}
                colors={palette.colors.slice(0, pro.plan != 'starter' ? palette.colors.length : 4)}
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
