import * as React from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

export default class Card extends React.Component {
  render() {
    return (
      <Animatable.View animation={this.props.animationType} duration={500} useNativeDriver={true}>
        <TouchableOpacity
          onLongPress={this.props.onLongPress}
          onPress={this.props.onPress}
          style={[styles.inner, Platform.OS === 'web' ? { boxShadow: '0px 1px 4px #888888' } : {}]}>
          <View {...this.props}>{this.props.children}</View>
        </TouchableOpacity>
      </Animatable.View>
    );
  }
}

Card.propTypes = {
  animationType: PropTypes.string,
  onLongPress: PropTypes.func,
  onPress: PropTypes.func,
  onPressDrag: PropTypes.func,
  children: PropTypes.children
};

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1
  }
});
