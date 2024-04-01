import getAxiosClient from './axios.client';

import { Platform } from 'react-native';

export const sendClientErrorAsync = (errorMessage, backtrace) => {
  setTimeout(async () => {
    try {
      const axiosClient = await getAxiosClient();
      const deviceInfo = {
        platform: Platform.OS,
        osVersion: Platform.Version,
        manufacturer: Platform.manufacturer,
        model: Platform.Model,
        isTablet: Platform.isTV
      };

      var errorData = {
        message: JSON.stringify({ message: errorMessage, deviceInfo: deviceInfo }),
        source: 'android-app',
        backtrace: backtrace
      };

      try {
        await axiosClient.post('errors', errorData);
      } catch (error) {
        // Ignore the error
        console.log('Error sending client error:', error);
      }
    } catch (error) {
      // Ignore the error
      console.log('Error getting axios client:', error);
    }
  }, 0);
};
