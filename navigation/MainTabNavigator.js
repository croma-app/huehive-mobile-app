import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import ColorDetailsScreen from '../screens/ColorDetailScreen'
import ColorPickerScreen from '../screens/ColorPickerScreen'
import PalettesScreen from '../screens/PalettesScreen';
import AddPaletteScreen from '../screens/AddPaletteScreen';
import SavePaletteScreen from '../screens/SavePaletteScreen';
import ColorListScreen from '../screens/ColorListScreen';
import PaletteScreen from '../screens/PaletteScreen';
import HomeScreen from '../screens/HomeScreen'
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
    SavePalette: SavePaletteScreen,
    ColorList: ColorListScreen,
    Palette: PaletteScreen,
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
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
