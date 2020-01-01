import * as React from 'react';
import { StyleSheet, Animated} from 'react-native';
import Colors from '../constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class Card extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress} style={[styles.inner, this.props.style]}>
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
    marginVertical: 4,
    elevation: 1,
    marginTop: 8,
    marginBottom: 8,
  },
});