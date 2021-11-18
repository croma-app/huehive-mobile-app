import * as React from "react";
import { StyleSheet, View, Text, Platform, Clipboard } from "react-native";
import Card from "./Card";
import Colors from "../constants/Colors";
import { Share } from "react-native";

import MultiColorView from "./MultiColorView";
import { FontAwesome } from "react-native-vector-icons/";
import Touchable from "react-native-platform-touchable";
import { CromaContext } from "../store/store";
import { logEvent } from "../libs/Helpers";

export const PaletteCard = props => {
  const [shared, setShared] = React.useState(false);
  const [animationType, setAnimationType] = React.useState("fadeInLeftBig");

  const { deletePaletteByName, setCurrentPalette } = React.useContext(
    CromaContext
  );

  const onShare = async () => {
    try {
      logEvent("home_screen_palette_card_share", props.colors.length + "");
      const result = await Share.share({
        message: `Croma - Palette Manager\nColors:\n${props.colors
          .map(colorObj => colorObj.color)
          .join("\n")}

          https://croma.app/Main/SavePalette?name=${encodeURIComponent(
            props.name
          )}&colors=${encodeURIComponent(JSON.stringify(props.colors))}`
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onShareWeb = event => {
    event.preventDefault();
    event.stopPropagation();
    Clipboard.setString(
      `Croma - Palette Manager\nColors:\n${props.colors
        .map(colorObj => colorObj.color)
        .join("\n")}

      https://croma.app/Main/SavePalette?name=${encodeURIComponent(
        props.name
      )}&colors=${encodeURIComponent(JSON.stringify(props.colors))}`
    );
    setShared(true);
    setTimeout(() => {
      setShared(false);
    }, 3000);
  };
  return (
    <Card
      {...props}
      onPress={() => {
        setCurrentPalette({ name: props.name });
        props.navigation.navigate("Palette");
      }}
      animationType={animationType}
    >
      <MultiColorView {...props}></MultiColorView>

      <View style={styles.bottom}>
        <Text style={styles.label}>{props.name}</Text>
        <View style={styles.actionButtonsView}>
          {shared && (
            <Text
              style={{
                position: "absolute",
                backgroundColor: "rgb(64, 64, 58)",
                top: "-35px",
                right: "-10px",
                width: "148px",
                color: "#fff",
                padding: "5px ",
                textAlign: "center",
                borderRadius: "6px"
              }}
            >
              Copied to Clipboard!
            </Text>
          )}
          {Platform.OS === "web" ? (
            <Touchable onClick={onShareWeb} style={styles.actionButton}>
              <FontAwesome size={20} name="share" />
            </Touchable>
          ) : (
            <Touchable onPress={onShare} style={styles.actionButton}>
              <FontAwesome size={20} name="share" />
            </Touchable>
          )}
          <Touchable
            {...{
              [Platform.OS === "web" ? "onClick" : "onPress"]: event => {
                event.preventDefault();
                event.stopPropagation();
                setAnimationType("fadeOutRightBig");
                setTimeout(() => {
                  deletePaletteByName(props.name);
                }, 500);
              }
            }}
            style={styles.actionButton}
          >
            <FontAwesome size={20} name="trash" />
          </Touchable>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    height: 54
  },
  actionButtonsView: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  actionButton: {
    padding: 8
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    color: Colors.darkGrey
  }
});
