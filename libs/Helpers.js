import { NativeModules, Platform, Alert, ToastAndroid } from 'react-native';
import * as RNIap from 'react-native-iap';
import { requestPurchase, getProducts } from 'react-native-iap';
import { sendClientErrorAsync } from '../network/errors';
import { showMessage } from 'react-native-flash-message';

const isProduction = () => {
  // eslint-disable-next-line no-undef
  return __DEV__ === false;
};

const planToSKUMapping = {
  starter: {
    pro: 'starter_to_pro',
    proPlus: isProduction() ? 'croma_pro' : 'local_test1'
  },
  pro: {
    proPlus: 'pro_to_pro_plus'
  }
};

const skuToPlanMapping = {
  starter_to_pro: 'pro',
  pro_to_pro_plus: 'proPlus',
  ...(isProduction() ? { croma_pro: 'proPlus' } : { local_test1: 'proPlus' })
};

const planLabels = {
  starter: 'Starter',
  pro: 'Pro',
  proPlus: 'Pro Plus'
};

const readRemoteConfig = async (key) => {
  // Native module always returns string. So, we need to convert it to boolean.
  return (await NativeModules.CromaModule.getConfigString(key)) == 'true';
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

const purchase = async function (setPurchase, currentPlan, toPlan) {
  try {
    const productSKU = planToSKUMapping[currentPlan][toPlan];
    if (!productSKU) {
      throw new Error(
        `Product SKU is not defined for currentPlan: ${currentPlan} and toPlan: ${toPlan}`
      );
    }
    await getProducts({ skus: [productSKU] });
    const requestPurchaseParam =
      Platform.OS == 'android'
        ? {
            skus: [productSKU]
          }
        : {
            sku: productSKU,
            andDangerouslyFinishTransactionAutomaticallyIOS: true
          };
    await requestPurchase(requestPurchaseParam);
    await setPurchase(toPlan);
    logEvent('purchase_successful');
    notifyMessage('Congrats, You are now a pro user!');
  } catch (err) {
    if (err.code == 'E_ALREADY_OWNED') {
      setPurchase(toPlan);
      notifyMessage('Purchase restored successfully!');
    } else if (err.code == 'E_USER_CANCELLED') {
      notifyMessage('Purchase cancelled ');
    } else {
      console.warn(err.code, err.message);
      notifyError(`Purchase unsuccessful ${err.message}, Tap to dismiss`, { autoHide: false });
      logEvent('purchase_failed', err.message);
      sendClientError('purchase_failed', err.message + 'Error code: ' + err.code, err.stack);
    }
  }
};

const initPurchase = async function (
  setPurchase,
  showMessage = true,
  retryCount = 3,
  retryDelay = 500
) {
  const determinePlan = (plans) => {
    if (plans.includes('proPlus')) {
      return 'proPlus';
    } else if (plans.includes('pro')) {
      return 'pro';
    }
    return null;
  };

  const retryPurchase = async (retries) => {
    try {
      let products = await getAvailablePurchases();
      const plans = products.map((product) => skuToPlanMapping[product.productId]);
      const selectedPlan = determinePlan(plans);

      if (selectedPlan) {
        await setPurchase(selectedPlan);
        if (showMessage) {
          notifyMessage(`Congrats, You are already a pro (${planLabels[selectedPlan]}) user!`);
        }
      }
      //  await setPurchase('starter'); // For testing.
    } catch (e) {
      if (retries > 0) {
        logEvent('init_purchase_retry', e.message);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        await retryPurchase(retries - 1);
      } else {
        logEvent('init_purchase_failed', e.message);
        notifyError('Init purchase failed: ' + e.message);
        sendClientError('init_purchase_failed_' + retryCount, e.message, e.stack);
      }
    }
  };

  await retryPurchase(retryCount);
};

const getAvailablePurchases = async () => {
  try {
    const purchases = await RNIap.getAvailablePurchases();
    return purchases;
  } catch (err) {
    console.warn(err.code, err.message);
    logEvent('get_available_purchases_failed', err.message);
    sendClientError('get_available_purchases_failed', err.message, err.stack);
    throw err;
  }
};

const getPlanPrice = async (currentPlan, toPlans) => {
  try {
    const productSKUs = toPlans.map((toPlan) => planToSKUMapping[currentPlan][toPlan]);
    const products = await RNIap.getProducts({ skus: productSKUs });
    if (products.length > 0) {
      const prices = {};
      products.forEach((product) => {
        prices[product.productId] = {
          localizedPrice: product.localizedPrice
        };
      });
      return toPlans.map((toPlan) => {
        const productSKU = planToSKUMapping[currentPlan][toPlan];
        const priceInfo = prices[productSKU] || {};
        return {
          toPlan,
          price: priceInfo.localizedPrice
        };
      });
    } else {
      throw new Error('Products not found');
    }
  } catch (err) {
    console.warn(err.code, err.message);
    logEvent('get_plan_price_failed', err.message);
    sendClientError('get_plan_price_failed', err.message, err.stack);
    throw err;
  }
};

function notifyMessage(msg) {
  showMessage({
    message: msg,
    duration: 3000
  });
}
function notifyError(msg) {
  showMessage({
    message: msg,
    duration: 3000,
    autoHide: false,
    hideOnPress: true
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
  logEvent,
  sendClientError,
  purchase,
  notifyMessage,
  notifyError,
  initPurchase,
  readRemoteConfig,
  planLabels,
  getPlanPrice,
  capitalizeFirstLetter
};
