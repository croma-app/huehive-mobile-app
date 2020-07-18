import React from "react";
import { ScrollView, Image, View,  StyleSheet, NativeModules, Dimensions } from "react-native";
import CromaButton from "../components/CromaButton";
import {getImageBitmap} from "../libs/Helpers";
import Color from "pigment/full";
import Touchable from "react-native-platform-touchable";
import { bitmap } from "jimp";


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


export default function ImagePreviewScreen(props) {
  const image = props.navigation.getParam('image');
  const [pickedColors, setPickedColors] = React.useState(null);
  const [pickedBgColor, setPickedBgColor] = React.useState([])
  const [imageBitmap, setImageBitmap] = React.useState(null)
  const img = React.useRef(null);
  const dimensions = Dimensions.get('window');
  const imageWidth = dimensions.width - 16
  const imageHeight = dimensions.height - 100
  React.useEffect(() => {
    NativeModules.CromaModule.pickTopColorsFromImage(image.uri, (err, pickedColors) => {
      if (err) {
        ToastAndroid.show("Error while processing image: " + err, ToastAndroid.LONG);
      } else {
        console.log("Picked colors: ", pickedColors);
        setPickedColors(JSON.parse(pickedColors));
        //props.navigation.navigate("ColorList", JSON.parse(pickedColors));
      }
    });
    getImageBitmap(image.uri, 100, 120, (err, bitmap) => {
      setImageBitmap(JSON.parse(bitmap));
    })
  }, [image])

  const onImageClick =  (e) => {
    const x = parseInt(e.nativeEvent.locationX);
    const y = parseInt(e.nativeEvent.locationY);
    const hex = _toHexColor(imageBitmap[x][y])
    pickedBgColor.push([x, y, hex])
    setPickedBgColor([...pickedBgColor]);
  };

  return (
    <View style={styles.listview} showsVerticalScrollIndicator={false}>
      {/* <Touchable onPress={onImageClick}>
        {<Image
          ref={img}
          style={{ width: imageWidth, height: imageHeight }}
          source={
            {
              uri: image.uri
            }
          }
        >
        </Image> }
      </Touchable> */}
      {
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
      }
{/*       
      <CromaButton
        onPress={() =>
          props.navigation.navigate("ColorList", pickedColors)
        }
      >
        {pickedColors && 'SAVE'}
      </CromaButton> */}
    </View>
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
  listview: {
    margin: 8
  }
});
