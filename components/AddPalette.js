import React from "react";
import CromaButton from './CromaButton';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Jimp from 'jimp';
import {
  View,
  Alert,
  StyleSheet,
} from "react-native";

export class AddPalette extends React.Component {
  componentDidMount() {
    this.getPermissionAsync();
    console.log('hi');
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1, 
      base64: true,
    });

    //console.log("image" + result, "base64", result.base64);
    Jimp.read(new Buffer(result.base64, 'base64'))
    .then(image => {
      console.log("image: " + image);
      image.resize(100, 100, Jimp.AUTO);
      console.log(Object.getOwnPropertyNames(image).filter(item => typeof image[item] === 'function'))
      //image.getPixelColor(x, y);
      //console.log(image[0][0]);
      this.props.navigation.navigate("ColorList", {colors: this._getProminentColors(image)}); 
    })
    .catch(err => {
      console.log("Error: " + JSON.stringify(err)); // TODO: add toast here 
    // Handle an exception.
    });

    
  };
  render() {
    return (
      <View>
        <CromaButton
          onPress={() => {
            this._pickImage();
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


  _getProminentColors(image) {
    // image.bitmap.width
    // image.bitmap.height
    // image.bitmap.data
    return [{color: "#112233"}, {color: "#554433"}, {color: "#cccccc"}];
  }
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d",
  }
});
