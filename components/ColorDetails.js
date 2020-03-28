import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Clipboard,
  Platform,
  ToastAndroid
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import Touchable from "react-native-platform-touchable";

import Color from "pigment/full";

export function ColorDetail(props) {
  const [copyiedIndex, setCopyiedIntex] = useState(-1);
  const styles = StyleSheet.create({
    backgroundColor: {
      backgroundColor: props.color,
      height: 112,
      alignSelf: "stretch"
    },
    info: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 10
    },
    colorNameText: {
      fontSize: 16,
      fontWeight: "500"
    }
  });
  const color = new Color(props.color);
  let items = [
    { key: "HEX", value: color.tohex() },
    { key: "RGB", value: color.torgb() },
    { key: "HSL", value: color.tohsl() },
    { key: "HSV", value: color.tohsv() },
    { key: "HWB", value: color.tohwb() },
    { key: "CMYK", value: color.tocmyk() },
    { key: "CIELAB", value: color.tolab() },
    { key: "Luminance", value: (color.luminance() * 100).toFixed(2) + "%" },
    { key: "Darkness", value: (color.darkness() * 100).toFixed(2) + "%" }
  ];

  const debounce = (func, delay) => {
    let debounceTimer;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };
  const debouncedSetCopiedIndex = debounce(() => setCopyiedIntex(-1), 2000);

  let writeToClipboard = function(value, index) {
    if (Platform.OS === "android") {
      ToastAndroid.show("Text copied to clipboard!", ToastAndroid.LONG);
    }
    Clipboard.setString(value);
    setCopyiedIntex(index);
    debouncedSetCopiedIndex();
  };
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 8,
        backgroundColor: "#fff"
      }}
    >
      <View style={[styles.backgroundColor]}></View>
      {/* <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} >{props.color}</Text> */}
      <View style={{ marginTop: 20 }}>
        {items.map((item, index) => (
          <Touchable
            key={item.key}
            onPress={() => writeToClipboard(item.value, index)}
          >
            <View style={styles.info}>
              <Text style={styles.colorNameText}>{item.key} : </Text>

              <Text>{item.value}</Text>
              {index === copyiedIndex && Platform.OS === "web" && (
                <Text
                  style={{
                    position: "absolute",
                    backgroundColor: "rgb(64, 64, 58)",
                    top: "-25px",
                    right: "-10px",
                    color: "#fff",
                    padding: "5px",
                    textAlign: "center",
                    borderRadius: "6px"
                  }}
                >
                  Copied!
                </Text>
              )}
              <FontAwesome name="copy" />
            </View>
          </Touchable>
        ))}
      </View>
    </View>
  );
}
