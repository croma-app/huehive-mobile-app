import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HexKeyboard = ({ onKeyPress }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['A', 'B', 'C'],
    ['D', 'E', 'F'],
    ['#', '0', 'del']
  ];

  return (
    <View style={styles.keyboard}>
      {keys.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => (
            <TouchableOpacity key={key} style={styles.key} onPress={() => onKeyPress(key)}>
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    backgroundColor: '#F5FCFF'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  key: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray'
  },
  keyText: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default HexKeyboard;
