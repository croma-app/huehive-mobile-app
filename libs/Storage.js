import { AsyncStorage } from "react-native";
const ALL_PALETTES = "ALL_PALETTES";
export default class Storage {
  static getAllPalettes = async () => {
    let palettes = await AsyncStorage.getItem(ALL_PALETTES);
    console.log("Palettes returned from storage: ", palettes);
    if (palettes) {
      return JSON.parse(palettes);
    } else {
      return {};
    }
  };

  static saveAllPalette = async allPalette => {
    await AsyncStorage.setItem(ALL_PALETTES, JSON.stringify(allPalette));
  };
}
