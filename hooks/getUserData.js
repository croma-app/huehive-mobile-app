import { useState, useEffect, useCallback } from 'react';
import { retrieveUserSession } from '../libs/EncryptedStoreage';

const useUserData = function () {
  const [isUserDataLoading, setIsUserDataLoading] = useState(true);
  const [userData, setUserData] = useState();

  const getUserData = useCallback(async () => {
    setIsUserDataLoading(true);
    const userData = await retrieveUserSession();
    if (userData) {
      setUserData(userData);
    }
    setIsUserDataLoading(false);
  }, []);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return { userData, isUserDataLoading, setIsUserDataLoading, setUserData, getUserData };
};

export default useUserData;
