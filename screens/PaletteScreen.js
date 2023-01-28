import React, { useContext, useEffect, useLayoutEffect, useState } from "react";

import SingleColorCard from "../components/SingleColorCard";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,TouchableOpacity
} from "react-native";
import { CromaContext } from "../store/store";
import ActionButton from "react-native-action-button";
import Colors from "../constants/Colors";
import { useHeaderHeight } from '@react-navigation/elements';
import EmptyView from "../components/EmptyView";
import { logEvent } from "../libs/Helpers";
import { DialogContainer, UndoDialog } from "../components/CommonDialogs";
import Feather  from "react-native-vector-icons/Feather";
import MaterialIcons  from "react-native-vector-icons/MaterialIcons";
import { notifyMessage } from '../libs/Helpers';
import { NestableScrollContainer, NestableDraggableFlatList, RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist"


export default function PaletteScreen({ navigation }) {
  const {
    isPro,
    allPalettes,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette,
    updatePalette,
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
  function renderItem(renderItemParams) {
      //notifyMessage("item: " + JSON.stringify(renderItemParams));
      return (
      <ScaleDecorator>
        <SingleColorCard
          key={`${renderItemParams.item.color}`}
          onPress={() => {
            setDetailedColor(renderItemParams.item.color);
            navigation.navigate("ColorDetails");
          }}
          onPressDrag={renderItemParams.drag}
          color={renderItemParams.item}
          colorDeleteFromPalette={() => {
            deleteColor(colors.findIndex((color) => renderItemParams.item === color));
          }}
        />
      </ScaleDecorator>
      )
  }
  const keyExtractor = (item) => {
    //notifyMessage("item: " + JSON.stringify(item));
    return item.color;
  }
  return (
    <>
    <View
     style={
          (styles.container, { minHeight: height - useHeaderHeight() - 16 })
        }
    >
      <NestableScrollContainer>
        <ScrollView
          style={styles.listview}
          showsVerticalScrollIndicator={false}
        >
          <NestableDraggableFlatList
            data={colors?.slice(0, isPro ? colors.length : 4)}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onDragEnd={({ data: reorderedColors }) => {
              //notifyMessage(JSON.stringify(reorderedColors));
              updatePalette(paletteName, reorderedColors);
            }}
          />
          <EmptyView />
         
        </ScrollView>
        </NestableScrollContainer>
        <ActionButton
            offsetY={76}
            bgColor="rgba(68, 68, 68, 0.6)"
            hideShadow={Platform.OS === "web" ? true : false}
            fixNativeFeedbackRadius={true}
            buttonColor={Colors.fabPrimary}
            onPress={() => {
              logEvent("palette_screen_add_color");
              if (
                ( Platform.OS === "android" || Platform.OS === "ios") &&
                colors.length >= 4 &&
                isPro === false
              ) {
                notifyMessage(
                  "Unlock pro to add more than 4 colors!"
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
      </View>
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
          <TouchableOpacity onPress={onDone} style={{ marginTop: 12 }}>
            <MaterialIcons name="done" size={24} color="white" />
          </TouchableOpacity>
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
          <TouchableOpacity onPress={onEdit}>
            <Feather name="edit" size={24} color="white" />
          </TouchableOpacity>
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
