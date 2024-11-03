import { create } from 'zustand';
import { retrieveUserSession } from '../libs/EncryptedStorage';

const useUserData = create((set) => ({
  userData: undefined,
  isLoading: false,
  loadUserData: async () => {
    set({ isLoading: true });
    const userData = await retrieveUserSession();
    set({ userData });
    set({ isLoading: false });
  }
}));

export default useUserData;
