import { useEffect } from 'react';
import {
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  type SubscriptionPurchase,
  type ProductPurchase,
  type PurchaseError,
  flushFailedPurchasesCachedAsPendingAndroid,
  finishTransaction,
} from 'react-native-iap';
import { notifyMessage, logEvent, sendClientError } from  '../libs/Helpers';
// https://react-native-iap.dooboolab.com/docs/guides/purchases
// TODO: We need to implement this properly with server side validation.
const useIAPConnection = () => {
  useEffect(() => {
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

    initConnection().then(() => {
      flushFailedPurchasesCachedAsPendingAndroid()
        .catch(() => {
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
              console.warn('purchaseErrorListener', error.toString());
              sendClientError('purchase_event_error', error.toString());
              logEvent('purchase_event_error');
            },
          );
        });
    });

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }

      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
    };
  }, []);
};

export default useIAPConnection;