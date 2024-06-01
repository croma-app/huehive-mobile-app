/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors, { Spacing } from '../constants/Styles';

const LOADER_DEFAULT = 0;
const LOADER_LOADING = 1;
const LOADER_DONE = 2;

const CromaButton = function (props) {
  const { style, onPress, onPressWithLoader, children, textStyle, variant } = props;
  const [loaderState, setLoaderState] = useState(LOADER_DEFAULT);
  const _onPress = async () => {
    if (onPressWithLoader) {
      try {
        setLoaderState(LOADER_LOADING);
        await onPressWithLoader();
        setLoaderState(LOADER_DONE);
      } catch (error) {
        setLoaderState(LOADER_DEFAULT);
        console.error(error);
      }
    } else {
      onPress();
    }
  };
  return (
    <TouchableOpacity
      style={[variant === 'small' ? styles.buttonSmall : styles.button, style]}
      onPress={_onPress}>
      {loaderState === LOADER_LOADING ? (
        <ActivityIndicator />
      ) : (
        <>
          <Text style={[styles.text, textStyle]}> {children} </Text>
          {loaderState === LOADER_DONE && (
            <MaterialIcons name="check-circle" size={24} color="green" />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: Colors.white,
    elevation: 2,
    height: 50,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 8
  },
  buttonSmall: {
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    backgroundColor: Colors.white,
    elevation: 2,
    height: 30,
    marginTop: Spacing.small,
    marginBottom: Spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: Spacing.medium
  },
  text: {
    textTransform: 'uppercase',
    fontWeight: '700',
    color: '#484a4c'
  }
});

export default CromaButton;
