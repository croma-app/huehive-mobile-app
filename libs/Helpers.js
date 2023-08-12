import { NativeModules, Platform, Alert, ToastAndroid } from 'react-native';
import RNIap from 'react-native-iap';
const productSku = function () {
  return Platform.OS === 'android' ? 'croma_pro' : 'app_croma';
};
const logEvent = (eventName, value) => {
  if (eventName.length > 40) {
    throw 'eventName length should be smaller then equal to 40';
  }
  if (Platform.OS === 'android') {
    NativeModules.CromaModule.logEvent(
      eventName,
      isObject(value) ? JSON.stringify(value) : `${value}`
    );
  }
};

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

const purchase = async function (setPurchase, productSKU) {
  if (!productSKU) {
    productSKU = productSku();
  }
  try {
    await RNIap.getProducts([productSKU]);
    const details = await RNIap.requestPurchase(productSKU, false);
    await setPurchase(details);
    logEvent('purchase_successful');
    notifyMessage('Congrats, You are now a pro user!');
  } catch (err) {
    console.warn(err.code, err.message);
    notifyMessage(`Purchase unsuccessful ${err}`);
    logEvent('purchase_failed');
  }
};
const initPurchase = async function (setPurchase) {
  // const productSKU = productSku();
  await setPurchase('Free pro user');
  notifyMessage('Congrats, You are a pro user. Huehive pro version is now free for limited time!');
  // try {
  //   let products = await getAvailablePurchases();
  //   if (products.find((product) => product.productId === productSKU)) {
  //     await setPurchase(products.find((product) => product.productId === productSKU));
  //     notifyMessage('Congrats, You are already a pro user!');
  //   }
  // } catch (e) {
  //   notifyMessage('Failed during initialization of purchase: ' + e);
  // }
};

const getAvailablePurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    console.info('Available purchases :: ', purchases);
    if (purchases && purchases.length > 0) {
      console.log({
        availableItemsMessage: `Got ${purchases.length} items.`,
        receipt: purchases[0].transactionReceipt
      });
    }
    return purchases;
  } catch (err) {
    console.warn(err.code, err.message);
    notifyMessage(err.message);
  }
};

function notifyMessage(msg, duration = ToastAndroid.LONG) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, duration);
  } else {
    Alert.alert(msg);
  }
}

export { logEvent, purchase, getAvailablePurchases, notifyMessage, initPurchase };
