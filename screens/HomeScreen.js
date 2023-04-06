import React, { useEffect, useState } from 'react';
import Color from 'pigment/full';
import { ActivityIndicator, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { PaletteCard } from '../components/PaletteCard';
import GridActionButton from '../components/GridActionButton';
import { CromaContext } from '../store/store';
import * as Permissions from 'expo-permissions';
import EmptyView from '../components/EmptyView';
import ShareMenu from '../libs/ShareMenu';
import { logEvent } from '../libs/Helpers';
import PropTypes from 'prop-types';

const HomeScreen = function ({ navigation, route }) {
  const { isLoading, allPalettes, isPro, setColorList, setSuggestedName, clearPalette } =
    React.useContext(CromaContext);
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
    getPermissionAsync();
    if (Platform?.OS === 'android') {
      // Deep linking code
      // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
      Linking.getInitialURL().then((url) => {
        if (url) {
          logEvent('deep_linking_open_link');
          const result = {};
          url
            .split('?')[1]
            .split('&')
            .forEach(function (part) {
              var item = part.split('=');
              result[item[0]] = decodeURIComponent(item[1]);
            });
          clearPalette();
          setColorList([...new Set(JSON.parse(result['colors']) || [])]);
          setSuggestedName(result['name']);
          navigation.navigate('SavePalette');
        }
      });

      ShareMenu.getSharedText((text) => {
        if (text && typeof text === 'string') {
          const colors = Color.parse(text);
          logEvent('get_shared_text', { length: colors.length });
          for (var i = 0, l = colors.length; i < l; i++) {
            colors[i] = { color: colors[i].tohex().toLowerCase() };
          }
          clearPalette();
          setColorList(colors);
          navigation.navigate('SavePalette');
        }
      });
    }
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    logEvent('home_screen', {
      length: !allPalettes ? 0 : allPalettes.length
    });
    return (
      <>
        <View style={styles.container}>
          {pickImageLoading ? <ActivityIndicator /> : <View />}
          <ScrollView showsVerticalScrollIndicator={false}>
            {allPalettes.map((palette) => {
              return (
                <PaletteCard
                  key={palette.name}
                  colors={palette.colors.slice(0, isPro ? palette.colors.length : 4)}
                  name={palette.name}
                  navigation={navigation}
                  route={route}
                  paletteId={palette.id}
                />
              );
            })}
            <EmptyView />
          </ScrollView>
          <GridActionButton navigation={navigation} setPickImageLoading={setPickImageLoading} />
        </View>
      </>
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
  }
});
