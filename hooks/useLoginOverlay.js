import { create } from 'zustand';

const useLoginOverlay = create((set) => ({
  isLoginOverlayActive: false,
  openLoginOverlay: () => {
    set({ isLoginOverlayActive: true });
  },
  closeLoginOverlay: () => {
    set({ isLoginOverlayActive: false });
  }
}));

export default useLoginOverlay;
