import React, { useEffect } from 'react';

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { PaletteCard } from '../components/PaletteCard';

import { logEvent } from '../libs/Helpers';
import PropTypes from 'prop-types';
import { material } from 'react-native-typography';
import Spacer from '../components/Spacer';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';
import AdBanner from '../components/AdBanner';

const MyPalettesScreen = function ({ navigation, route }) {
  const { isLoading, allPalettes, pro } = useApplicationStore();

  useEffect(() => {
    logEvent('my_palettes_screen');
  }, []);

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
        <ScrollView showsVerticalScrollIndicator={false}>
          {allPalettes.length === 0 && (
            <Text style={styles.noColorPaletteMessage}>
              No color palettes found. Create new palettes from Home screen
            </Text>
          )}
          {allPalettes.map((palette) => {
            return (
              <View style={styles.paletteCardContainer}>
                <PaletteCard
                  key={palette.id}
                  colors={palette.colors.slice(0, pro.plan != 'starter' ? palette.colors.length : 4)}
                  name={palette.name}
                  navigation={navigation}
                  route={route}
                  paletteId={palette.id}
                />
              </View>
            );
          })}
          <Spacer />
        </ScrollView>
      <AdBanner plan={pro.plan} />
      </View>
    );
  }
};

MyPalettesScreen.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any
};

export default MyPalettesScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    height: 200,
    justifyContent: 'center',
    position: 'relative'
  },
  noColorPaletteMessage: {
    ...material.headline,
    textAlign: 'center',
    marginTop: 100,
    padding: 8,
  },
  paletteCardContainer: {
    paddingHorizontal: 8,
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
