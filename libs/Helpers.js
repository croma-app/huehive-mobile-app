import { NativeModules, Platform, Alert, ToastAndroid } from 'react-native';
import * as RNIap from 'react-native-iap';
import { requestPurchase, getProducts } from 'react-native-iap';
import { sendClientErrorAsync } from '../network/errors';

const isProduction = () => {
  // eslint-disable-next-line no-undef
  return __DEV__ === false;
};

const planToSKUMapping = {
  basic: "huehive_pro_basic",
  advance: "croma_pro"
}

const skuToPlanMapping = Object.fromEntries(
  Object.entries(planToSKUMapping).map(([key, value]) => [value, key])
);
const readRemoteConfig = async (key) => {
  // Native module always returns string. So, we need to convert it to boolean.
  return (await NativeModules.CromaModule.getConfigString(key)) == 'true';
};

const productSku = function () {
  //return 'local_test1';
  return Platform.OS === 'android' ? 'croma_pro' : 'app_croma';
};
const sendClientError = (event, errorMessage, stacktrace) => {
  if (isProduction()) {
    sendClientErrorAsync(event + ' -  ' + errorMessage, stacktrace || new Error().stack);
  } else {
    console.log('Client error', event, errorMessage, stacktrace);
  }
};

const logEvent = (eventName, value) => {
  if (eventName.length > 40) {
    throw 'eventName length should be smaller than equal to 40';
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
    await requestPurchase({
      skus: [productSKU]
    });
    await setPurchase(skuToPlanMapping[productSKU]);
    logEvent('purchase_successful');
    notifyMessage('Congrats, You are now a pro user!');
  } catch (err) {
    if (err.code == 'E_ALREADY_OWNED') {
      setPurchase(skuToPlanMapping[productSKU]);
      notifyMessage('Purchase restored successfully!');
    } else {
      console.warn(err.code, err.message);
      notifyMessage(`Purchase unsuccessful ${err.message}`);
    }
    logEvent('purchase_failed', err.message);
    sendClientError('purchase_failed', err.message + 'Error code: ' + err.code, err.stack);
  }
};
const initPurchase = async function (
  setPurchase,
  showMessage = true,
  retryCount = 3,
  retryDelay = 500
) {
  const retryPurchase = async (retries) => {
    try {
      let products = await getAvailablePurchases();
      
      const basicPlan = products.find((product) => product.productId === planToSKUMapping.basic);
      const advancePlan = products.find((product) => product.productId === planToSKUMapping.advance);
      if (basicPlan || advancePlan) {
        const plan = basicPlan ? 'basic': 'advance';
        await setPurchase(plan);
        if (showMessage) {
          notifyMessage('Congrats, You are already a pro (' + plan + ') user!');
        }
      }
    } catch (e) {
      if (retries > 0) {
        logEvent('init_purchase_retry', e.message);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        await retryPurchase(retries - 1);
      } else {
        logEvent('init_purchase_failed', e.message);
        notifyMessage('Init purchase failed: ' + e.message);
      }
      sendClientError('init_purchase_failed_' + retryCount, e.message, e.stack);
    }
  };

  await retryPurchase(retryCount);
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
    logEvent('get_available_purchases_failed', err.message);
    sendClientError('get_available_purchases_failed', err.message, err.stack);
    throw err;
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

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { logEvent, sendClientError, purchase, notifyMessage, initPurchase, readRemoteConfig };
