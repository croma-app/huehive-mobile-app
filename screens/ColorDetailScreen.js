import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ColorDetail } from '../components/ColorDetails';

export default function ColorDetailScreen(props) {
  console.log(props)
  return (
    <ScrollView style={styles.container}>
      <ColorDetail color="#FFF">Color</ColorDetail>
    </ScrollView>
  );
}

ColorDetailScreen.navigationOptions = {
  title: 'Color',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
