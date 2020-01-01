import React from 'react';
import { ScrollView, View, StyleSheet} from 'react-native';
import { PaletteList } from '../components/PaletteList';
import {PaletteCard} from '../components/PaletteCard';

export default function HomeScreen(props) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PaletteCard colors={[{color: "#11a1aa"}, {color: "#cdcdcc"}]} name={"paletteName"}></PaletteCard>
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: 1,
        }}
      />
      <PaletteList navigation={props.navigation}></PaletteList>
    </ScrollView>
  );
}

HomeScreen.navigationOptions = {
   title: 'Croma',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: '#fff',
    justifyContent:'center',
  },
});
