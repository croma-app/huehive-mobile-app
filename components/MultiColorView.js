/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { pickTextColorBasedOnBgColor } from '../libs/ColorHelper';

export default function MultiColorView(props) {
  const { colors, selectedColor, setSelectedColor } = props;
  // Create animated values for height and width
  const heightAnim = useRef(new Animated.Value(10)).current;
  const widthAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    // Animate the height and width from 1 to 10 over 500ms
    Animated.timing(heightAnim, {
      delay: 500,
      toValue: 15,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false // Set to true if you don't need layout updates
    }).start();

    Animated.timing(widthAnim, {
      delay: 500,
      toValue: 15,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false // Set to true if you don't need layout updates
    }).start();
  }, [heightAnim, widthAnim]);

  if (!colors || colors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Empty Palette</Text>
        <Text style={styles.emptyMessage}>
          You can edit this palette from main screen to add colors.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.palette}>
      {colors.map((item, index) => {
        return setSelectedColor ? (
          <TouchableOpacity
            key={`${item.color}-${index}`}
            onPress={() => {
              setSelectedColor(index);
            }}
            style={[styles.color, { backgroundColor: item.color }]}>
            {selectedColor === index && (
              <Animated.View
                style={{
                  height: heightAnim,
                  width: widthAnim,
                  borderRadius: 10,
                  backgroundColor: pickTextColorBasedOnBgColor(item.color)
                }}
              />
            )}
          </TouchableOpacity>
        ) : (
          <View
            key={`${item.color}-${index}`}
            style={[styles.color, { backgroundColor: item.color }]}></View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  palette: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 60,
    overflow: 'hidden',
    borderRadius: 4
  },
  color: {
    flex: 1,
    marginStart: -1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingHorizontal: 16
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8
  },
  emptyMessage: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center'
  }
});
