import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar } from 'react-native';
import AuthOnboardingScreen from './components/AuthOnboardingScreen';
import ApplicationRoot from './ApplicationRoot';
import Storage from './libs/Storage';
import { withIAPContext } from 'react-native-iap';
import useUserData from './hooks/useUserData';
import Colors from './constants/Colors';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoginOverlayStepDone, setIsLoginOverlayStepDone] = React.useState(true);
  const { loadUserData } = useUserData();
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

  return (
    <>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={Colors.primaryDark}
        translucent={false}
        networkActivityIndicatorVisible={true}
      />
      {isLoading ? (
        isLoginOverlayStepDone ? (
          <AuthOnboardingScreen markLoginStepDone={markLoginStepDone} />
        ) : (
          <ApplicationRoot />
        )
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default withIAPContext(App);
