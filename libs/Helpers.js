import { NativeModules } from "react-native";

const logEvent = (eventName, value) => {
    if (Platform.OS == 'android') {
        NativeModules.CromaModule.logEvent(eventName, "" + value);
    }
}

export default logEvent;