import React from "react";
import CromaButton from './CromaButton';
import {
  View,
  Alert,
  StyleSheet,
} from "react-native";

export class AddPalette extends React.Component {
  render() {
    return (
      <View>
        <CromaButton
          onPress={() => this.props.navigation.navigate("ColorPicker")}
        >
           GET PALETTE FROM IMAGE 
        </CromaButton>
        <CromaButton
          onPress={() => Alert.alert("GET PALETTE FROM COLOR")}
        >
           GET PALETTE FROM COLOR 
        </CromaButton>
        <CromaButton
          onPress={() => Alert.alert("ADD COLORS MANUALLY")}
        >
           ADD COLORS MANUALLY 
        </CromaButton>

        <CromaButton
          style={styles.buttonPro}
          onPress={() => Alert.alert("UNLOCK PRO")}
        >
           UNLOCK PRO 
        </CromaButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d",
  }
});
