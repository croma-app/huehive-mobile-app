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
  ToastAndroid,
  View
} from "react-native";
import { PaletteCard } from "../components/PaletteCard";
import { DialogContainer, UndoDialog } from "../components/CommonDialogs";
import { CromaContext } from "../store/store";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import ColorPicker from "../libs/ColorPicker";
import Jimp from "jimp";
import { useHeaderHeight } from "@react-navigation/stack";
import EmptyView from "../components/EmptyView";
import ActionButton from "react-native-action-button";
import { Entypo, Ionicons } from "@expo/vector-icons";
import ShareMenu from "../libs/ShareMenu";
import { logEvent, purchase } from "../libs/Helpers";

const HomeScreen = function({ navigation, route }) {
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
    if (Platform?.OS === "ios") {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  const purchasePro = () => {
    purchase(setPurchase);
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
            .forEach(function(part) {
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
          style={[
            styles.container,
            { minHeight: height - useHeaderHeight() - 16 }
          ]}
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
                  navigation={navigation}
                  route={route}
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
                  ToastAndroid.show(
                    "Error while picking color from camera - " + error
                  );
                }
              }}
            >
              <Ionicons name="md-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Get palette from image"
            onPress={async () => {
              try {
                setPickImgLoading(true);
                if (Platform.OS === "android") {
                  const result = await pickImageResult();
                  console.log("Result: ", result);
                  if (!result.cancelled) {
                    const pickedColors = await NativeModules.CromaModule.pickTopColorsFromImage(
                      result.uri
                    );
                    logEvent("get_palette_from_image");
                    clearPalette();
                    setColorList(JSON.parse(pickedColors)?.colors);
                    navigation.navigate("ColorList");
                  }
                } else {
                  const image = await pickImage();

                  clearPalette();
                  setColorList(ColorPicker.getProminentColors(image));
                  navigation.navigate("ColorList");
                }
              } catch (error) {
                if (Platform.OS === "android") {
                  ToastAndroid.show(
                    "Error while extracting colors - " + error,
                    ToastAndroid.LONG
                  );
                }
              } finally {
                setPickImgLoading(false);
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
          {Platform.OS === "web" && (
            <ActionButton.Item
              buttonColor="#1abc9c"
              title="Create new palette"
              onPress={() => {
                clearPalette();
                navigation.navigate("AddPaletteManually");
              }}
            >
              <Ionicons
                name="md-color-filter"
                style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
          )}
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
              onPress={purchasePro}
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
  actionButton:
    Platform.OS === "web"
      ? {
          position: "fixed",
          transform: "scale(1) rotate(0deg) !important",
          right: Math.max((Dimensions.get("window").width - 600) / 2, 0),
          left: Math.max((Dimensions.get("window").width - 600) / 2, 0)
        }
      : {},
  icon: { fontSize: 24, height: 24, color: "white" }
});
