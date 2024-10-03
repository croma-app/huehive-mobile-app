import AsyncStorage from '@react-native-async-storage/async-storage';
// don't remove this. https://github.com/LinusU/react-native-get-random-values is needed for uuidv4
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { sendClientError } from './Helpers';

const USER_DEVICE_ID = 'USER_DEVICE_ID';
const IS_USER_ALREADY_EXIST_KEY = 'IS_USER_ALREADY_EXIST';

function generateUUID() {
  const getRandomHex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  // Return the UUID format
  return (
    getRandomHex() + getRandomHex() + '-' +
    getRandomHex() + '-' +
    '4' + getRandomHex().slice(0, 3) + '-' + // The '4' sets the version
    (Math.floor(Math.random() * 4) + 8).toString(16) + getRandomHex().substr(0, 3) + '-' + // The first hex digit must be in the range [8, B]
    getRandomHex() + getRandomHex() + getRandomHex()
  );
}

export default class Storage {
  static setUserDeviceId = async () => {
    var uuid = uuidv4();
    if (!uuid) {
      sendClientError('uuidv4_failed', uuid + " , UUID generation failed. Using backup method." );
      uuid =  generateUUID();
    }
    await AsyncStorage.setItem(USER_DEVICE_ID, uuid);
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
