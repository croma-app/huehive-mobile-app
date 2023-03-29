import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';
const getAxiosClient = async function () {
  const userAuthInfo = await retrieveUserSession();
  const userDeviceId = await Storage.getUserDeviceId();
  return axios.create({
    baseURL: 'https://huehive.co/', // http://localhost:3000/
    timeout: 1000,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      'X-User-Email': userAuthInfo?.email || null,
      'X-User-Token': userAuthInfo?.userToken || null,
      'X-User-Device-Id': userDeviceId || null
    }
  });
};

export default getAxiosClient;
