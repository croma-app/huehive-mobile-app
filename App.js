import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import ApplicationRoot from './ApplicationRoot';
import { withIAPContext } from 'react-native-iap';
import useUserData from './hooks/useUserData';
import Colors from './constants/Styles';
import { SafeAreaProvider } from 'react-native-safe-area-context';


const App = () => {
  const { loadUserData } = useUserData();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={Colors.primaryDark}
          translucent={false}
          networkActivityIndicatorVisible={true}
        />
        <ApplicationRoot />
      </SafeAreaProvider>
    </>
  );
};

export default withIAPContext(App);
