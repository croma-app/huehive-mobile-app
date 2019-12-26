import React from 'react';
import {SingleColorView} from '../components/SingleColorView';
import {ScrollView, TouchableOpacity, StyleSheet, Text} from 'react-native'


export default function ColorListScreen(props) {
  const colors = props.navigation.getParam("colors");
  console.log("Colors:" + JSON.stringify(colors));
  return (
    <ScrollView style={styles.listview} >
      {colors.map(color => <SingleColorView 
      color={color.color}></SingleColorView>)}
      <TouchableOpacity
        style={styles.button}
          onPress={() => this.props.navigation.navigate('ColorPicker')}>
          <Text> SAVE AS NEW PALETTE </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
ColorListScreen.navigationOptions = {
  title: 'Colors',
};

const styles = StyleSheet.create({ // TODO: refactor this to create a consistant button for croma
  button: {
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: '#fff',
    elevation: 2,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  listview: {
    margin: 8,
  }
});