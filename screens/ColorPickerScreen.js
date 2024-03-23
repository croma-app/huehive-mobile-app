import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import CromaButton from '../components/CromaButton';
import { CromaColorPicker as ColorPicker } from 'croma-color-picker';
import { logEvent } from '../libs/Helpers';
import { CromaContext } from '../store/store';
import SliderColorPicker from '../components/SliderColorPicker';
import AIColorPicker from '../components/AIColorPicker';


export default function ColorPickerScreen({ navigation }) {
  const [color, setColor] = useState('#db0a5b');
  const [activeTab, setActiveTab] = useState('basic');
  const { colorPickerCallback } = useContext(CromaContext);

  logEvent('color_picker_screen');
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'basic' && styles.activeTab]}
          onPress={() => setActiveTab('basic')}>
          <Text style={styles.tabText}>Basic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'HSB' && styles.activeTab]}
          onPress={() => setActiveTab('HSB')}>
          <Text style={styles.tabText}>HSB</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'AI' && styles.activeTab]}
          onPress={() => setActiveTab('AI')}>
          <Text style={styles.tabText}>AI Color Picker</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.colorPickerContainer}>
          {activeTab === 'basic' ? (
            <ColorPicker
              onChangeColor={(color) => {
                setColor(color);
              }}
              style={[{ height: 350 }]}
            />
          ) : activeTab === 'HSB' ? (
            <SliderColorPicker color={`${color}`} setColor={setColor} />
          ) : (
            <AIColorPicker color={color} setColor={setColor} />
          )}
        </View>
        <View>
          <CromaButton
            onPress={() => {
              navigation.goBack();
              colorPickerCallback({ color });
            }}>
            Done
          </CromaButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    paddingVertical: 16
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000'
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16
  },
  colorPickerContainer: {
    marginBottom: 24
  },
  colorPicker: {
    height: 350
  },
  buttonContainer: {
    alignItems: 'center'
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8
  }
});
