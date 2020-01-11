import React from "react";
import CromaButton from "./CromaButton";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import ColorPicker from "../libs/ColorPicker";
import Jimp from "jimp";
import { View, Alert, StyleSheet, ActivityIndicator } from "react-native";

export class AddPalette extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
  }

  render() {
    return (
      <View>
        {this.state.loading ? (
          <ActivityIndicator></ActivityIndicator>
        ) : (
          <View></View>
        )}
        <CromaButton
          onPress={() => {
            this.setState({ loading: true });
            this._pickImage().then((image, err) => {
              // TODO: handle err
              this.setState({ loading: false });
              this.props.navigation.navigate("ColorList", {
                colors: ColorPicker.getProminentColors(image)
              });
            });
          }}
        >
          GET PALETTE FROM IMAGE
        </CromaButton>
        <CromaButton
          onPress={() => this.props.navigation.navigate("ColorPicker")}
        >
          GET PALETTE FROM COLOR
        </CromaButton>
        <CromaButton
          onPress={() => this.props.navigation.navigate("AddPaletteManually")}
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

  componentDidMount() {
    this.getPermissionAsync();
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true
    });
    // console.log("Result: " + JSON.stringify(result));
    if (result.base64 !== undefined) {
      return await Jimp.read(new Buffer(result.base64, "base64"));
    } else {
      return await Jimp.read(result.uri);
    }
  };
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d"
  }
});
