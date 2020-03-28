import * as React from "react";
import { StyleSheet, View, Text, Platform, Clipboard } from "react-native";
import Card from "./Card";
import Colors from "../constants/Colors";
import { Share } from "react-native";

import MultiColorView from "./MultiColorView";
import { FontAwesome } from "@expo/vector-icons";
import Touchable from "react-native-platform-touchable";
import { Croma } from "../store/store";

export const PaletteCard = props => {
  const [shared, setShared] = React.useState(false);
  const { deletePaletteByName } = React.useContext(Croma);
  const onShare = async event => {
    try {
      const result = await Share.share(
        {
          title: "croma app",
          message: `https://croma.app/#/Main/SavePalette?name=${
            props.name
          }&colors=${encodeURIComponent(JSON.stringify(props.colors))}`
        },
        {
          dialogTitle: "croma app "
        }
      );

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
      `https://croma.app/#/Main/SavePalette?name=${
        props.name
      }&colors=${encodeURIComponent(JSON.stringify(props.colors))}`
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
        props.navigation.navigate("Palette", props);
      }}
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
            onPress={event => {
              event.preventDefault();
              event.stopPropagation();
              deletePaletteByName(props.name);
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
    paddingRight: 16
  },
  label: {
    flex: 1,
    marginHorizontal: 16,
    color: Colors.darkGrey
  }
});
