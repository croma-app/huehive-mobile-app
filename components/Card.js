import * as React from 'react';
import { StyleSheet, Animated} from 'react-native';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Card extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.inner]}>
        <Animated.View {...this.props}  >
          {this.props.children}
        </Animated.View>
      </TouchableOpacity>
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