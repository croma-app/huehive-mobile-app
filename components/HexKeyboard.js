import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const HexKeyboard = ({ onKeyPress }) => {
  const keys = [
    ['0', '1', '2', '3'],
    ['4', '5', '6', '7'],
    ['8', '9', 'A', 'B'],
    ['C', 'D', 'E', 'F'],
  ];
  const specialKeys = ['del', 'clear', 'copy', 'paste'];

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
      <View style={styles.specialRow}>
        {specialKeys.map((key) => (
          <TouchableOpacity key={key} style={[styles.key, styles.specialKey]} onPress={() => onKeyPress(key)}>
            <Text style={styles.specialKeyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  keyboard: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
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
    marginHorizontal: 2,
    minWidth: 0,
  },
  keyText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  specialKey: {
    backgroundColor: '#f0f0f0',
    borderColor: '#888',
    height: 40,
  },
  specialKeyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default HexKeyboard;
