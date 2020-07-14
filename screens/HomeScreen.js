import React, { useEffect, useState } from "react";
import Color from "pigment/full";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
  Platform,
  Linking,
  ToastAndroid,
  NativeModules
} from "react-native";
import { PaletteCard } from "../components/PaletteCard";
import { UndoDialog, DialogContainer } from "../components/CommanDialogs";
import { Croma } from "../store/store";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ColorPicker from "../libs/ColorPicker";
import Jimp from "jimp";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";
import ActionButton from "react-native-action-button";
import { Ionicons, Entypo } from "@expo/vector-icons";
import InAppBilling from "react-native-billing";
import ShareMenu from "../libs/ShareMenu";
import { logEvent } from "../libs/Helpers";

const HomeScreen = function(props) {
  const { height, width } = Dimensions.get("window");
  const {
    isLoading,
    allPalettes,
    deletedPalettes,
    undoDeletionByName,
    isPro,
    setPurchase
  } = React.useContext(Croma);
  const [pickImgloading, setPickImgLoading] = useState(false);
  const pickImageResult = async base64 => {
    return await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: base64
    });
  };
  const pickImage = async () => {
    let result = await pickImageResult(true);
    if (result.base64 !== undefined) {
      return await Jimp.read(new Buffer(result.base64, "base64"));
    } else {
      return await Jimp.read(result.uri);
    }
  };
  const getPermissionAsync = async () => {
    if (Platform.OS == "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  const purchase = async function() {
    try {
      await InAppBilling.open();
      const details = await InAppBilling.purchase("croma_pro");
      ToastAndroid.show("Congrats, You are now a pro user!", ToastAndroid.LONG);
      setPurchase(details);
    } catch (err) {
      ToastAndroid.show("Purchase unsucceessful " + err, ToastAndroid.LONG);
    } finally {
      await InAppBilling.close();
    }
  };
  useEffect(() => {
    getPermissionAsync();
    if (Platform.OS === "android") {
      // Deep linking code
      // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
      Linking.getInitialURL().then(url => {
        if (url) {
          const result = {};
          url
            .split("?")[1]
            .split("&")
            .forEach(function(part) {
              var item = part.split("=");
              result[item[0]] = decodeURIComponent(item[1]);
            });
          props.navigation.navigate("SavePalette", {
            colors: [...new Set(JSON.parse(result["colors"]) || [])],
            name: result["name"]
          });
        }
      });

      ShareMenu.getSharedText(text => {
        if (text && typeof text === "string") {
          const colors = Color.parse(text);
          for (var i = 0, l = colors.length; i < l; i++) {
            colors[i] = { color: colors[i].tohex().toLowerCase() };
          }
          props.navigation.navigate("SavePalette", { colors });
        }
      });
    }
  }, []);
  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    logEvent("startup_palatte_len", Object.keys(allPalettes).length);
    return (
      <>
        <View
          style={[styles.container, { minHeight: height - Header.HEIGHT - 16 }]}
        >
          {pickImgloading ? <ActivityIndicator /> : <View />}
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
                  navigation={props.navigation}
                />
              );
            })}
            <EmptyView />
          </ScrollView>
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
        <ActionButton
          bgColor="rgba(68, 68, 68, 0.6)"
          hideShadow={Platform.OS === "web" ? true : false}
          buttonColor={Colors.accent}
          offsetY={60}
          spacing={15}
          key="action-button-home"
          fixNativeFeedbackRadius={true}
          style={Platform.OS === "web" ? styles.actionButtonWeb : {}}
        >
          {Platform.OS === "android" && (
            <ActionButton.Item
              buttonColor="#60f0af"
              title="Pick colors from camera"
              onPress={() => {
                NativeModules.CromaModule.navigateToColorPicker(
                  pickedColors => {
                    logEvent("pick_colors_from_camera", pickedColors.length);
                    console.log("Picked colors: ", pickedColors);
                    props.navigation.navigate(
                      "ColorList",
                      JSON.parse(pickedColors)
                    );
                  }
                );
              }}
            >
              <Ionicons name="md-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Get palette from image"
            onPress={() => {
              setPickImgLoading(true);
              if (Platform.OS === 'android') {
                pickImageResult().then((result, err) =>{
                  logEvent("get_palette_from_image");
                  props.navigation.navigate("ImagePreview", {
                    image: result,
                  });
                  setPickImgLoading(false);
                });
              } else {
                pickImage()
                  .then((image, err) => {
                    setPickImgLoading(false);
                    props.navigation.navigate("ColorList", {
                      colors: ColorPicker.getProminentColors(image)
                    });
                  })
                  .catch(err => {
                    if (Platform.OS == "android") {
                      ToastAndroid.show(
                        "Error while processing image: " + err,
                        ToastAndroid.LONG
                      );
                    }
                    setPickImgLoading(false);
                  });
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
              props.navigation.navigate("ColorPicker", {
                onDone: color => {
                  props.navigation.navigate("Palettes", {
                    color: color.color
                  });
                }
              });
            }}
          >
            <Ionicons name="md-color-palette" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Add colors manually"
            onPress={() => {
              logEvent("add_colors_manually");
              props.navigation.navigate("AddPaletteManually");
            }}
          >
            <Ionicons name="md-color-filter" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          {Platform.OS === "web" && (
            <ActionButton.Item
              buttonColor={Colors.primary}
              title="Get croma on playstore"
              onPress={() =>
                Linking.openURL(
                  "https://play.google.com/store/apps/details?id=app.croma"
                )
              }
            >
              <Entypo name="google-play" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
          {Platform.OS === "android" && !isPro && (
            <ActionButton.Item
              buttonColor={Colors.primary}
              title="Unlock pro"
              onPress={() => {
                purchase();
              }}
            >
              <Ionicons name="md-unlock" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
        </ActionButton>
      </>
    );
  }
};

export default HomeScreen;

HomeScreen.navigationOptions = {
  title: "Croma"
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    justifyContent: "center"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  },
  actionButtonWeb: {
    position: "fixed",
    transform: "scale(1) rotate(0deg) !important",
    right: Math.max((Dimensions.get("window").width - 600) / 2, 0),
    left: Math.max((Dimensions.get("window").width - 600) / 2, 0)
  }
});
