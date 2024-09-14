import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { logEvent } from '../libs/Helpers';

import { material } from 'react-native-typography';
import Colors from '../constants/Styles';
import useApplicationStore from '../hooks/useApplicationStore';
import { useTranslation } from 'react-i18next';
const allPalettes = require('../constants/palettes/palettes').default;

export default function PaletteLibraryScreen({ navigation }) {
  const { setCommonPalettes } = useApplicationStore();
  const { t } = useTranslation();
  useEffect(() => {
    logEvent('palette_library_screen');
  }, []);

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
    paddingRight: 12,
    marginBottom: 20
  },
  row: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1,
    padding: 8,
    borderRadius: 8,
    marginBottom: 20
  },
  title: {
    ...material.title
  },
  desc: {
    ...material.body1
  }
});
