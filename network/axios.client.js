import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';

const axiosInstance = axios.create({
  baseURL: 'https:huehive.co/',
  timeout: 1000,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  const userAuthInfo = await retrieveUserSession();
  const userDeviceId = await Storage.getUserDeviceId();
  config.headers['X-User-Email'] = userAuthInfo?.email || null;
  config.headers['X-User-Token'] = userAuthInfo?.token || null;
  config.headers['X-User-Device-Id'] = userDeviceId || null;

  return config;
});

export default axiosInstance;
