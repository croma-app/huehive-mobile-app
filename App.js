import React from 'react';
import LoginOverlayScreen from './components/LoginOverlayScreen';
import ApplicationRoot from './ApplicationRoot';
import Storage from './libs/Storage';

export default function App() {
  const [isLoginOverlayStepDone, setIsLoginOverlayStepDone] = React.useState(true);
  React.useEffect(() => {
    Storage.isLoginOverlayStepDone().then((value) => {
      if (value === 'yes') {
        setIsLoginOverlayStepDone(false);
      }
    });
  }, []);

  const markLoginStepDone = () => {
    setIsLoginOverlayStepDone(false);
  };

  return isLoginOverlayStepDone ? (
    <LoginOverlayScreen markLoginStepDone={markLoginStepDone} />
  ) : (
    <ApplicationRoot />
  );
}
