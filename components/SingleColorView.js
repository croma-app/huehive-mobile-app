import * as React from 'react';
import { Platform, StyleSheet, Text, Clipboard, TouchableOpacity, View } from 'react-native';
import { notifyMessage } from '../libs/Helpers';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function getContrastColor(bgColor) {
  var color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? 'black' : 'white';
}

export const SingleColorView = ({ color, onColorChange, drag }) => {
  const handlePress = () => {
    if (Platform?.OS === 'android' || Platform.OS === 'ios') {
      notifyMessage(color.color + ' copied to clipboard!');
    }
    Clipboard.setString(color.color);
  };

  const textColor = getContrastColor(color.color);

  return (
    <TouchableOpacity
      onPress={handlePress}
      //onPressIn={drag}
      onLongPress={drag}
      style={[styles.container, { backgroundColor: color.color }]}>
      <Text style={[styles.colorText, { color: textColor }]}>
        {color.color.toUpperCase() + (color.name ? ' (' + color.name + ')' : '')}
      </Text>
      <View style={styles.actionArea}>
        <TouchableOpacity
          style={styles.actionAreaItem}
          onPress={() => {
            onColorChange({ ...color, color: color.color, locked: !color.locked });
          }}>
          <FontAwesome5
            style={[styles.icon, { color: textColor }]}
            name={color.locked ? 'lock' : 'unlock'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionAreaItem} onPressIn={drag}>
          <MaterialIcons style={[styles.icon, { color: textColor }]} name="drag-indicator" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    //justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row'
  },
  colorText: {
    fontWeight: '700',
    paddingLeft: 16,
    paddingRight: 8
  },
  actionArea: {
    position: 'absolute',
    right: 0,
    padding: 8,
    flex: 1,
    flexDirection: 'row'
  },
  icon: {
    fontSize: 24
  },
  actionAreaItem: {
    marginRight: 8,
    marginLeft: 8
  }
});
