import { NativeModules, Platform } from "react-native";

const logEvent = (eventName, value) => {
  if (Platform.OS == "android") {
    NativeModules.CromaModule.logEvent(eventName, "" + value);
  }
};

export { logEvent };
