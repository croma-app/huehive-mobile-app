import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from 'pigment/full';
import { PalettePreviewCard } from '../components/PalettePreviewCard';
import { logEvent, notifyMessage } from '../libs/Helpers';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { generateUsingColor } from '../network/color_palette';

function PalettesScreen({ route }) {
  const hexColor = route.params.hexColor;
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

  const fullColor = new Color(hexColor);
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

function PalettesScreenAI({ route }) {
  const hexColor = route.params.hexColor;
  const [loading, setLoading] = useState(true);
  const [palettes, setPalettes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        const response = await generateUsingColor(hexColor);
        const generatedPalettes = response.data.palettes;
        setPalettes(generatedPalettes);
      } catch (error) {
        //console.error('Error fetching AI palettes:', error);
        notifyMessage("Error fetching AI palettes: " + error);
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
    logEvent('palettes_screen_ai');
  }, [hexColor]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        palettes.map((palette, index) => {
          const colors = palette.colors.map((color) => ({ color: color.hex }));
          return (
            <PalettePreviewCard
              onPress={() => {
                navigation.navigate('ColorList', { suggestedName: palette.name, colors });
              }}
              key={index.toString()}
              colors={colors}
              name={palette.name}
            />
          );
        })
      )}
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

export default function PalettesTabNavigator({ navigation, route }) {
  const hexColor = route.params.hexColor;
  useLayoutEffect(() => {
    navigation.setOptions({ title: hexColor });
  }, [hexColor, navigation]);

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
      <Tab.Screen
        name="Color Theory"
        component={PalettesScreen}
        initialParams={{ hexColor: hexColor }}
      />
      <Tab.Screen name="AI" component={PalettesScreenAI} initialParams={{ hexColor: hexColor }} />
    </Tab.Navigator>
  );
}
