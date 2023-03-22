import AsyncStorage from '@react-native-async-storage/async-storage';
const APPLICATION_STATE_KEY = 'APLICATION_STATE';
const IS_USER_ALREADY_EXIST_KEY = 'IS_USER_ALREADY_EXIST';
export default class Storage {
  static getApplicationState = async () => {
    let state = await AsyncStorage.getItem(APPLICATION_STATE_KEY);
    if (state) {
      return JSON.parse(state);
    } else {
      return {};
    }
  };

  static setApplicationState = async (state) => {
    await AsyncStorage.setItem(APPLICATION_STATE_KEY, JSON.stringify(state));
  };

  static setUserAlreadyExists = async () => {
    await AsyncStorage.setItem(IS_USER_ALREADY_EXIST_KEY, 'true');
  };

  static checkUserAlreadyExists = async () => {
    return await AsyncStorage.getItem(IS_USER_ALREADY_EXIST_KEY);
  };
}
