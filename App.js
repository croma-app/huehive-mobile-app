import React from 'react';
import { ActivityIndicator } from 'react-native';
import LoginOverlayScreen from './components/LoginOverlayScreen';
import ApplicationRoot from './ApplicationRoot';
import Storage from './libs/Storage';
import { withIAPContext } from 'react-native-iap';

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoginOverlayStepDone, setIsLoginOverlayStepDone] = React.useState(true);
  React.useEffect(() => {
    Storage.isLoginOverlayStepDone().then((value) => {
      if (value === 'yes') {
        setIsLoginOverlayStepDone(false);
      }
      setIsLoading(true);
    });
  }, []);

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
