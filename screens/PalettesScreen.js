import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from 'pigment/full';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { logEvent } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import { useNavigation } from '@react-navigation/native';

function PalettesScreen() {
  const { detailedColor } = useApplicationStore();
  const navigation = useNavigation();

  const parseCamelCase = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const fullColor = new Color(detailedColor);
  let items = [];
  for (const i in fullColor) {
    if (/.*scheme$/i.test(i) && typeof fullColor[i] === 'function') {
      let colors = [];
      const paletteColors = fullColor[i]();
      paletteColors.forEach((c) => colors.push({ color: c.tohex() }));
      items.push(
        <PalettePreviewCard
          onPress={() => {
            navigation.navigate('ColorList', { colors: colors });
          }}
          key={i.toString()}
          colors={colors}
          name={parseCamelCase(i.toString())}
        />
      );
    }
  }

  useEffect(() => {
    logEvent('palettes_screen');
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {items}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 12,
    paddingRight: 12
  }
});

const Tab = createBottomTabNavigator();

export default function PalettesTabNavigator() {
  const { detailedColor } = useApplicationStore();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ title: detailedColor });
  }, [detailedColor, navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Color Theory') {
            iconName = 'color-palette';
          } else if (route.name === 'AI') {
            iconName = 'construct';
          }

          return (
            <Icon
              name={iconName}
              size={size}
              color={focused ? '#007AFF' : color} // Highlight the selected tab
              style={{
                shadowColor: focused ? '#007AFF' : '#000',
                shadowOpacity: 0.2,
                shadowRadius: 10
              }}
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#ffffff', // Bright background color
          borderTopWidth: 0, // Remove the top border for a seamless look
          elevation: 10, // Add elevation for Android shadow
          shadowColor: '#000', // Shadow color
          shadowOffset: { width: 0, height: 5 }, // Shadow position
          shadowOpacity: 0.1, // Shadow transparency
          shadowRadius: 10, // Shadow blur
          paddingBottom: 10, // Extra padding at the bottom for a more balanced look
          paddingTop: 10, // Extra padding at the top
          height: 60 // Increase height for better touch targets
        },
        tabBarActiveTintColor: '#007AFF', // Active tab color (blue)
        tabBarInactiveTintColor: '#8e8e93', // Inactive tab color (gray)
        tabBarLabelStyle: {
          fontSize: 12, // Slightly larger font size for better readability
          fontWeight: '600' // Bold text for the labels
        }
      })}>
      <Tab.Screen name="Color Theory" component={PalettesScreen} />
      <Tab.Screen name="AI" component={PalettesScreen} />
    </Tab.Navigator>
  );
}
