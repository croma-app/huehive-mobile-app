import React from 'react';
import { CromaColorPicker } from '../components/CromaColorPicker';
import {ScrollView} from 'react-native'

export default function ColorPickerScreen(props) {
  console.log(props)
  return (
    <ScrollView >
      <CromaColorPicker></CromaColorPicker> 
    </ScrollView>
  );
}
