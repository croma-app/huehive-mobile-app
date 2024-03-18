import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';
const getAxiosClient = async function () {
  const userAuthInfo = await retrieveUserSession();
  const userDeviceId = await Storage.getUserDeviceId();
  return axios.create({
    // https://stackoverflow.com/questions/5528850/how-do-you-connect-localhost-in-the-android-emulator
    baseURL: 'https://huehive.co/',
    // baseURL: 'http://10.0.2.2:3000/', //10.0.2.2 is the Android emulator's alias to localhost
    timeout: 1000,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': userAuthInfo?.email || null,
      'X-User-Token': userAuthInfo?.token || null,
      'X-User-Device-Id': userDeviceId || null
    }
  });
};

export default getAxiosClient;
