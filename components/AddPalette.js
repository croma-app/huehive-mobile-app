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
} from "react-native";

export class AddPalette extends React.Component {
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
    
    let data = this._prepareDataForKmeans(image);
    let time = Date.now()
    let ans = kmeans(data, 20, { initialization: 'random' });
    console.log(JSON.stringify(ans) + "," + (Date.now() - time) + " ms");
    ans.centroids = ans.centroids.sort((c1, c2) => c2.size - c1.size);

    console.log(ans.centroids);
    return ans.centroids.map(centroid => {return {color: this._xyzToHex(centroid.centroid)}});
  }

  _xyzToHex(xyz) {
    let color = new Color("xyz(" + xyz[0] + ", " + xyz[1] + ", " + xyz[2] +  ")");
    console.log("color===========" + color.tohex());
    return color.tohex();
  }

  _prepareDataForKmeans(image) {
    let data = [];
    console.log("image============", image.bitmap.width, image.bitmap.height);
    for (let i = 0; i < image.bitmap.width; i++) {
      for (let j = 0; j < image.bitmap.height; j++) {
        let intColor = image.getPixelColor(i, j);
        //console.log("hex:" + this._toRgbaColor(intColor));
        let hexColor = this._toRgbaColor(intColor);
        let color = new Color(hexColor);
        let xyz = color.toxyz();
        // format: "xyz(19.78527130484015, 8.600439447528947, 95.19796416837329)" to double array of xyz
        xyz = xyz.substr(4, xyz.length - 5).split(", ").map(v => parseFloat(v))
        data.push(xyz);
        //console.log("xyz: " + xyz);
      } 
    }
    // console.log("returning data: " + JSON.stringify(data));
    return data;
  }

  _toRgbaColor(num) {
    num >>>= 0;
    var b = num & 0xFF,
        g = (num & 0xFF00) >>> 8,
        r = (num & 0xFF0000) >>> 16,
        a = ( (num & 0xFF000000) >>> 24 ) / 255 ;
    return "rgba(" + [r, g, b, a].join(",") + ")";
}
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d",
  }
});
