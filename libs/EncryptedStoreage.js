import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeUserSession(fullName, email, token, avatar_url) {
  return EncryptedStorage.setItem(
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
  const session = await EncryptedStorage.getItem('user_session');
  if (session !== undefined) {
    return JSON.parse(session);
  }
}

export async function removeUserSession() {
  return EncryptedStorage.removeItem('user_session');
}
