import { create } from 'zustand';

const useAuth = create((set) => ({
  isAuthOverlayActive: false,
  openAuthOverlay: () => {
    set({ isAuthOverlayActive: true });
  },
  closeAuthOverlay: () => {
    set({ isAuthOverlayActive: false });
  }
}));

export default useAuth;
