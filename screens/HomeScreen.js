import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  View,
  Dimensions,
  Platform,
  Linking,
  ToastAndroid
} from "react-native";
import { PaletteCard } from "../components/PaletteCard";
import { UndoDialog, DialogContainer } from "../components/CommanDialogs";
import { Croma } from "../store/store";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import Jimp from "jimp";
import { Header } from "react-navigation";
import EmptyView from "../components/EmptyView";
import InAppBilling from "react-native-billing";
import HomeActionButton from '../components/HomeActionButton';

const HomeScreen = function (props) {
  const { height, width } = Dimensions.get("window");

  const {
    isLoading,
    allPalettes,
    deletedPalettes,
    undoDeletionByName,
    isPro,
    setPurchase
  } = React.useContext(Croma);
  const [pickImgloading, setPickImgLoading] = useState(false);

  
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };
  const purchase = async function () {
    try {
      await InAppBilling.open();
      const details = await InAppBilling.purchase("croma_pro");
      ToastAndroid.show("Congrats, You are now a pro user!", ToastAndroid.LONG);
      setPurchase(details);
    } catch (err) {
      ToastAndroid.show("Purchase unsucceessful " + err, ToastAndroid.LONG);
    } finally {
      await InAppBilling.close();
    }
  };
  // TODO: restore purchase
  const checkPurchase = async function () {
    try {
      await InAppBilling.open();
      // If subscriptions/products are updated server-side you
      // will have to update cache with loadOwnedPurchasesFromGoogle()
      await InAppBilling.loadOwnedPurchasesFromGoogle();
      const isPurchased = await InAppBilling.isPurchased("croma_pro");
    } catch (err) {
    } finally {
      await InAppBilling.close();
    }
  };
  useEffect(() => {
    getPermissionAsync();
    if (Platform.OS === 'android') {
      // Deep linking code 
      // https://medium.com/react-native-training/deep-linking-your-react-native-app-d87c39a1ad5e
      Linking.getInitialURL().then(url => {
        if (url) {
          const result = {};
          url.split("?")[1].split("&").forEach(function(part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
          });
          props.navigation.navigate('SavePalette',{ colors: [...new Set(JSON.parse(result['colors']) || [])],name: result['name']});
        }
      });
    }
  }, []);
  if (isLoading) {
    return <ActivityIndicator />;
  } else {
    return (
      <>
        <View
          style={[styles.container, { minHeight: height - Header.HEIGHT - 16 }]}
        >
          {pickImgloading ? <ActivityIndicator /> : <View />}
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.keys(allPalettes).map(name => {
              return (
                <PaletteCard
                  key={name}
                  colors={allPalettes[name].colors.slice(
                    0,
                    isPro ? allPalettes[name].colors.length : 4
                  )}
                  name={name}
                  navigation={props.navigation}
                  />
                  );
                })}
            <EmptyView />
                <HomeActionButton setPickImgLoading={setPickImgLoading} {...props} />
          </ScrollView>
        </View>

        <DialogContainer>
          {Object.keys(deletedPalettes).map(name => {
            return (
              <UndoDialog
                key={name}
                name={name}
                undoDeletionByName={undoDeletionByName}
              />
            );
          })}
        </DialogContainer>
      </>
    );
  }
};

export default HomeScreen;

HomeScreen.navigationOptions = {
  title: "Croma"
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    justifyContent: "center"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white"
  }
});
