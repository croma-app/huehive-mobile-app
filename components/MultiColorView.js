/* eslint-disable react/prop-types */
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { pickTextColorBasedOnBgColor } from '../libs/ColorHelper';

export default function MultiColorView(props) {
  const { colors, selectedColor, setSelectedColor } = props;

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
              <View
                style={{
                  height: 15,
                  width: 15,
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
