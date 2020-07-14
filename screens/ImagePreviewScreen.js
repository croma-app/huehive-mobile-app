import React from "react";
import { ScrollView, Image, View,  StyleSheet, NativeModules, Dimensions } from "react-native";
import CromaButton from "../components/CromaButton";
import {getImageBitmap} from "../libs/Helpers";
import Jimp from "jimp";
import Color from "pigment/full";
import Touchable from "react-native-platform-touchable";


const _toHexColor = function (intColor) {
  let rgba = Jimp.intToRGBA(intColor); // TODO: Need to optimize this once everything else starts working.
  let color = new Color(
    "rgb(" + rgba.r + ", " + rgba.g + ", " + rgba.b + ")"
  );
  return color.tohex();
}

export default function ImagePreviewScreen(props) {
  const image = props.navigation.getParam('image');
  const [pickedColors, setPickedColors] = React.useState(null);
  const [pickedBgColor, setPickedBgColor] = React.useState('#ffffff')
  const [imageBitmap, setImageBitmap] = React.useState(null)
  const img = React.useRef(null);
  const dimensions = Dimensions.get('window');

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
    getImageBitmap(image.uri, dimensions.width, dimensions.height - 200, (err, bitmap) => {
      setImageBitmap(JSON.parse(bitmap));
    })
  }, [image])

  const onImageClick =  (e) => {
    const x = parseInt(e.nativeEvent.locationX);
    const y = parseInt(e.nativeEvent.locationY);
    const hex = _toHexColor(imageBitmap[x][y])
    setPickedBgColor(hex);
  };

  return (
    <ScrollView style={styles.listview} showsVerticalScrollIndicator={false}>
      <View style={{ height: 100, backgroundColor: pickedBgColor, width: 100 }}>

      </View>
      <Touchable onPress={onImageClick}>
        <Image
          ref={img}
          style={{ width: dimensions.width, height: dimensions.height - 200 }}
          source={
            {
              uri: image.uri
            }
          }
        >
        </Image>
      </Touchable>
      <CromaButton
        onPress={() =>
          props.navigation.navigate("ColorList", pickedColors)
        }
      >
        {pickedColors && 'SAVE'}
      </CromaButton>
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
  listview: {
    margin: 8
  }
});
