import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import ColorDetailsScreen from '../screens/ColorDetailScreen'
import ColorPickerScreen from '../screens/ColorPickerScreen'
import PalettesScreen from '../screens/PalettesScreen';
import AddPaletteScreen from '../screens/AddPaletteScreen';
import ColorListScreen from '../screens/ColorListScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    ColorDetails: ColorDetailsScreen,
    ColorPicker: ColorPickerScreen,
    Palettes: PalettesScreen,
    AddPalette: AddPaletteScreen,
    ColorList: ColorListScreen,
  },
  {
    initialRouteName: 'AddPalette',
  }
);

const AppContainer = createAppContainer(RootStack);

export default RootStack;
