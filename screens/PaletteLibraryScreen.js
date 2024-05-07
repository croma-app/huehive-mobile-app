import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { logEvent } from '../libs/Helpers';
import { material } from 'react-native-typography';
import Colors from '../constants/Colors';
import network from '../network';
import useApplicationStore from '../hooks/useApplicationStore';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
const allPalettes = require('../constants/palettes/palettes').default;

export default function PaletteLibraryScreen({ navigation }) {
  const [explorePalettes, setExplorePalettes] = useState();
  const { setCommonPalettes } = useApplicationStore();
  useEffect(() => {
    logEvent('palette_library_screen');
  }, []);

  useEffect(() => {
    const getExplorePalette = async () => {
      const res = await network.getExplorePalettes();
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
    };
    getExplorePalette();
  }, [explorePalettes]);
  console.log({ explorePalettes });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {explorePalettes?.map((palette, index) => (
        <PalettePreviewCard
          key={index}
          onPress={() => {
            navigation.navigate('ColorList', {
              colors: palette.colors,
              suggestedName: name + ' - ' + palette.name
            });
          }}
          colors={palette.colors}
          name={palette.name}
        />
      ))}
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
  }
});
