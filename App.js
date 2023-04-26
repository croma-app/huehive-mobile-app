import React from 'react';
import LoginOverlayScreen from './components/LoginOverlayScreen';
import ApplicationRoot from './ApplicationRoot';

export default function App() {
  const [newUser, setNewUser] = React.useState(false);
  return newUser ? <LoginOverlayScreen /> : <ApplicationRoot />;
}
