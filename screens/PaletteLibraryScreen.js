import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { logEvent } from '../libs/Helpers';
import { material } from 'react-native-typography';
import Colors from '../constants/Colors';
import network from '../network';
import useApplicationStore from '../hooks/useApplicationStore';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
const allPalettes = require('../constants/palettes/palettes').default;

export default function PaletteLibraryScreen({ navigation }) {
  const [explorePalettes, setExplorePalettes] = useState();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { setCommonPalettes } = useApplicationStore();
  useEffect(() => {
    logEvent('palette_library_screen');
  }, []);

  const getExplorePalettes = useCallback(async (query) => {
    setIsLoading(true);
    const res = await network.getExplorePalettes(1, query);
    const palettes = res.data.search_results.map((p) => {
      return {
        name: p.user_query,
        colors: p.colors.map((color) => ({
          id: color.id,
          name: color.name,
          color: color.hex
        }))
      };
    });
    setExplorePalettes(palettes);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getExplorePalettes();
  }, [getExplorePalettes]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchText}
          placeholder="Search keyword"
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
      {allPalettes.map((palettes, index) => {
        return (
          <TouchableOpacity
            key={palettes?.name ?? index}
            style={styles.row}
            onPress={() => {
              logEvent('hm_matrial_palettes');
              setCommonPalettes(palettes);
              navigation.navigate('CommonPalettes');
            }}>
            <View>
              <View>
                <Text style={styles.title}>{palettes.name}</Text>
              </View>
              <View>
                <Text style={styles.desc}>{palettes.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  },
  row: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 10
  },
  title: {
    ...material.title
  },
  desc: {
    ...material.body1
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
  loader: { margin: 20 }
});
