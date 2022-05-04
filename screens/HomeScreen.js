import React, { useEffect, useState } from "react";
import Color from "pigment/full";
import {
  ActivityIndicator,
  Dimensions,
  Linking,
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import { PaletteCard } from "../components/PaletteCard";
import { DialogContainer, UndoDialog } from "../components/CommonDialogs";
import { CromaContext } from "../store/store";
import Colors from "../constants/Colors";
import * as Permissions from "expo-permissions";
import EmptyView from "../components/EmptyView";
import ActionButtonContainer from "../components/ActionButton";
// import ActionButton from "react-native-action-button";
import ShareMenu from "../libs/ShareMenu";
import { logEvent, purchase } from "../libs/Helpers";
import { launchImageLibrary } from "react-native-image-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import RNColorThief from "react-native-color-thief";
import { notifyMessage } from '../libs/Helpers';

import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const HomeScreen = function ({ navigation, route }) {
  const { height } = Dimensions.get("window");
  const {
    isLoading,
    allPalettes,
    deletedPalettes,
    undoDeletionByName,
    isPro,
    setPurchase,
    setColorList,
    setColorPickerCallback,
    setSuggestedName,
    setDetailedColor,
    clearPalette
  } = React.useContext(CromaContext);
  const [pickImageLoading, setPickImageLoading] = useState(false);
  const pickImageResult = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });
    return result;
  };
  const getPermissionAsync = async () => {
    if (Platform?.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  useEffect(() => {
    getPermissionAsync();
    if (Platform?.OS === "android") {
      // Deep linking code
      // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
      Linking.getInitialURL().then(url => {
        if (url) {
          logEvent("deep_linking_open_link");
          const result = {};
          url
            .split("?")[1]
            .split("&")
            .forEach(function (part) {
              var item = part.split("=");
              result[item[0]] = decodeURIComponent(item[1]);
            });
          clearPalette();
          setColorList([...new Set(JSON.parse(result["colors"]) || [])]);
          setSuggestedName(result["name"]);
          navigation.navigate("SavePalette");
        }
      });

      ShareMenu.getSharedText(text => {
        if (text && typeof text === "string") {
          const colors = Color.parse(text);
          logEvent("get_shared_text", { length: colors.length });
          for (var i = 0, l = colors.length; i < l; i++) {
            colors[i] = { color: colors[i].tohex().toLowerCase() };
          }
          clearPalette();
          setColorList(colors);
          navigation.navigate("SavePalette");
        }
      });
    }
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    logEvent("home_screen", {
      length: Object.keys(allPalettes).length
    });
    return (
      <>
        <View
          style={
            styles.container
          }
        >
          {pickImageLoading ? <ActivityIndicator /> : <View />}
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.keys(allPalettes).map(name => {
              return (
                <PaletteCard
                  key={name}
                  colors={allPalettes[name].colors.slice(
                    0,
                    isPro ? allPalettes[name].colors.length : 4
                  )}
                  name={name}
                  navigation={navigation}
                  route={route}
                />
              );
            })}
            <EmptyView />

          </ScrollView>
          <ActionButtonContainer config={[[
            {
              icon: <Ionicons name="md-camera" color={Colors.fabPrimary} size={20} />,
              text1: 'Pick colors',
              text2: 'form cemera',
              onPress: async () => {
                try {
                  const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                  logEvent("pick_colors_from_camera", pickedColors.length);
                  console.log("Picked colors: ", pickedColors);
                  clearPalette();
                  setColorList(JSON.parse(pickedColors)?.colors);
                  navigation.navigate("ColorList");
                } catch (error) {
                  notifyMessage(
                    "Error while picking color from camera - " + error
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
              icon: <MaterialCommunityIcons name="image" size={20} color={Colors.fabPrimary} style={styles.icon} />,
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
                  navigate("ColorList");
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
        </View>

        <DialogContainer>
          {Object.keys(deletedPalettes).map(name => {
            return (
              <UndoDialog
                key={name}
                name={name}
                undoDeletionByName={undoDeletionByName}
              />
            );
          })}
        </DialogContainer>
        {/*Setting box shadow to false because of Issue on the web: https://github.com/mastermoo/react-native-action-button/issues/337 */}
        {/* <ActionButton
          bgColor="rgba(68, 68, 68, 0.6)"
          buttonColor={Colors.fabPrimary}
          offsetY={60}
          spacing={15}
          key="action-button-home"
          fixNativeFeedbackRadius={true}
          style={styles.actionButton}
        >
          {Platform.OS === "android" && (
            <ActionButton.Item
              buttonColor="#60f0af"
              title="Pick colors from camera"
              onPress={async () => {
                try {
                  const pickedColors = await NativeModules.CromaModule.navigateToColorPicker();
                  logEvent("pick_colors_from_camera", pickedColors.length);
                  console.log("Picked colors: ", pickedColors);
                  clearPalette();
                  setColorList(JSON.parse(pickedColors)?.colors);
                  navigation.navigate("ColorList");
                } catch (error) {
                  notifyMessage(
                    "Error while picking color from camera - " + error
                  );
                }
              }}
            >
              a
            </ActionButton.Item>
          )}
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Get palette from image"
            onPress={async () => {
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
            }}
          >
            <Ionicons name="md-image" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3498db"
            title="Get palette from color"
            onPress={() => {
              logEvent("get_palette_from_color");
              clearPalette();
              setColorPickerCallback(({ color }) => {
                clearPalette();
                setDetailedColor(color);
                navigation.navigate("Palettes");
              });
              navigation.navigate("ColorPicker");
            }}
          >
            <Ionicons name="md-color-palette" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          {Platform.OS == 'ios' && <ActionButton.Item
              buttonColor="#ff1744"
              title="Palette library"
              onPress={() => {
                logEvent("palette_library");
                navigation.navigate("PaletteLibrary");
              }}
          >
            <MaterialCommunityIcons
                name="palette-swatch"
                style={styles.actionButtonIcon}
            />
          </ActionButton.Item>
          }
          { !isPro && (
            <ActionButton.Item
              buttonColor={Colors.primary}
              title="Unlock pro"
              onPress={() => purchase(setPurchase)}
            >
            <FontAwesome5 name="unlock" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
        </ActionButton> */}

      </>
    );
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexGrow: 1,
    height: 200,
    padding: 8,
    justifyContent: "center",
    position: 'relative'
  }
});
