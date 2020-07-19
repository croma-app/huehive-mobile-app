import React from "react";
import { ScrollView, Image, View,  StyleSheet, NativeModules, Dimensions } from "react-native";
import CromaButton from "../components/CromaButton";
import {getImageBitmap} from "../libs/Helpers";
import Color from "pigment/full";
import Touchable from "react-native-platform-touchable";
import { bitmap } from "jimp";
import { HORIZONTAL_ALIGN_CENTER } from "jimp";


const _toHexColor = function (intColor) {
  let rgba = getRGB(intColor); // TODO: Need to optimize this once everything else starts working.
  let color = new Color(
    "rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")"
  );
  return color.tohex();
}

const getRGB = function(intColor) {
  return {
    b: intColor & 0X000000FF,
    g: (intColor & 0X0000FF00) >> 8,
    r: (intColor & 0X00FF0000) >> 16
  }
}

const dimensions = Dimensions.get('window');
export default function ImagePreviewScreen(props) {
  const image = props.navigation.getParam('image');
  const [defaultPickedColors, setDefaultPickedColors] = React.useState(null);
  const [pickedColors, setPickedColor] = React.useState([])
  const [imageBitmap, setImageBitmap] = React.useState(null)
  const img = React.useRef(null);
  const imageWidth = dimensions.width 
  const imageHeight = dimensions.height - 95
  React.useEffect(() => {
    NativeModules.CromaModule.pickTopColorsFromImage(image.uri, (err, pickedColors) => {
      if (err) {
        ToastAndroid.show("Error while processing image: " + err, ToastAndroid.LONG);
      } else {
        console.log("Picked colors: ", pickedColors);
        setDefaultPickedColors(JSON.parse(pickedColors));
        //props.navigation.navigate("ColorList", JSON.parse(pickedColors));
      }
    });
    getImageBitmap(image.uri, imageWidth, imageHeight, (err, bitmap) => {
      setImageBitmap(JSON.parse(bitmap));
    })
  }, [image])

  const onImageClick =  (e) => {
    const x = parseInt(e.nativeEvent.locationX);
    const y = parseInt(e.nativeEvent.locationY);
    const hex = _toHexColor(imageBitmap[x][y])
    pickedColors.push([x, y, hex])
    setPickedColor([...pickedColors]);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Touchable onPress={onImageClick}>
        <Image
          ref={img}
          style={{ width: imageWidth, height: imageHeight }}
          source={
            {
              uri: image.uri
            }
          }
        >
        </Image> 
      </Touchable>
      {/* {
        // <-- code for check bitmap image --> 
        imageBitmap  && imageBitmap.map((color, i)=>{
          return color.map((pixel, j)=>{
            return <View style={{ 
              position: 'absolute',
              left: i,
              top: j,
              height: 1,
              backgroundColor: _toHexColor(imageBitmap[i][j]),
              width: 1,
            }} >

            </View>
          }) 
        })
      } */}
      {pickedColors.length > 0 && pickedColors.map((colorData)=> {
        return <View style={{ 
          position: 'absolute',
          left: colorData[0],
          top: colorData[1],
          height: 30,
          backgroundColor: colorData[2],
          width: 30,
          borderStyle: 'solid',
          borderColor: '#fff',
          borderRadius: 100,
          borderWidth: 2
        }} >

        </View>
      })}
      <View style={styles.doneButton}>
        <Touchable onPress={() =>{
            defaultPickedColors.colors = uniqueColors([...defaultPickedColors.colors, 
              ...pickedColors.map((colorData)=> ({color: colorData[2]}))
            ]) 
            props.navigation.navigate("ColorList", defaultPickedColors)
          }
        }>
          <View style={styles.doneImage}>
            <Image
              source={require('../assets/images/done.png')}
              style={{
                height: 40,
                width: 40
              }}
            />
          </View>
        </Touchable>
      </View>
    </ScrollView>
  );
}
function uniqueColors(colors) {
  let set = new Set();
  let uniqueColors = [];
  colors.forEach(color => {
    if (!set.has(color.color)) {
      uniqueColors.push(color);
    }
    set.add(color.color);
  });
  return uniqueColors;
}

ImagePreviewScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  doneButton: {
    height: 95,
    width: dimensions.width,
    backgroundColor: '#222222',
    padding: 20,
    alignItems: "center"
  },
  doneImage: {
    height: 55,
    width: 55,
    backgroundColor: '#00f5ab',
    padding: 8,
    borderRadius: 100,
  }
});
