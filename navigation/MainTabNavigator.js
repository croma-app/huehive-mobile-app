import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ColorDetailsScreen from '../screens/ColorDetailScreen'
import ColorPickerScreen from '../screens/ColorPickerScreen'
import SettingsScreen from '../screens/SettingsScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});
const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    ColorDetails: ColorDetailsScreen,
    ColorPicker: ColorPickerScreen,
  },
  {
    initialRouteName: 'ColorPicker',
  }
);

const AppContainer = createAppContainer(RootStack);

export default RootStack;
