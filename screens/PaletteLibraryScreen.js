import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { logEvent } from '../libs/Helpers';
import { material } from 'react-native-typography';
import Colors from '../constants/Colors';
import { CromaContext } from '../store/store';
const allPalettes = require('../constants/palettes/palettes').default;

export default function PaletteLibraryScreen({ navigation }) {
  logEvent('palette_library_screen');

  const { setCommonPalettes } = useContext(CromaContext);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
    padding: 4
  },
  title: {
    ...material.title
  },
  desc: {
    ...material.body1
  }
});
