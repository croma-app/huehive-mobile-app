import React from 'react';
import { ScrollView, StyleSheet, Button} from 'react-native';
import { ColorDetail } from '../components/ColorDetails';

export default function ColorDetailScreen(props) {
  const color = props.navigation.getParam("color");
  return (
    <ScrollView style={styles.container}>
      <ColorDetail navigation={props.navigation} color={color}>{color}</ColorDetail>
      <Button
          title="See color palettes"
          raised='true'
          onPress={() => props.navigation.navigate("Palettes", {"color": color})}
      />
    </ScrollView>
  );
}

ColorDetailScreen.navigationOptions = ({ navigation }) => {
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
