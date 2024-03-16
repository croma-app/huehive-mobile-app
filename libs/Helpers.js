import { NativeModules, Platform, Alert, ToastAndroid } from 'react-native';
import * as RNIap from 'react-native-iap';
import { requestPurchase, getProducts } from 'react-native-iap';

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
    await getProducts({ skus: [productSKU] });
    const details = await requestPurchase({
      skus: [productSKU],
      andDangerouslyFinishTransactionAutomatically: true
    });
    await setPurchase(details);
    logEvent('purchase_successful');
    notifyMessage('Congrats, You are now a pro user!');
  } catch (err) {
    console.warn(err.code, err.message);
    notifyMessage(`Purchase unsuccessful ${err}`);
    logEvent('purchase_failed');
  }
};
const initPurchase = async function (setPurchase, showMessage = true) {
  const productSKU = productSku();
  try {
    let products = await getAvailablePurchases();
    if (products.find((product) => product.productId === productSKU)) {
      await setPurchase(products.find((product) => product.productId === productSKU));
      if (showMessage) {
        notifyMessage('Congrats, You are already a pro user!');
      }
    }
  } catch (e) {
    notifyMessage('Failed during initialization of purchase: ' + e);
  }
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

function extractHexColors1(text) {
  let hexColors = [];
  let regex = /([1-9]{1,}\. ([A-Z a-z]*?))?([ \-\(])*#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g;
  let matches = text.matchAll(regex);
  let hexSet = new Set();
  for (let match of matches) {
    let hex = '#' + match[4];
    if (!hexSet.has(hex)) {
      hexSet.add(hex);
      let colorName = match[2]?.trim();
      hexColors.push({ color: hex, name: colorName });
    }
  }
  return hexColors;
}

function extractHexColors2(text) {
  let hexColors = [];
  let regex = /Color Name:\s+(.+?)\s+Hex Code:\s+#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/g;
  let matches = text.matchAll(regex);
  let hexSet = new Set();
  for (let match of matches) {
    let hex = '#' + match[1];
    if (!hexSet.has(hex)) {
      hexSet.add(hex);
      let colorName = match[0]?.trim();
      hexColors.push({ color: hex, name: colorName });
    }
  }
  return hexColors;
}
export function extractHexColors(text) {
  let extractedColors1 = extractHexColors1(text);
  let extractedColors2 = extractHexColors2(text);
  let combinedHexMap = {};
  for (let color of extractedColors1) {
    let hex = color.color;
    combinedHexMap[hex] = color;
  }
  for (let color of extractedColors2) {
    let hex = color.color;
    if (hex in combinedHexMap) {
      combinedHexMap[hex].name = combinedHexMap[hex].name || color.name;
    } else {
      combinedHexMap[hex] = color;
    }
  }
  return Object.values(combinedHexMap);
}

export { logEvent, purchase, getAvailablePurchases, notifyMessage, initPurchase };
