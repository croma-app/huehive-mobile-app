import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import ColorDetailsScreen from '../screens/ColorDetailScreen'
import ColorPickerScreen from '../screens/ColorPickerScreen'
import PalettesScreen from '../screens/PalettesScreen';
import AddPaletteScreen from '../screens/AddPaletteScreen';
import AddPaletteManuallyScreen from '../screens/AddPaletteManuallyScreen';
import ColorListScreen from '../screens/ColorListScreen';
import PaletteListScreen from '../screens/PaletteListScreen'

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
const RootStack = createStackNavigator(
  {
    ColorDetails: ColorDetailsScreen,
    ColorPicker: ColorPickerScreen,
    Palettes: PalettesScreen,
    AddPalette: AddPaletteScreen,
    AddPaletteManually: AddPaletteManuallyScreen,
    ColorList: ColorListScreen,
    PaletteList: PaletteListScreen
  },
  {
    initialRouteName: "PaletteList",
  }
);

const AppContainer = createAppContainer(RootStack);

export default RootStack;
