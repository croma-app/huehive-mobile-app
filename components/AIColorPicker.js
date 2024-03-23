// components/AIColorPicker.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CromaButton from './CromaButton';

export default function AIColorPicker({ color, setColor }) {
  const [query, setQuery] = useState('');

  const generateColorFromQuery = () => {
    // TODO: Implement the AI color generation logic based on the query
    // For now, let's just generate a random color
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randomColor);
  };

  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Enter a query"
        value={query}
        onChangeText={setQuery}
      />
      <CromaButton onPress={generateColorFromQuery}>Generate Color</CromaButton>
      <View style={[styles.colorPreview, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8
  },
  colorPreview: {
    width: '100%',
    height: 100,
    marginTop: 16
  }
});
