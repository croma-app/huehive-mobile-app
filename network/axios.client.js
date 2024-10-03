import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';

const axiosInstance = axios.create({
  baseURL: 'https://huehive.co/',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  const userAuthInfo = await retrieveUserSession();
  const userDeviceId = await Storage.getUserDeviceId();
  if (!userDeviceId?.trim() || userAuthInfo?.email) throw new Error("Device ID or auth is not defined, null, or empty.");

  config.headers['X-User-Email'] = userAuthInfo?.email || null;
  config.headers['X-User-Token'] = userAuthInfo?.token || null;
  config.headers['X-User-Device-Id'] = userDeviceId;

  return config;
});

export default axiosInstance;
