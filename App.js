import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import ApplicationRoot from './ApplicationRoot';
import { withIAPContext } from 'react-native-iap';
import useUserData from './hooks/useUserData';
import Colors from './constants/Styles';

const App = () => {
  const { loadUserData } = useUserData();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Colors.primaryDark}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      <ApplicationRoot />
    </>
  );
};

export default withIAPContext(App);
