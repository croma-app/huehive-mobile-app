import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';
let axiosClient = null;
const getAxiosClient = async function () {
  if (!axiosClient) {
    const userAuthInfo = await retrieveUserSession();
    const userDeviceId = await Storage.getUserDeviceId();
    axiosClient = axios.create({
      baseURL: 'https://huehive.co/',
      timeout: 1000,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-User-Email': userAuthInfo?.email || null,
        'X-User-Token': userAuthInfo?.userToken || null,
        'X-User-Device-Id': userDeviceId || null
      }
    });
  }
  return axiosClient;
};

export const resetAxiosClient = () => {
  axiosClient = null;
};

export default getAxiosClient;
