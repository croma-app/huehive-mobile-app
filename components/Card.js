import * as React from "react";
import { StyleSheet, Animated, Platform } from "react-native";
import Colors from "../constants/Colors";
import Touchable from "react-native-platform-touchable";
import * as Animatable from 'react-native-animatable';

export default class Card extends React.Component {
  render() {
    return (
      <Touchable
        {...(Platform.OS === "web"
          ? {
              // When scrolling the document body, the touchables might be triggered
              // see  https://github.com/necolas/react-native-web/issues/1219
              onClick: this.props.onPress
            }
          : {
              onPress: this.props.onPress
            })}
        style={[styles.inner]}
      >
        <Animatable.View animation="zoomIn" iterationCount={1} {...this.props}>{this.props.children}</Animatable.View>
      </Touchable>
    );
  }
}

const styles = StyleSheet.create({
  inner: {
    backgroundColor: Colors.white,
    marginVertical: 8,
    elevation: 1
  }
});
