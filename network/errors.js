import axiosInstance from './axios.client';
import { Platform } from 'react-native';

export const sendClientErrorAsync = (errorMessage, backtrace) => {
  setTimeout(async () => {
    try {
      const deviceInfo = {
        platform: Platform.OS,
        osVersion: Platform.Version,
        manufacturer: Platform.manufacturer,
        model: Platform.Model,
        isTablet: Platform.isTV
      };

      const errorData = {
        message: JSON.stringify({
          message: errorMessage,
          deviceInfo: deviceInfo
        }),
        source: Platform.OS + '-app',
        backtrace: backtrace
      };

      try {
        await axiosInstance.post('errors', errorData);
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
