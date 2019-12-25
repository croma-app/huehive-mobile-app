import React from 'react';
import { ScrollView, StyleSheet, Text} from 'react-native';
import Color from 'pigment/full';
import {PaletteCard} from '../components/PaletteCard';
export default function PalettesScreen(props) {
  const color = new Color(props.navigation.getParam("color"));
  let items = [];
  for (const i in color) {
    if ((/.*scheme$/i).test(i) && typeof color[i] === 'function') {
      let colors = [];
      const paletteColors = color[i]();
      paletteColors.forEach((c)=> 
        colors.push({color: c.tohex()})
      );
     // console.log("colors================" + JSON.stringify(colors));
      items.push(<PaletteCard key={i.toString()} colors={colors} name={i.toString()}></PaletteCard>)
    }
  }
  return (
    <ScrollView style={styles.container}>
      {items}
    </ScrollView>
  );
}

PalettesScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('color'),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
});
