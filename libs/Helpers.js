import { NativeModules, Platform, ToastAndroid } from "react-native";
import InAppBilling from "react-native-billing";

const logEvent = (eventName, value) => {
  if (Platform.OS === "android") {
    NativeModules.CromaModule.logEvent(
      eventName,
      isObject(value) ? JSON.stringify(value) : `${value}`
    );
  }
};

function isObject(value) {
  return value && typeof value === "object" && value.constructor === Object;
}

const purchase = async function(setPurchase) {
  try {
    await InAppBilling.open();
    const details = await InAppBilling.purchase("croma_pro");
    ToastAndroid.show("Congrats, You are now a pro user!", ToastAndroid.LONG);
    setPurchase(details);
  } catch (err) {
    ToastAndroid.show(`Purchase unsucceessful ${err}`, ToastAndroid.LONG);
  } finally {
    await InAppBilling.close();
  }
};

export { logEvent, purchase };
