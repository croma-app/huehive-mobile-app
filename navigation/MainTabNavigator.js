import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import ColorDetailsScreen from '../screens/ColorDetailScreen'
import ColorPickerScreen from '../screens/ColorPickerScreen'
import PalettesScreen from '../screens/PalettesScreen';
import AddPaletteScreen from '../screens/AddPaletteScreen';
import ColorListScreen from '../screens/ColorListScreen';
import PaletteListScreen from '../screens/PaletteListScreen'
import Colors from '../constants/Colors'

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
    ColorList: ColorListScreen,
    PaletteList: PaletteListScreen
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
