import React from 'react';
import { ScrollView, StyleSheet, Button, Alert, View} from 'react-native';
import { AddPalette } from '../components/AddPalette';
import { setRecoveryProps } from 'expo/build/ErrorRecovery/ErrorRecovery';

export default function AddPaletteScreen(props) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <AddPalette navigation={props.navigation}></AddPalette>
    </ScrollView>
  );
}

AddPaletteScreen.navigationOptions = {
   title: 'Add new palette',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
    justifyContent:'center',
  },
});
