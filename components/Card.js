import * as React from 'react';
import { StyleSheet, Animated } from 'react-native';
import * as Colors from '../constants/Colors';

export default class Card extends React.Component {
  render() {
    //console.log("Props:=============" + JSON.stringify(this.props));
    return (
      <Animated.View {...this.props} style={[styles.inner, this.props.style]}>
        {this.props.children}
      </Animated.View>
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