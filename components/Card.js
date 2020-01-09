import * as React from 'react';
import { StyleSheet, Animated} from 'react-native';
import Colors from '../constants/Colors';
import Touchable from 'react-native-platform-touchable';

export default class Card extends React.Component {
  render() {
    return (
      <Touchable onPress={this.props.onPress} style={[styles.inner]}>
        <Animated.View {...this.props}  >
          {this.props.children}
        </Animated.View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1,
  },
});