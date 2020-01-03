import {AsyncStorage} from 'react-native';
const ALL_PALETTES = "ALL_PALETTES";
export default class Storage {
  
  static save = async (colorPalette) => {
    // TODO: exception handling 
    let palettes = await AsyncStorage.getItem(ALL_PALETTES);
    if (!palettes) {
      palettes = JSON.stringify({});
    }
    palettes = JSON.parse(palettes);
    palettes[colorPalette.name] = colorPalette;

    await AsyncStorage.setItem(ALL_PALETTES, JSON.stringify(palettes));
    return palettes;
  }

  static getAllPalettes = async () => {
    let palettes = await AsyncStorage.getItem(ALL_PALETTES);
    console.log("Palettes returned from storage: ", palettes);
    if (palettes) {
      return JSON.parse(palettes);
    } else {
      return {};
    }
  }
}