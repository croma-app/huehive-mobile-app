import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { logEvent, notifyMessage } from '../libs/Helpers';
import SliderColorPicker from './SliderColorPicker';
import AIColorPicker from './AIColorPicker';
import { CromaColorPicker } from './CromaColorPicker';
import Colors from '../constants/Styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HexKeyboard from './HexKeyboard';
import WheelColorPicker from './WheelColorPicker';

export default function ColorPickerModal({ initialColor, onColorSelected, onClose }) {
  const [color, setColor] = useState(initialColor || '#db0a5b');
  const [activeTab, setActiveTab] = useState('basic');
  const handleHexKeyPress = async (key) => {
    if (key == 'clear') {
      setColor('#');
    } else if (key == 'copy') {
      Clipboard.setString(color);
      notifyMessage('Color copied to clipboard');
    } else if (key == 'paste') {
      const pastedText = await Clipboard.getString();
      if (pastedText.match(/^#[0-9A-Fa-f]{6}$/)) {
        setColor(pastedText);
      } else {
        notifyMessage('Invalid color code');
      }
    } else if (key === 'del') {
      if (color.length > 1) {
        setColor((prevColor) => prevColor.slice(0, -1));
      }
    } else {
      if (color.length < 7) {
        setColor((prevColor) => {
          return prevColor + key;
        });
      } else {
        // excluding # character
        notifyMessage('Hex code max 6 chars. Clear/delete to change');
      }
    }
  };
  const tabs = [
    {
      key: 'basic',
      title: 'Standard',
      component: (
        <CromaColorPicker
          onChangeColor={(color) => {
            setColor(color);
          }}
          style={[{ height: 250 }]}
        />
      )
    },
    {
      key: 'wheel',
      title: 'Color Wheel',
      component: <WheelColorPicker color={color} onColorChange={(color) => setColor(color)} />
    },
    {
      key: 'HSB',
      title: 'HSB',
      component: <SliderColorPicker color={`${color}`} setColor={setColor} />
    },
    {
      key: 'AI',
      title: 'AI',
      component: <AIColorPicker color={color} setColor={setColor} />
    },
    {
      key: 'hex',
      title: 'Hex',
      component: (
        <View style={styles.hexPickerContainer}>
          <HexKeyboard onKeyPress={handleHexKeyPress} />
        </View>
      )
    }
  ];

  useEffect(() => {
    logEvent('color_picker_model_' + activeTab);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}>
            <Text style={styles.tabText}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        scrollEnabled={activeTab !== 'wheel'} // TODO: find if there is some other way to solve this issue. - https://github.com/croma-app/huehive-mobile-app/pull/236/files#r1609216412
        showsVerticalScrollIndicator={false}>
        <View style={styles.colorPickerContainer}>
          {tabs.find((tab) => tab.key === activeTab)?.component}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.selectedColorView}>
          <TouchableOpacity
            style={styles.inputTouchArea}
            onPress={() => {
              setActiveTab('hex');
            }}>
            <TextInput
              style={styles.input}
              value={color.toUpperCase()}
              onChangeText={(color) => setColor(color)}
              editable={false}
            />
          </TouchableOpacity>
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
  inputTouchArea: {
    flex: 1,
    marginRight: 16
  },
  input: {
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
