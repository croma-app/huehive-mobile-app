import React from 'react';
import { ScrollView, StyleSheet, Button, Alert, View} from 'react-native';
import { PaletteList } from '../components/PaletteList';

export default function PaletteListScreen(props) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <PaletteList navigation={props.navigation}></PaletteList>
    </ScrollView>
  );
}

PaletteListScreen.navigationOptions = {
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
