import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import {Permissions} from 'expo';
import Utils from '../libs/Utils';

export default class PickColorScreen extends React.Component {
  // TODO: make this a class component to make it work with ref.
  // implementation with class component
  // https://github.com/foysalit/rn-tutorial-vedo/blob/master/src/camera.page.js
  camera = null;
  constructor(props) {
    super(props);
    this.state = {
      captures: [],
      capturing: null,
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.back,
      pickedColors: [],
      widthCamera: null,
      heightCamera: null,
    }
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
      <View onLayout={(event) => this.onLayout(event)} style={{ flex: 1 }}>
        
        <Camera style={{ flex: 1 }} type={this.state.cameraType} ref={camera => this.camera = camera}>
        <TouchableOpacity  style={[{backgroundColor: 'transparent'}, {
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }]} onPress={(event) => {
                console.log(event.nativeEvent.layout);
                let x = event.nativeEvent.locationX;
                let y = event.nativeEvent.locationY;
                let height = this.state.heightCamera;
                let width = this.state.widthCamera;
                console.log(x, y, width, height);
                this.camera.takePictureAsync({ base64: true, onPictureSaved: (photoData) => {
                  //console.log("pic taken:", photoData) 
                  Jimp.read(new Buffer(photoData.base64, "base64"))
                  .then(image => {
                      image.resize(width, height);
                      let intColor = image.getPixelColor(x, y);
                      this.state.pickedColors.push(Utils.toHexColor(intColor));
                      console.log("picked color: " + Utils.toHexColor(intColor));
                  });
                }});
                console.log(`x coord = ${event.nativeEvent.locationX + "," + event.nativeEvent.locationY}`);
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

  onLayout(event) {
    console.log(event.nativeEvent.layout);
    this.setState({
      widthCamera: event.nativeEvent.layout.width,
      heightCamera: event.nativeEvent.layout.height,
    });
  }
}
