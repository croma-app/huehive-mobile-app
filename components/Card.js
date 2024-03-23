import React, { useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import Colors from '../constants/Colors';
import PropTypes from 'prop-types';

const Card = ({ animationType, onLongPress, onPress, children }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  };

  const scaleStyle = {
    transform: [{ scale: scaleValue }]
  };

  return (
    <Animatable.View animation={animationType} duration={500} useNativeDriver={true}>
      <TouchableOpacity
        activeOpacity={1}
        onLongPress={onLongPress}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.touchable}>
        <Animated.View style={[styles.inner, scaleStyle]}>
          <View>{children}</View>
        </Animated.View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

Card.propTypes = {
  animationType: PropTypes.string,
  onLongPress: PropTypes.func,
  onPress: PropTypes.func,
  children: PropTypes.node
};

const styles = StyleSheet.create({
  touchable: {
    borderRadius: 8
  },
  inner: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1,
    overflow: 'hidden',
    borderRadius: 8
  }
});

export default Card;
