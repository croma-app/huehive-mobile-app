import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import Colors from '../constants/Styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const FloatingActionButton = ({ onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.iconContainer}>
        {icon || <FontAwesome5 name="plus" size={16} color="white" />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 30,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: Colors.black,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FloatingActionButton;
