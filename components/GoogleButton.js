import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

const GoogleButton = ({ buttonType, onPress }) => {
  const buttonText = buttonType === 'signin' ? 'Sign In with Google' : 'Sign Up with Google';

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconAndText}>
        <Icon name="google" size={20} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

GoogleButton.propTypes = {
  buttonType: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  iconAndText: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginRight: 10
  }
});

export default GoogleButton;
