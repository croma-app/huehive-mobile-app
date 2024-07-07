import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { capitalizeFirstLetter, logEvent } from '../libs/Helpers';

import Colors from '../constants/Styles';
import network from '../network';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useApplicationStore from '../hooks/useApplicationStore.js';
import CromaButton from '../components/CromaButton';
import { material } from 'react-native-typography';

export default function ExplorePaletteScreen({ navigation }) {
  const [explorePalettes, setExplorePalettes] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { pro } = useApplicationStore();

  useEffect(() => {
    logEvent('explore_palette_screen');
  }, []);

  const getExplorePalettes = useCallback(async (query = '') => {
    setIsLoading(true);
    try {
      if (pro.plan !== 'starter') {
        const res = await network.getExplorePalettes(1, query);
        const palettes = res.data.search_results.map((p) => {
          return {
            name: p.user_query ? capitalizeFirstLetter(p.user_query) : p.user_query,
            colors: p.colors.map((color) => ({
              id: color.id,
              name: color.name,
              color: color.hex
            }))
          };
        });
        setExplorePalettes(palettes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getExplorePalettes();
  }, [getExplorePalettes, pro]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      { pro.plan !== 'starter' && (
        <>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchText}
              placeholder="Search keywords"
              value={query}
              onChangeText={setQuery}
              onBlur={() => {
                getExplorePalettes(query);
              }}
            />
            <Ionicons name="search" size={20} color={Colors.grey} style={styles.searchIcon} />
          </View>

          {isLoading ? (
            <ActivityIndicator style={styles.loader} size={'large'} color={Colors.primary} />
          ) : (
            explorePalettes?.map((palette, index) => (
              <PalettePreviewCard
                key={index}
                onPress={() => {
                  navigation.navigate('ColorList', {
                    colors: palette.colors,
                    suggestedName: palette.name
                  });
                }}
                colors={palette.colors}
                name={palette.name}
              />
            ))
          )}
        </>
      )}
      {pro.plan === 'starter' && (
        <>
          <View>
            <Text style={styles.upgradeToProDesc}>Exploring and searching  AI generate palettes is only available in Pro and Pro plus plans. Please upgrade to use this features.</Text>
          </View>
          <CromaButton
            style={styles.proVersionButton}
            textStyle={{ color: Colors.white }}
            onPress={() => navigation.navigate("ProVersion")}>
            Upgrade to Pro
          </CromaButton></>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 20
  },
  searchContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  searchText: {
    flex: 1,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 14
  },
  searchIcon: {
    marginLeft: 10,
    position: 'absolute',
    right: 10
  },
  loader: { margin: 20 },
  proVersionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24
  },
  upgradeToProDesc: {
    marginVertical: 16,
    ...material.body2,
  }
});
