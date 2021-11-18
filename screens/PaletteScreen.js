import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import SingleColorCard from "../components/SingleColorCard";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View
} from "react-native";
import Touchable from "react-native-platform-touchable";
import { CromaContext } from "../store/store";
import ActionButton from "react-native-action-button";
import Colors from "../constants/Colors";
import { useHeaderHeight } from "@react-navigation/stack";
import EmptyView from "../components/EmptyView";
import { logEvent } from "../libs/Helpers";
import { DialogContainer, UndoDialog } from "../components/CommonDialogs";
import Feather  from "react-native-vector-icons/Feather";
import MaterialIcons  from "react-native-vector-icons/MaterialIcons";

export default function PaletteScreen({ navigation }) {
  const {
    isPro,
    allPalettes,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette,
    setDetailedColor,
    currentPalette,
    setColorPickerCallback
  } = useContext(CromaContext);

  const paletteName = currentPalette?.name ?? "";

  const { height } = Dimensions.get("window");
  const colors = allPalettes[paletteName]?.colors;
  const deletedColors = allPalettes[paletteName]?.deletedColors
    ? allPalettes[paletteName]?.deletedColors
    : [];

  const deleteColor = index => {
    colorDeleteFromPalette(paletteName, index);
  };
  logEvent("palette_screen");

  useLayoutEffect(() => {
    setNavigationOptions({ navigation, paletteName });
  }, [navigation, paletteName]);

  return (
    <>
      <View
        style={
          (styles.container, { minHeight: height - useHeaderHeight() - 16 })
        }
      >
        <ScrollView
          style={styles.listview}
          showsVerticalScrollIndicator={false}
        >
          {colors
            ?.slice(0, isPro ? colors.length : 4)
            .map((colorObj, index) => {
              return (
                <SingleColorCard
                  key={`${colorObj.color}-${index}`}
                  onPress={() => {
                    setDetailedColor(colorObj.color);
                    navigation.navigate("ColorDetails");
                  }}
                  color={colorObj}
                  colorDeleteFromPalette={() => {
                    deleteColor(index);
                  }}
                />
              );
            })}
          <EmptyView />
        </ScrollView>
        <ActionButton
          offsetY={60}
          bgColor="rgba(68, 68, 68, 0.6)"
          hideShadow={Platform.OS === "web" ? true : false}
          fixNativeFeedbackRadius={true}
          buttonColor={Colors.fabPrimary}
          onPress={() => {
            logEvent("palette_screen_add_color");
            if (
              Platform.OS === "android" &&
              colors.length >= 4 &&
              isPro === false
            ) {
              ToastAndroid.show(
                "Unlock pro to add more than 4 colors!",
                ToastAndroid.LONG
              );
              navigation.navigate("ProVersion");
            } else {
              setColorPickerCallback(color => {
                addColorToPalette(paletteName, color);
              });
              navigation.navigate("ColorPicker");
            }
          }}
          style={styles.actionButton}
        />
      </View>
      <DialogContainer>
        {deletedColors.map((colorObj, index) => (
          <UndoDialog
            key={`UndoDialog-${colorObj.color}-${index}`}
            name={colorObj.color}
            undoDeletionByName={colorName => {
              undoColorDeletion(paletteName, colorName);
            }}
          />
        ))}
      </DialogContainer>
    </>
  );
}

const CustomHeader = ({ currentPaletteName }) => {
  const [paletteName, setPaletteName] = useState(currentPaletteName);
  const { renamePalette, currentPalette, setCurrentPalette } = useContext(
    CromaContext
  );
  const [isEditingPaletteName, setIsEditingPaletteName] = useState(false);

  useEffect(() => {
    setPaletteName(currentPaletteName);
  }, [currentPaletteName]);

  const onDone = () => {
    renamePalette(currentPaletteName, paletteName);
    //setting new name in query params
    setCurrentPalette({ ...currentPalette, name: paletteName });
    setIsEditingPaletteName(false);
  };

  const onEdit = () => {
    logEvent("edit_palette_name");
    setIsEditingPaletteName(true);
  };
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "95%"
      }}
    >
      {isEditingPaletteName ? (
        <>
          <TextInput
            style={styles.input}
            value={paletteName}
            autoFocus={true}
            onChangeText={name => {
              setPaletteName(name);
            }}
          />
          <Touchable onPress={onDone} style={{ marginTop: 12 }}>
            <MaterialIcons name="done" size={24} color="white" />
          </Touchable>
        </>
      ) : (
        <>
          <Text
            style={{
              color: "#ffffff",
              fontSize: 18
            }}
          >
            {paletteName}
          </Text>
          <Touchable onPress={onEdit}>
            <Feather name="edit" size={24} color="white" />
          </Touchable>
        </>
      )}
    </View>
  );
};

const setNavigationOptions = ({ navigation, paletteName }) => {
  navigation.setOptions({
    headerTitle: () => <CustomHeader currentPaletteName={paletteName} />
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  listview: {
    margin: 8
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
  input: {
    color: "#ffffff",
    fontSize: 18
  }
});
