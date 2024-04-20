import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Color from 'pigment/full';
const colors = [
  '#f50057',
  '#db0A5b',
  '#c51162',
  '#9c27b0',
  '#673ab7',
  '#4b77be',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#1bbc9b',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
  '#f44336',
  '#e00032'
];
const fixedColors = [
  '#000000',
  '#ff0000',
  '#ffa500',
  '#ffff00',
  '#00ff00',
  '#00ffff',
  '#0000ff',
  '#ff00ff',
  '#00ffa5',
  '#ffffff'
].sort();
const colorsRow1 = colors.slice(0, 10);
const colorsRow2 = colors.slice(10, 20);
function CromaColorPicker(props) {
  const [primarySelectedColor, setPrimarySelectedColor] = useState('#db0a5b');
  const [selectedColor, _setSelectedColor] = useState('#db0A5b');

  const setSelectedColor = (color) => {
    if (props.onChangeColor && color !== selectedColor) {
      props.onChangeColor(color);
    }
    _setSelectedColor(color);
  };
  function renderShades(h) {
    let w = 100,
      b;
    let colors = [];

    for (let i = 0; i < 8; i++) {
      b = 10;
      let rows = [];
      for (let j = 0; j < 10; j++) {
        let color = new Color(`hsl(${h},${w},${b})`).tohex();
        rows.push(color);
        b += 9;
      }
      colors.push(rows);

      w -= 12;
    }

    return colors.map((row) => (
      <View key={row} style={styles.shadesView}>
        {row.map((color) => (
          <ColorBox
            key={color}
            style={[styles.shadesColorBox]}
            onPress={() => setSelectedColor(color)}
            color={color}
          />
        ))}
      </View>
    ));
  }
  return (
    <View props={props} style={[...props.style]}>
      <View style={styles.primaryColorsView}>
        {colorsRow1.map((color) => (
          <ColorBox
            key={color}
            onPress={() => {
              setPrimarySelectedColor(color);
              setSelectedColor(color);
            }}
            color={color}
            style={[styles.primaryColorBox]}
          />
        ))}
      </View>
      <View style={styles.primaryColorsView}>
        {colorsRow2.map((color) => (
          <ColorBox
            key={color}
            onPress={() => {
              setPrimarySelectedColor(color);
              setSelectedColor(color);
            }}
            color={color}
            style={[styles.primaryColorBox]}
          />
        ))}
      </View>

      {renderShades(new Color(primarySelectedColor).hsl[0])}
      <View style={styles.fixedColorView}>
        {fixedColors.map((color) => (
          <ColorBox
            key={color}
            style={styles.fixedColorBox}
            onPress={() => {
              setSelectedColor(color);
            }}
            color={color}
          />
        ))}
      </View>
    </View>
  );
}
function ColorBox(props) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      props={props}
      style={[props.style, styles.colorBox, { backgroundColor: props.color }]}>
      <View />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryColorsView: {
    flex: 1,
    flexDirection: 'row'
  },
  shadesView: {
    flex: 1,
    flexDirection: 'row'
  },
  selectedColorView: {
    marginTop: 10,
    flexDirection: 'row',
    flex: 2
  },
  colorBox: {
    flex: 1
  },
  primaryColorBox: {
    marginLeft: -1,
    marginTop: -1
  },
  shadesColorBox: {
    marginLeft: -1,
    marginTop: -1
  },
  selectedColor: {
    width: '50%'
  },
  input: {
    width: '50%',
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  fixedColorView: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    marginLeft: -1
  }
});
export { CromaColorPicker };
