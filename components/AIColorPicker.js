// components/AIColorPicker.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import CromaButton from './CromaButton';

export default function AIColorPicker({ color, setColor }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const generateColorFromQuery = async () => {
    setLoading(true);
    // TODO: Implement the AI color generation logic based on the query
    // For now, let's just simulate an async operation with a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    setColor(randomColor);
    setLoading(false);
  };

  return (
    <View>
      <TextInput
        style={styles.textInput}
        placeholder="Enter a query"
        value={query}
        onChangeText={setQuery}
      />
      <CromaButton onPress={generateColorFromQuery} disabled={loading}>
        {loading ? <ActivityIndicator size="small" color="#ffffff" /> : 'Generate Color'}
      </CromaButton>
      <View style={styles.selectedColorView}>
        <TextInput style={styles.input} value={color} onChangeText={(color) => setColor(color)} />
        <View style={[styles.selectedColor, { backgroundColor: color }]}></View>
      </View>
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
  },
  selectedColorView: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 2,
    padding: 10
  },
  selectedColor: {
    width: '50%'
  }
});
