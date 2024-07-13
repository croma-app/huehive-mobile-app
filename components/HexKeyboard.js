import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HexKeyboard = ({ onKeyPress }) => {
  const keys = [
    ['0', '1', '2', '3'],
    ['4', '5', '6', '7'],
    ['8', '9', 'A', 'B'],
    ['C', 'D', 'E', 'F'],
    ['del', 'clear', 'copy', 'paste']
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
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  key: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    marginHorizontal: 4
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});

export default HexKeyboard;
