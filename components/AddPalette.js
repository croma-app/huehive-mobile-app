import React from "react";
import CromaButton from './CromaButton';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import kmeans from 'ml-kmeans';
import Jimp from 'jimp';
import Color from 'pigment/full';

import {
  View,
  Alert,
  StyleSheet,
  Image,
} from "react-native";

export class AddPalette extends React.Component {
  
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
        <Image
          style={{width: 50, height: 50}}
          source={{uri: 'https://facebook.github.io/react-native/img/tiny_logo.png'}}
        />
      </View>
    );
  }

  componentDidMount() {
    this.getPermissionAsync();
    //console.log('hi');
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
   // console.log("Result: " + JSON.stringify(result));
   if (result.base64 !== undefined) {
    Jimp.read(new Buffer(result.base64, "base64"))
    .then(image => {
      this.props.navigation.navigate("ColorList", {colors: this._getProminentColors(image)}); 
    })
    .catch(err => {
      console.log("Error: " + JSON.stringify(err)); // TODO: add toast here 
    // Handle an exception.
    });
   } else {
    Jimp.read(result.uri)
      .then(image => {
        this.props.navigation.navigate("ColorList", {colors: this._getProminentColors(image)}); 
      })
      .catch(err => {
        console.log("Error: " + JSON.stringify(err)); // TODO: add toast here 
      // Handle an exception.
      });
  }

    
  };


  _getProminentColors(image) {
    console.log("image: " + image);
    /*
    Jimp.RESIZE_NEAREST_NEIGHBOR;
    Jimp.RESIZE_BILINEAR;
    Jimp.RESIZE_BICUBIC;
    Jimp.RESIZE_HERMITE;
    Jimp.RESIZE_BEZIER;
    These does not work with first params.
    */
    image.resize(Jimp.AUTO, 100);
    let data = this._prepareDataForKmeans(image);
    let time = Date.now()
    let ans = kmeans(data, 24, { initialization: 'random', maxIterations: 20 });
    console.log(JSON.stringify(ans) + "," + (Date.now() - time) + " ms");
    ans.centroids = ans.centroids.sort((c1, c2) => c2.size - c1.size);

    console.log(ans.centroids);
    return ans.centroids.map(centroid => {return {color: this._xyzToHex(centroid.centroid)}});
  }

  _xyzToHex(xyz) {
    let color = new Color("lab(" + xyz[0] + ", " + xyz[1] + ", " + xyz[2] +  ")");
    console.log("color===========" + color.tohex());
    return color.tohex();
  }

  _prepareDataForKmeans(image) {
    let data = [];
    
    console.log("image============", image.bitmap.width, image.bitmap.height);
    for (let i = 0; i < image.bitmap.width; i++) {
      for (let j = 0; j < image.bitmap.height; j++) {
        let intColor = image.getPixelColor(i, j);
        let hex = this._toHexColor(intColor);
        console.log("hex:", hex);
        let color = new Color(hex);
        let xyz = color.tolab();
        // format: "xyz(19.78527130484015, 8.600439447528947, 95.19796416837329)" to double array of xyz
        xyz = xyz.substr(4, xyz.length - 5).split(", ").map(v => parseFloat(v))
        data.push(xyz);
      } 
    }
    // console.log("returning data: " + JSON.stringify(data));
    return data;
  }

  _toHexColor(intColor) {
    let rgba = Jimp.intToRGBA(intColor); // TODO: Need to optimize this once everything else starts working.
    let color = new Color("rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")");
    return color.tohex();
  }
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d",
  }
});
