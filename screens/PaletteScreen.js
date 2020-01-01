import React from 'react';
import SingleColorCard from '../components/SingleColorCard';
import {ScrollView,  StyleSheet} from 'react-native'

export default function PaletteScreen(props) {
  const colors = props.navigation.getParam("colors");
  console.log("Colors:" + JSON.stringify(colors));
  return (
    <ScrollView style={styles.listview} >
      {colors.map(color => <SingleColorCard color={color.color}></SingleColorCard>)}
    </ScrollView>
  );
}
PaletteScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('name'),
  };
};

const styles = StyleSheet.create({
  listview: {
    margin: 8,
  }
});