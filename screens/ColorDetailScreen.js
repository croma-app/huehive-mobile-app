import React from 'react';
import { ScrollView, StyleSheet, Button} from 'react-native';
import { ColorDetail } from '../components/ColorDetails';
import Colors from '../constants/Colors'
import { setRecoveryProps } from 'expo/build/ErrorRecovery/ErrorRecovery';

export default function ColorDetailScreen(props) {
  
  return (
    <ScrollView style={styles.container}>
      <ColorDetail navigation={props.navigation} color={props.navigation.getParam("color")}>{props.navigation.getParam("color")}</ColorDetail>
      <Button
          title="See color palettes"
          raised='true'
          onPress={() => Alert.alert('Simple Button pressed')}
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
