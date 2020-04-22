import * as React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import Card from "./Card";
import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";

export default class SingleColorCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { animationType: 'fadeInLeftBig' };
  }
  render() { 
    return (
      <Card {...this.props} animationType={this.state.animationType}>
        <View>
          <View
            style={{ backgroundColor: this.props.color, height: 100 }}
          ></View>
          <View style={styles.bottom}> 
            <Text style={styles.label}>{this.props.color}</Text>
            <View style={styles.actionButtonsView}>
              <Touchable
                {...{
                  [Platform.OS === 'web' ? 'onClick' : 'onPress']: event => {
                    event.preventDefault();
                    event.stopPropagation();
                    this.setState({animationType: 'fadeOutRightBig'})
                    setTimeout(() => {
                      this.props.colorDeleteFromPalette();
                    }, 400)
                  }
                }}
                style={styles.actionButton}
              >
                <FontAwesome size={20} name="trash" />
              </Touchable>
            </View>
          </View>
        </View>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 54
  },
  actionButtonsView: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  actionButton: {
    paddingRight: 16
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    fontWeight: "500",
    color: Colors.darkGrey
  }
});
