import { create } from 'zustand';
import { retrieveUserSession } from '../libs/EncryptedStoreage';

const useUserData = create((set) => ({
  userData: undefined,
  isLoading: false,
  loadUserData: async () => {
    set({ isLoading: true });
    try {
      const userData = await retrieveUserSession();
      set({ userData });
    } catch (error) {
      console.log('Error: Failed to load userData');
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useUserData;
