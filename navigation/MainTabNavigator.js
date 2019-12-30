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
import PickColorSceen from '../screens/PickColorScreen';
import Colors from '../constants/Colors'

const RootStack = createStackNavigator(
  {
    ColorDetails: ColorDetailsScreen,
    ColorPicker: ColorPickerScreen,
    Palettes: PalettesScreen,
    AddPalette: AddPaletteScreen,
    AddPaletteManually: AddPaletteManuallyScreen,
    ColorList: ColorListScreen,
    PaletteList: PaletteListScreen,
    PickColor: PickColorSceen
  },
  {
    initialRouteName: 'PaletteList',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: '#fff',
    },
  }
);

const AppContainer = createAppContainer(RootStack);

export default RootStack;
