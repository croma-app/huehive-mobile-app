import AsyncStorage from '@react-native-async-storage/async-storage';
// don't remove this. https://github.com/LinusU/react-native-get-random-values is needed for uuidv4
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const USER_DEVICE_ID = 'USER_DEVICE_ID';
const IS_USER_ALREADY_EXIST_KEY = 'IS_USER_ALREADY_EXIST';

export default class Storage {
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

  static markOverflowStepDone = async () => {
    return await AsyncStorage.setItem('IS_LOGIN_OVERLAY_STEP_DONE', 'yes');
  };
  static isLoginOverlayStepDone = async () => {
    return await AsyncStorage.getItem('IS_LOGIN_OVERLAY_STEP_DONE');
  };
}
