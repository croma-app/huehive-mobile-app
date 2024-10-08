import { useEffect } from 'react';
import {
  initConnection,
  endConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type SubscriptionPurchase,
  type ProductPurchase,
  type PurchaseError,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
  ErrorCode,
} from 'react-native-iap';
import { notifyMessage, logEvent, sendClientError } from  '../libs/Helpers';
// https://react-native-iap.dooboolab.com/docs/guides/purchases
// TODO: We need to implement this properly with server side validation.
const useIAPConnection = (callback) => {
  useEffect(() => {
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

    initConnection().then(() => {
      if (callback) {
        callback();
      }
      flushFailedPurchasesCachedAsPendingAndroid()
        .catch((error) => {
          sendClientError('purchase_event_error_flush', error.message);
          // exception can happen here if:
          // - there are pending purchases that are still pending (we can't consume a pending purchase)
          // in any case, you might not want to do anything special with the error
        })
        .then(() => {
          purchaseUpdateSubscription = purchaseUpdatedListener(
            async (purchase: SubscriptionPurchase | ProductPurchase) => {
              console.log('purchaseUpdatedListener', purchase);
              const receipt = purchase.transactionReceipt;
              if (receipt) {
                
                // Tell the store that you have delivered what has been paid for.
                // Failure to do this will result in the purchase being refunded on Android and
                // the purchase event will reappear on every relaunch of the app until you succeed
                // in doing the below. It will also be impossible for the user to purchase consumables
                // again until you do this.

                // If consumable (can be purchased again)
                //await finishTransaction({purchase, isConsumable: true});
                // If not consumable
                
                await finishTransaction({purchase, isConsumable: false});
                logEvent('purchase_event_finish_transaction');
                notifyMessage('Purchase successful');
              }
            },
          );
          purchaseErrorSubscription = purchaseErrorListener(
            (error: PurchaseError) => {
              if (error.code != ErrorCode.E_USER_CANCELLED) {
                sendClientError('purchase_event_error', JSON.stringify({
                    name: error.name,
                    message: error.message, 
                    debugMessage: error.debugMessage, 
                    productId: error.productId, 
                    code: error.code,
                    responseCode: error.responseCode
                  }));
                logEvent('purchase_event_error');
              }
            },
          );
        });
    }).catch((error) => {
      callback(error);
      sendClientError('init_connection_error', error.message);
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      endConnection();
    };
  }, []);
};

export default useIAPConnection;