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
import Colors from '../constants/Styles';
import { generateAIColorSuggestions } from '../network/colors';
import { pickTextColorBasedOnBgColor } from '../libs/ColorHelper';
import { logEvent, notifyMessage, sendClientError } from '../libs/Helpers';
import CromaButton from './CromaButton';
import { useTranslation } from 'react-i18next';

export default function AIColorPicker({ setColor, currentPlan, onNavigateProScreen }) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  const generateColorFromQuery = async () => {
    if (query.trim().length === 0) {
      notifyMessage('Please enter a query to generate color suggestions');
      return;
    }
    setLoading(true);
    try {
      logEvent('ai_color_picker_query_submitted');
      const response = await generateAIColorSuggestions(query);
      const colors = response.data.colors;
      setSuggestions(colors);
    } catch (error) {
      console.error('Error generating AI color suggestions:', error);
      sendClientError('ai_color_picker_query_submitted', error.message);
      notifyMessage('Failed to generate suggestion: ' + error.message + ', please try again.');
    }
    setLoading(false);
  };

  const handleColorSelect = (hex) => {
    logEvent('ai_color_picker_color_selected');
    setColor(hex);
    setSelectedColor(hex);
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
          disabled={loading || currentPlan !== 'proPlus'}>
          {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <FontAwesome5
              name="magic"
              size={24}
              color={currentPlan !== 'proPlus' ? Colors.lightGrey : Colors.primary}
            />
          )}
        </TouchableOpacity>
      </View>
      {currentPlan != 'proPlus' && (
        <CromaButton
          style={styles.proVersionButton}
          textStyle={{ color: Colors.white }}
          onPress={() => onNavigateProScreen()}>
          {t('Upgrade to Pro Plus')}
        </CromaButton>
      )}
      <View style={styles.suggestionsContainer}>
        {suggestions.length > 0 ? (
          suggestions.map(({ name, hex }) => (
            <TouchableOpacity
              key={hex}
              style={[
                styles.colorPreview,
                { backgroundColor: hex },
                selectedColor === hex && styles.selectedColor
              ]}
              onPress={() => handleColorSelect(hex)}>
              <Text style={[styles.colorName, { color: pickTextColorBasedOnBgColor(hex) }]}>
                {name}
              </Text>
              <Text style={[styles.colorHex, { color: pickTextColorBasedOnBgColor(hex) }]}>
                {hex}
              </Text>
            </TouchableOpacity>
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
    borderColor: Colors.primary,
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
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray'
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: Colors.primary
  },
  colorName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4
  },
  colorHex: {
    fontSize: 10
  },
  placeholderText: {
    color: 'gray',
    fontSize: 16
  },
  proVersionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24
  }
});
