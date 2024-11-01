import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStoreage';
import Storage from '../libs/Storage';
import { notifyMessage, sendClientError } from '../libs/Helpers';

const axiosInstance = axios.create({
  baseURL: 'https://huehive.co/',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const userAuthInfo = await retrieveUserSession();
  const userDeviceId = await Storage.getUserDeviceId();

  if (!userDeviceId?.trim() || userAuthInfo?.email) {
    throw new Error('Device ID or auth is not defined, null, or empty.');
  }

  config.headers['X-User-Email'] = userAuthInfo?.email || null;
  config.headers['X-User-Token'] = userAuthInfo?.token || null;
  config.headers['X-User-Device-Id'] = userDeviceId;

  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If the response status is not in the 2xx range
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message || 'An error occurred';

      // Handle different status codes here
      if (status >= 400 && status < 500) {
        notifyMessage(`Client error: ${errorMessage}`);
      } else if (status >= 500) {
        notifyMessage('Server error, please try again later.');
      }
    } else if (error.request) {
      notifyMessage('No response received from the server.');
    } else {
      sendClientError('error_setting_up_request', JSON.stringify(error));
      notifyMessage('Error setting up the request:', error.message);
    }

    // Optionally, you can also return a custom error message or rethrow the error
    return Promise.reject(errorMessage || 'An unexpected error occurred');
  }
);

export default axiosInstance;
