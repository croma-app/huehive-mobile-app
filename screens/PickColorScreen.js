import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import {Permissions} from 'expo';

export default class PickColorScreen extends React.Component {
  // TODO: make this a class component to make it work with ref.
  // implementation with class component
  // https://github.com/foysalit/rn-tutorial-vedo/blob/master/src/camera.page.js
  camera = null;

  state = {
      captures: [],
      capturing: null,
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    const camera = await Camera.requestPermissionsAsync();
    const hasCameraPermission = (camera.status === 'granted');

    this.setState({ hasCameraPermission });
  };
 
  render() {
    const { hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied.</Text>;
    }
    return ( 
      <View style={{ flex: 1 }}>
        
        <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={camera => this.camera = camera}>
        <TouchableOpacity style={[{backgroundColor: 'transparent'}, {
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }]} onPress={(evt) => {
                this.camera.takePictureAsync({ onPictureSaved: (photoData) => console.log("pic taken:", photoData) });
                console.log(`x coord = ${evt.nativeEvent.locationX + "," + evt.nativeEvent.locationY}`);
              }}>
          
          
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
            </TouchableOpacity>
          
          </TouchableOpacity>
        </Camera>
      
      </View>
    
    );
  }
}
