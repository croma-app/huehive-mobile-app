import React from 'react';
import { ScrollView, StyleSheet, Button} from 'react-native';
import { ColorDetail } from '../components/ColorDetails';
import Colors from '../constants/Colors'

export default function ColorDetailScreen(props) {
  console.log(props)
  return (
    <ScrollView style={styles.container}>
      <ColorDetail color={Colors.primary}>{Colors.primary}</ColorDetail>
      <Button
          title="See color palettes"
          raised='true'
          onPress={() => Alert.alert('Simple Button pressed')}
      />
    </ScrollView>
  );
}

ColorDetailScreen.navigationOptions = {
  title: Colors.primary
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: '#fff',
  },
});
