import React, { useRef } from 'react';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
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
        onPressOut={handlePressOut}>
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
  inner: {
    marginVertical: 8,

    // Shadow properties for iOS
    shadowColor: '#ccc',
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation property for Android
    elevation: 2
  }
});

export default Card;
