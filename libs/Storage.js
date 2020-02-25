import { AsyncStorage } from "react-native";
const ALL_PALETTES = "ALL_PALETTES";
const IS_USER_ALREADY_EXIST_KEY = 'IS_USER_ALREADY_EXIST';
export default class Storage {
  static getAllPalettes = async () => {
    let palettes = await AsyncStorage.getItem(ALL_PALETTES);
    if (palettes) {
      return JSON.parse(palettes);
    } else {
      return {};
    }
  };

  static saveAllPalette = async allPalette => {
    await AsyncStorage.setItem(ALL_PALETTES, JSON.stringify(allPalette));
  };

  static setUserAlreadyExists = async () => {
    await AsyncStorage.setItem(IS_USER_ALREADY_EXIST_KEY, 'true')
  }

  static checkUserAlreadyExists = async () => {
    return await AsyncStorage.getItem(IS_USER_ALREADY_EXIST_KEY)
  }
}
