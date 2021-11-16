import { NativeModules, Platform, ToastAndroid } from "react-native";
import InAppBilling from "react-native-billing";

const logEvent = (eventName, value) => {
  if (eventName.length > 40) {
    throw "eventName length should be smaller then equal to 40";
  }
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

const purchase = async function(setPurchase, purchaseType = "croma_pro") {
  try {
    await InAppBilling.open();
    const details = await InAppBilling.purchase(purchaseType);
    ToastAndroid.show("Congrats, You are now a pro user!", ToastAndroid.LONG);
    setPurchase(details);
    logEvent("purchase_successful");
    return true;
  } catch (err) {
    ToastAndroid.show(`Purchase unsucceessful ${err}`, ToastAndroid.LONG);
    logEvent("purchase_failed");
    return false;
  } finally {
    await InAppBilling.close();
  }
};

export { logEvent, purchase };
