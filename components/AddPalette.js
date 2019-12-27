import React from "react";
import CromaButton from './CromaButton';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
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
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
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
}

const styles = StyleSheet.create({
  buttonPro: {
    backgroundColor: "#f1544d",
  }
});
