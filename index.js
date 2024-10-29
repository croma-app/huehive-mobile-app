/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import './i18n';
import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { notifyError, sendClientError } from './libs/Helpers';

// Custom JS error handler function
const jsErrorHandler = (error, isFatal) => {
  // Handle the error, e.g., log it, show an alert, or send it to an analytics server
  console.log(`JS Error: ${isFatal ? 'Fatal' : 'Non-fatal'}: ${error}`);
  if (isFatal) {
    // Show an alert for fatal errors
    notifyError(
      'Unexpected error occurred' +
        `Error: ${error.name} ${error.message}\nWe have reported this to our team ! Please close the app and start again!`
    );
    sendClientError('react-native-generic-js-error', 'Fatal - ' + isFatal + ' ' + error.message);
  } else {
    sendClientError('react-native-generic-js-error', 'Fatal - ' + isFatal + ' ' + error.message);
    console.log(error); // Log non-fatal errors to the console
  }
};

// Set the global JS error handler
setJSExceptionHandler(jsErrorHandler, true);

// Custom native error handler function (Android only)
const nativeErrorHandler = (exceptionString) => {
  console.log(`Native Error: ${exceptionString}`);
  notifyError('react-native-generic-native-error', exceptionString);
};

// Set the global native error handler
setNativeExceptionHandler(nativeErrorHandler);

// Register the main app component
AppRegistry.registerComponent(appName, () => App);
