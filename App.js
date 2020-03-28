import React, { useState, useEffect } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import Colors from "./constants/Colors";
import AppNavigator from "./navigation/AppNavigator";
import { ActivityIndicator } from 'react-native';
import applicationHook, { initState, Croma } from "./store/store";

export default function App(props) {
  const [isPalettesLoaded, setIsPalettesLoaded] = useState(false);
  const applicationState = applicationHook(initState)
  useEffect(() => {
    (async () => {
      await applicationState.loadInitPaletteFromStore();
      setIsPalettesLoaded(true)
    })();
    if(Platform.OS === 'web'){
      applicationState.setPurchase({
        platfrom: 'web'
      })
    }
  }, []);
  return (
    !isPalettesLoaded ? <View style={{flex: 1,marginTop: '20%'}}>
      <ActivityIndicator size="large" color="#ef635f" animating={true} />
    </View>:
    <Croma.Provider value={applicationState}>
      <View style={[styles.container]}>
      <StatusBar
        barStyle = "light-content"
        // dark-content, light-content and default
        hidden = {false}
        //To hide statusBar
        backgroundColor = {Colors.primaryDark}
        //Background color of statusBar only works for Android
        translucent = {false}
        //allowing light, but not detailed shapes
        networkActivityIndicatorVisible = {true}
    />
        <View
          style={[{ flex: 1, backgroundColor: "transparent", maxWidth: 600 }]}
        >
          {Platform.OS === "ios" && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </View>
    </Croma.Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.backgroundColor,
    flexDirection: "row"
  }
});
