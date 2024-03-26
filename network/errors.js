import getAxiosClient from './axios.client';

export const sendClientErrorAsync = (errorMessage, backtrace) => {
  setTimeout(async () => {
    try {
      const axiosClient = await getAxiosClient();
      var errorData = {
        message: errorMessage,
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
