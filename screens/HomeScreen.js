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
import ActionButton from "react-native-action-button";
import Ionicons from "react-native-vector-icons/Ionicons";
import ShareMenu from "../libs/ShareMenu";
import { logEvent, purchase } from "../libs/Helpers";
import { launchImageLibrary } from "react-native-image-picker";
import RNColorThief from "react-native-color-thief";
import RNIap from 'react-native-iap';
import { notifyMessage } from '../libs/Helpers';

const productIds = Platform.select({
  ios: [
    'app_croma'
  ],
  android: [
    'croma_pro',
    'croma_test'
  ]
});

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
  const [pickImgloading, setPickImgloading] = useState(false);
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

  useEffect(()=>{
    (async()=>{
      try {
        const connection = await RNIap.initConnection();
        if(connection){
          const products = await RNIap.getProducts(productIds);
          console.log({products});
        }
      } catch(err) {
        console.warn(err); // standardized err.code and err.message available
      }
    })()
    
    return ()=>{ RNIap.endConnection(); }
  }, []);

  const requestPurchase = async () => {
    const productSKU = Platform.OS === "android" ? 'croma_test' : 'app_croma';
    try {
      const details = await RNIap.requestPurchase(productSKU, false);
      const response = await setPurchase(details);
      console.log({response}, 'kuch toh dash de')
      logEvent("purchase_successful");
    } catch (err) {
      console.warn(err.code, err.message);
      notifyMessage(`Purchase unsucceessful ${err}`);
      logEvent("purchase_failed");
    }
  }

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
            { minHeight: height - 10 - 16 }
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
              <Ionicons name="md-camera" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          )}
          <ActionButton.Item
            buttonColor="#9b59b6"
            title="Get palette from image"
            onPress={async () => {
              try {
                setPickImgloading(true);
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
                if (Platform.OS === "android") {
                  notifyMessage(
                    "Error while extracting colors - " + error
                  );
                }
              } finally {
                setPickImgloading(false);
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
          {Platform.OS !== "web" && isPro === false (
            <ActionButton.Item
              buttonColor={Colors.primary}
              title="Unlock pro"
              onPress={requestPurchase}
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
  icon: { fontSize: 24, height: 24, color: "white" }
});
