import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import Card from "./Card";
import Colors from "../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Touchable from "react-native-platform-touchable";

export default class SingleColorCard extends React.Component {
  render() {
    return (
      <Card {...this.props}>
        <View>
          <View
            style={{ backgroundColor: this.props.color, height: 100 }}
          ></View>
          <View style={styles.bottom}>
            <Text style={styles.label}>{this.props.color}</Text>
            <View style={styles.actionButtonsView}>
              <Touchable onPress={this.props.colorDeleteFromPalette} style={styles.actionButton}>
                <FontAwesomeIcon icon={faTrashAlt} />
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
