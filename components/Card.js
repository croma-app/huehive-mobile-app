import * as React from 'react';
import { StyleSheet, Animated, TouchableHighlight} from 'react-native';
import * as Colors from '../constants/Colors';

export default class Card extends React.Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <Animated.View {...this.props} style={[styles.inner, this.props.style]} >
          {this.props.children}
        </Animated.View>
      </TouchableHighlight>
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