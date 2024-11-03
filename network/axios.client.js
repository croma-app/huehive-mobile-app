import axios from 'axios';
import { retrieveUserSession } from '../libs/EncryptedStorage';
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
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';

    try {
      if (error.response) {
        const { status, data } = error.response;
        
        // Handle different status codes
        if (status >= 400 && status < 500) {
          errorMessage = data?.message || 'A client error occurred';
          notifyMessage(errorMessage); // Single argument
        } else if (status >= 500) {
          notifyMessage('Server error, please try again later.');
        }
      } else if (error.request) {
        notifyMessage('No response received from the server.');
      } else {
        // Fixed error message handling
        sendClientError('error_setting_up_request', error.toString());
        notifyMessage(`Error setting up the request: ${error.toString() || 'Unknown error'}`); // Properly formatted string
      }

      // Log the full error for debugging
      console.warn('Axios Error:', {
        message: errorMessage,
        originalError: error,
        response: error.response,
        request: error.request,
      });

    } catch (handlingError) {
      // Fallback error handling
      console.error('Error while handling axios error:', handlingError);
      sendClientError('error_handling_axios_error','An unexpected error occurred' + handlingError);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
