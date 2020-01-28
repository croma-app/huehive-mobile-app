import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions
} from "react-native";
import { PaletteCard } from "../components/PaletteCard";
import { UndoCard } from "../components/UndoCard";
import { Croma } from "../screens/store";
import { FloatingAction } from "react-native-floating-action";
import Colors from "../constants/Colors";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import ColorPicker from "../libs/ColorPicker";
import Jimp from "jimp";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";

const HomeScreen = function(props) {
  const { height, width } = Dimensions.get("window");

  const actions = [
    {
      text: "Get palette from image",
      name: "palette_from_image",
      position: 2,
      color: Colors.accent
    },
    {
      text: "Get palette from color",
      name: "palette_from_color",
      position: 1,
      color: Colors.accent
    },
    {
      text: "Add colors manually",
      name: "add_colors_manually",
      position: 3,
      color: Colors.accent
    },
    {
      text: "Unlock Pro",
      name: "unlock_pro",
      position: 4,
      color: Colors.primary
    }
  ];
  const {
    isLoading,
    allPalettes,
    loadInitPaletteFromStore,
    deletedPalettes,
    undoDeletionByName
  } = React.useContext(Croma);
  const [pickImgloading, setPickImgLoading] = useState(false);
  console.log("called again ", allPalettes, deletedPalettes);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      base64: true
    });
    // console.log("Result: " + JSON.stringify(result));
    if (result.base64 !== undefined) {
      return await Jimp.read(new Buffer(result.base64, "base64"));
    } else {
      return await Jimp.read(result.uri);
    }
  };
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  useEffect(() => {
    loadInitPaletteFromStore();
    getPermissionAsync();
  }, []);
  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    return (
      <View
        style={[styles.container, { minHeight: height - Header.HEIGHT - 16 }]}
      >
        {pickImgloading ? <ActivityIndicator /> : <View />}
        <ScrollView>
          {Object.keys(allPalettes).map(name => {
            console.log("name: ", name, allPalettes[name].colors);
            return (
              <PaletteCard
                key={name}
                colors={allPalettes[name].colors}
                name={name}
                navigation={props.navigation}
              />
            );
          })}
          <EmptyView />
        </ScrollView>

        {Object.keys(deletedPalettes).map(name => {
          return (
            <UndoCard
              key={name}
              name={name}
              undoDeletionByName={undoDeletionByName}
            />
          );
        })}
        <FloatingAction
          color={Colors.accent}
          actions={actions}
          onPressItem={name => {
            if (name === "palette_from_image") {
              setPickImgLoading(true);
              pickImage().then((image, err) => {
                // TODO: handle err
                setPickImgLoading(false);
                props.navigation.navigate("ColorList", {
                  colors: ColorPicker.getProminentColors(image)
                });
              });
            } else if (name === "palette_from_color") {
              props.navigation.navigate("ColorPicker", {
                onDone: color => {
                  console.log("Navigating to palettes");
                  props.navigation.navigate("Palettes", {
                    color: color.color
                  });
                }
              });
            } else if (name === "add_colors_manually") {
              props.navigation.navigate("AddPaletteManually");
            } else if (name === "unlock_pro") {
            }
            console.log(`selected button: ${name}`);
          }}
        />
      </View>
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
  }
});
