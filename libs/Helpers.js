import { NativeModules, Platform } from "react-native";

const logEvent = (eventName, value) => {
  if (Platform.OS == "android") {
    NativeModules.CromaModule.logEvent(
      eventName,
      isObject(value) ? JSON.stringify(value) : value + ""
    );
  }
};

function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

export { logEvent };
