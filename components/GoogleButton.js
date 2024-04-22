import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';

const GoogleButton = ({ buttonType, onPress }) => {
  const [disabled, setDisabled] = useState(false);

  const buttonText = buttonType === 'LOGIN' ? 'Sign In with Google' : 'Sign Up with Google';

  const handlePress = () => {
    setDisabled(true);
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={handlePress}
      disabled={disabled}>
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
  disabledButton: {
    opacity: 0.6
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
