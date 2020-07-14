import { NativeModules, Platform } from "react-native";

const logEvent = (eventName, value) => {
  if (Platform.OS == "android") {
    NativeModules.CromaModule.logEvent(eventName, "" + value);
  }
};



const getImageBitmap = function(uri, height, width, callback) {
  NativeModules.CromaModule.getBitmap(uri, height, width, callback);
} 

export { logEvent, getImageBitmap };
