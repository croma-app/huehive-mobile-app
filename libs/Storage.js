import { AsyncStorage } from "react-native";
const ALL_PALETTES = "ALL_PALETTES";
export default class Storage {
  static saveAllPalette = async allPalette => {
    await AsyncStorage.setItem(ALL_PALETTES, JSON.stringify(allPalette))
  }
}
