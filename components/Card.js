import * as React from "react";
import * as Animatable from 'react-native-animatable';
import { StyleSheet, Platform, View } from "react-native";
import Colors from "../constants/Colors";
import Touchable from "react-native-platform-touchable";

export default class Card extends React.Component {
  render() {
    return (
      <Animatable.View animation={this.props.animationType} duration={500} useNativeDriver={true}>
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
          style={[styles.inner, Platform.OS === 'web' ? { boxShadow: '0px 1px 4px #888888' } : {}]}
        >
          <View {...this.props}>{this.props.children}</View>
        </Touchable>
      </Animatable.View>
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
