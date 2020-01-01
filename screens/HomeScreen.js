import React from 'react';
import { ScrollView, StyleSheet} from 'react-native';
import { PaletteList } from '../components/PaletteList';

export default function HomeScreen(props) {

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
