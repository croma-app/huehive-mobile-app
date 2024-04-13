// components/AIColorPicker.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Colors from '../constants/Colors';
import { generateAIColorSuggestions } from '../network/colors';

export default function AIColorPicker({ setColor }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const generateColorFromQuery = async () => {
    setLoading(true);
    try {
      const response = await generateAIColorSuggestions(query);
      const colors = response.data.colors;
      setSuggestions(colors);
    } catch (error) {
      console.error('Error generating AI color suggestions:', error);
    }
    setLoading(false);
  };

  const handleColorSelect = (hex) => {
    setColor(hex);
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="e.g., 'Vibrant sunset by the beach'"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateColorFromQuery}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.fabPrimary} />
          ) : (
            <FontAwesome5 name="magic" size={24} color={Colors.fabPrimary} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.suggestionsContainer}>
        {suggestions.length > 0 ? (
          suggestions.map(({ name, hex }) => (
            <TouchableOpacity
              key={hex}
              style={[styles.colorPreview, { backgroundColor: hex }]}
              onPress={() => handleColorSelect(hex)}
            />
          ))
        ) : (
          <Text style={styles.placeholderText}>Your AI-generated colors will appear here</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8
  },
  generateButton: {
    borderWidth: 1,
    borderColor: Colors.fabPrimary,
    borderRadius: 8,
    padding: 8
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  colorPreview: {
    width: 50,
    height: 50,
    borderRadius: 25,
    margin: 5
  },
  placeholderText: {
    color: 'gray',
    fontSize: 16
  }
});
