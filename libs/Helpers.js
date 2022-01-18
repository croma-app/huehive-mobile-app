import { NativeModules, Platform, ToastAndroid } from "react-native";

const logEvent = (eventName, value) => {
  if (eventName.length > 40) {
    throw "eventName length should be smaller then equal to 40";
  }
  if (Platform.OS === "android") {
    console.log("event: ", eventName, JSON.stringify(value));
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
   // await InAppBilling.open();
    //const details = await InAppBilling.purchase(purchaseType);
    ToastAndroid.show("Congrats, You are now a pro user!", ToastAndroid.LONG);
    setPurchase(details);
    logEvent("purchase_successful");
    return true;
  } catch (err) {
    ToastAndroid.show(`Purchase unsucceessful ${err}`, ToastAndroid.LONG);
    logEvent("purchase_failed");
    return false;
  } finally {
   // await InAppBilling.close();
  }
};

const getAvailablePurchases = async () => {
  try {
    console.log(
      'Get available purchases (non-consumable or unconsumed consumable)',
    );
    const purchases = await RNIap.getAvailablePurchases();
    console.info('Available purchases :: ', purchases);
    if (purchases && purchases.length > 0) {
      console.log({
        availableItemsMessage: `Got ${purchases.length} items.`,
        receipt: purchases[0].transactionReceipt,
      });
    }
    return purchases;
  } catch (err) {
    console.warn(err.code, err.message);
    Alert.alert(err.message);
  }
};

export { logEvent, purchase, getAvailablePurchases };
