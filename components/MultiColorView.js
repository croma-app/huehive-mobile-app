import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function MultiColorView(props) {
  const { colors } = props;

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
      {colors.map((item, index) => (
        <View
          style={[styles.color, { backgroundColor: item.color }]}
          key={`${item.color}-${index}`}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  palette: {
    alignItems: 'stretch',
    flexDirection: 'row',
    height: 45,
    overflow: 'hidden',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4
  },
  color: {
    flex: 1,
    marginStart: -1
  },
  emptyContainer: {
    height: 45,
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
