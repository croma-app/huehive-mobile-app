import React from "react";
import { NativeModules } from "react-native";
import Color from "pigment/full";
import RNColorThief from "react-native-color-thief";
import { notifyMessage } from '../libs/Helpers';
import Colors from "../constants/Colors";
import ActionButtonContainer from "./ActionButton";
import { logEvent, purchase } from "../libs/Helpers";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary } from "react-native-image-picker";
import { CromaContext } from "../store/store";

const GridActionButtonAndroid = ({ navigation, setPickImageLoading }) => {
  const {
    isPro,
    setPurchase,
    setColorList,
    setColorPickerCallback,
    setDetailedColor,
    clearPalette
  } = React.useContext(CromaContext);

  const pickImageResult = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    return result;
  };
  return <ActionButtonContainer config={[[
    {
      icon:  <Ionicons
        name="md-color-filter"
        color={Colors.fabPrimary}
        size={20}
      />,
      text1: 'Create New',
      text2: 'Palette',
      onPress: () =>  {
        try {
          logEvent("hm_create_new_palette");
          clearPalette();
          navigation.navigate("AddPaletteManually");
        } catch (error) {
          notifyMessage(
            "Error  - " + error
          );
        }
      }
    },
    {
      icon: <Ionicons name="md-image" color={Colors.fabPrimary} size={20} />,
      text1: 'Get palette',
      text2: 'form image',
      onPress: async () => {
        try {
          setPickImageLoading(true);
          const image = await pickImageResult();
          logEvent("get_palette_from_image");
          // get dominant color object { r, g, b }
          const pickedColors = await RNColorThief.getPalette(image.assets[0].uri, 6, 10, false);
          console.log("Picked colors: ", pickedColors);
          clearPalette();
          setColorList(pickedColors.map(colorThiefColor => {
            //console.log("colorThiefColor: ", colorThiefColor);
            const hex = new Color("rgb(" + colorThiefColor.r + ", " + colorThiefColor.g + ", " + colorThiefColor.b + ")").tohex();
            //console.log("Hex: ", hex, colorThiefColor);
            return { color: hex };
          }));
          navigation.navigate("ColorList");
        } catch (error) {
          notifyMessage(
            "Error while extracting colors - " + error
          );
        } finally {
          setPickImageLoading(false);
        }
      }
    },
    {
      icon: <MaterialCommunityIcons
        name="palette-swatch"
        color={Colors.fabPrimary}
        size={20}
      />,
      text1: 'Get palette',
      text2: 'form color',
      onPress: () => {
        logEvent("get_palette_from_color");
        clearPalette();
        setColorPickerCallback(({ color }) => {
          clearPalette();
          setDetailedColor(color);
          navigation.navigate("Palettes");
        });
        navigation.navigate("ColorPicker");
      }
    },
  ],
  [
    {
      icon: <MaterialCommunityIcons name="image" size={20} color={Colors.fabPrimary}  />,
      text1: 'Pick color',
      text2: 'from image',
      onPress: async () => {
        const imageResult = await pickImageResult();
        if (!imageResult.didCancel) {
          const pickedColors = await NativeModules.CromaModule.navigateToImageColorPicker(
            imageResult.assets[0].uri
          );
          logEvent("hm_pick_colors_from_img", {
            length: pickedColors.length
          });
          clearPalette();
          setColorList(JSON.parse(pickedColors)?.colors);
          navigation.navigate("ColorList");
        }
      }
    },
    {
      icon: <Ionicons size={20} color={Colors.fabPrimary} name="md-color-filter" />,
      text1: 'Palette',
      text2: 'library',
      onPress: async () => {
        logEvent("hm_palette_library");
        clearPalette();
        navigation.navigate("PaletteLibrary");
      }
    },
    isPro ? {
      icon: <MaterialCommunityIcons
        name="credit-card-scan-outline"
        size={20} color={Colors.fabPrimary} />,
      text1: 'Scan color',
      text2: 'codes',
      onPress: async () => {
        const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
        logEvent("hm_pick_text_colors_from_camera", {
          length: pickedColors.length
        });
        clearPalette();
        setColorList(JSON.parse(pickedColors)?.colors);
        navigation.navigate("ColorList");
      }
    } :
      {
        icon: <FontAwesome5 size={20} color={Colors.fabPrimary} name="unlock" />,
        text1: 'Unlock',
        text2: 'pro',
        onPress: () => purchase(setPurchase)
      }
  ]

  ]
  }></ActionButtonContainer>
}

export default GridActionButtonAndroid;