import * as React from 'react';
import { StyleSheet, Animated, TouchableHighlight} from 'react-native';
import * as Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Card extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Animated.View {...this.props} style={[styles.inner, this.props.style]} >
          {this.props.children}
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.white,
    marginVertical: 4,
    elevation: 1,
  },
});