import EncryptedStorage from "react-native-encrypted-storage";

export async function storeUserSession(fullName, email, token, avator) {
  try {
    await EncryptedStorage.setItem(
      "user_session",
      JSON.stringify({
        token,
        fullName,
        email,
        avator,
      })
    );

    // Congrats! You've just stored your first value!
  } catch (error) {
    // There was an error on the native side
  }
}

export async function retrieveUserSession() {
  try {
    const session = await EncryptedStorage.getItem("user_session");

    if (session !== undefined) {
      // Congrats! You've just retrieved your first value!
      return JSON.parse(session);
    }
  } catch (error) {
    // There was an error on the native side
  }
}

export async function removeUserSession() {
  try {
    await EncryptedStorage.removeItem("user_session");
    // Congrats! You've just removed your first value!
  } catch (error) {
    // There was an error on the native side
  }
}
