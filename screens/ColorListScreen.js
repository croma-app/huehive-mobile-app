import React from 'react';
import {SingleColorView} from '../components/SingleColorView';
import {ScrollView, TouchableOpacity, StyleSheet, Text} from 'react-native'
import CromaButton from '../components/CromaButton';

export default function ColorListScreen(props) {
  const colors = props.navigation.getParam("colors");
  console.log("Colors:" + JSON.stringify(colors));
  return (
    <ScrollView style={styles.listview} >
      {colors.map(color => <SingleColorView key={color.color} color={color.color}></SingleColorView>)}
      <CromaButton
          onPress={() => this.props.navigation.navigate('ColorPicker')}>
          SAVE AS NEW PALETTE
      </CromaButton>
    </ScrollView>
  );
}
ColorListScreen.navigationOptions = {
  title: 'Colors',
};

const styles = StyleSheet.create({
  listview: {
    margin: 8,
  }
});