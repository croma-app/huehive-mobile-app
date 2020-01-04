import * as React from 'react';
import { StyleSheet, Text} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class CromaButton extends React.Component {
  render() {
    const { style, onPress, children } = this.props
    return (
      <TouchableOpacity style={[styles.button, style]} onPress={onPress} >
          <Text style={{ textTransform: 'uppercase'}}>  {children} </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
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
});