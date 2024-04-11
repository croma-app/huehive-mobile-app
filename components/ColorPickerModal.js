import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import { logEvent } from '../libs/Helpers';
import SliderColorPicker from './SliderColorPicker';
import AIColorPicker from './AIColorPicker';
import Colors from '../constants/Colors';
import { CromaColorPicker } from './CromaColorPicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ColorPickerModal({ initialColor, onColorSelected, onClose }) {
  const [color, setColor] = useState(initialColor || '#db0a5b');
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    logEvent('color_picker_model_' + activeTab);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
          onPress={() => setActiveTab('basic')}>
          <Text style={styles.tabText}>Standard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'HSB' && styles.activeTab]}
          onPress={() => setActiveTab('HSB')}>
          <Text style={styles.tabText}>HSB</Text>
        </TouchableOpacity>
        {/* AI Color Picker is under development */}
        <TouchableOpacity
          style={[styles.tab, activeTab === 'AI' && styles.activeTab, { display: 'none' }]}
          onPress={() => setActiveTab('AI')}>
          <Text style={styles.tabText}>AI Color Picker</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.colorPickerContainer}>
          {activeTab === 'basic' ? (
            <CromaColorPicker
              onChangeColor={(color) => {
                setColor(color);
              }}
              style={[{ height: 250 }]}
            />
          ) : activeTab === 'HSB' ? (
            <SliderColorPicker color={`${color}`} setColor={setColor} />
          ) : (
            <AIColorPicker color={color} setColor={setColor} />
          )}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.selectedColorView}>
          <TextInput
            style={styles.input}
            value={color}
            onChangeText={(color) => setColor(color)}
            editable={false}
          />
        </View>
        <View style={styles.bottomContainerPreviewArea}>
          <View style={[styles.selectedColor, { backgroundColor: color }]}></View>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => {
              onColorSelected(color);
              onClose();
            }}>
            <MaterialIcons name="done" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000'
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8
  },
  colorPickerContainer: {
    marginBottom: 16
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  selectedColorView: {
    flexDirection: 'row',
    flex: 1
  },
  selectedColor: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    flex: 1,
    marginRight: 16,
    fontSize: 24
  },
  bottomContainerPreviewArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  doneButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
