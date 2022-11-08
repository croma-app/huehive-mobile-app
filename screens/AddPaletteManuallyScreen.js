import React from "react";
import { ScrollView } from "react-native";
import { SavePalette } from "../components/SavePalette";
import { logEvent } from "../libs/Helpers";
import { useTranslation } from 'react-i18next';

export default function AddPaletteManuallyScreen(props) {
  const { t } = useTranslation();

  logEvent("add_palette_manually_screen");
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <SavePalette
        title={t("ADD PALETTE NAME")}
        navigationPath={"Palette"}
        navigation={props.navigation}
      />
    </ScrollView>
  );
}
