import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const APPLICATION_STATE_KEY = 'APLICATION_STATE';
const USER_DEVICE_ID = 'USER_DEVICE_ID';
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

  static setUserDeviceId = async () => {
    await AsyncStorage.setItem(USER_DEVICE_ID, uuidv4());
  };

  static getUserDeviceId = async () => {
    return await AsyncStorage.getItem(USER_DEVICE_ID);
  };

  static setUserAlreadyExists = async () => {
    await AsyncStorage.setItem(IS_USER_ALREADY_EXIST_KEY, 'true');
  };

  static checkUserAlreadyExists = async () => {
    return await AsyncStorage.getItem(IS_USER_ALREADY_EXIST_KEY);
  };
}
