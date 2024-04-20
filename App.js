import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import LoginOverlayScreen from './components/LoginOverlayScreen';
import ApplicationRoot from './ApplicationRoot';
import Storage from './libs/Storage';
import { withIAPContext } from 'react-native-iap';
import getUserDataZ from './hooks/getUserDataZustand';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoginOverlayStepDone, setIsLoginOverlayStepDone] = React.useState(true);
  const { loadUserData } = getUserDataZ();
  React.useEffect(() => {
    Storage.isLoginOverlayStepDone().then((value) => {
      if (value === 'yes') {
        setIsLoginOverlayStepDone(false);
      }
      setIsLoading(true);
    });
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const markLoginStepDone = () => {
    setIsLoginOverlayStepDone(false);
  };

  return isLoading ? (
    isLoginOverlayStepDone ? (
      <LoginOverlayScreen markLoginStepDone={markLoginStepDone} />
    ) : (
      <ApplicationRoot />
    )
  ) : (
    <ActivityIndicator />
  );
};

export default withIAPContext(App);
