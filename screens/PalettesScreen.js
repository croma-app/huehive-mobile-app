import React, { useEffect, useLayoutEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from 'pigment/full';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { logEvent } from '../libs/Helpers';
import useApplicationStore from '../hooks/useApplicationStore';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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

function PalettesScreenAI() {
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
          if (route.name === 'Color Theory') {
            return (
              <Icon
                name="color-palette"
                size={size}
                color={focused ? Colors.primary : color} // Highlight the selected tab
                style={{
                  shadowColor: focused ? Colors.primary : '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 10
                }}
              />
            );
          } else if (route.name === 'AI') {
            return (
              <FontAwesome
                name="magic"
                size={size}
                color={focused ? Colors.primary : color} // Highlight the selected tab
                style={{
                  shadowColor: focused ? Colors.primary : '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 10
                }}
              />
            );
          }
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          paddingBottom: 10,
          paddingTop: 10,
          height: 60
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarLabelStyle: {
          fontSize: 12, // Slightly larger font size for better readability
          fontWeight: '600' // Bold text for the labels
        }
      })}>
      <Tab.Screen name="Color Theory" component={PalettesScreen} />
      <Tab.Screen name="AI" component={PalettesScreenAI} />
    </Tab.Navigator>
  );
}
