import AsyncStorage from '@react-native-async-storage/async-storage';

export async function storeUserSession(fullName, email, token, avatar_url) {
  return AsyncStorage.setItem(
    'user_session',
    JSON.stringify({
      token,
      fullName,
      email,
      avatar_url
    })
  );
}

export async function retrieveUserSession() {
  const session = await AsyncStorage.getItem('user_session');
  if (session !== undefined) {
    return JSON.parse(session);
  }
}

export async function removeUserSession() {
  return AsyncStorage.removeItem('user_session');
}
