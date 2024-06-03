import { create } from 'zustand';
import Storage from '../libs/Storage';
import { initPurchase, notifyMessage } from '../libs/Helpers';
import { Platform } from 'react-native';
import { t } from 'i18next';
import network from '../network';

const useApplicationStore = create((set) => ({
  allPalettes: [],
  deletedPalettes: {},
  isLoading: false,
  isPro: false,
  purchaseDetails: null,
  detailedColor: null,
  commonPalettes: [],

  loadPalettes: async () => {
    const res = await network.getAllPalettes();
    const allPalettes = res.data;
    return allPalettes.map((palette) => ({
      name: palette.name,
      id: palette.id,
      colors: palette.colors.map((color) => ({ id: color.id, name: color.name, color: color.hex }))
    }));
  },

  addPalette: async (palette) => {
    try {
      await network.createPalette({
        ...palette,
        colors: palette.colors.map((color) => ({ name: null, hex: color.color }))
      });
      const allPalettes = await useApplicationStore.getState().loadPalettes();
      set({ allPalettes });
    } catch (error) {
      notifyMessage(t(error.message));
    }
  },

  updatePalette: async (id, _palette) => {
    try {
      const allPalettesCopy = [...useApplicationStore.getState().allPalettes];
      const paletteIndex = allPalettesCopy.findIndex((palette) => palette.id === id);
      if (paletteIndex > -1) {
        allPalettesCopy[paletteIndex] = _palette;
      }
      set({ allPalettes: allPalettesCopy });
      await network.patchPalette(id, _palette);
    } catch (error) {
      notifyMessage(t(error.message));
    }
  },

  deleteColorFromPalette: async (paletteId, colorId) => {
    try {
      await network.deleteColorFromPalette(paletteId, colorId);
      const allPalettes = await useApplicationStore.getState().loadPalettes();
      set({ allPalettes });
    } catch (error) {
      notifyMessage(t(error.message));
    }
  },

  addNewColorToPalette: async (paletteId, color) => {
    try {
      await network.addNewColorToPalette(paletteId, color);
      const allPalettes = await useApplicationStore.getState().loadPalettes();
      set({ allPalettes });
    } catch (error) {
      notifyMessage(t(error.message));
    }
  },

  deletePalette: async (id) => {
    try {
      await network.deletePalette(id);
      const allPalettes = await useApplicationStore.getState().loadPalettes();
      set({ allPalettes });
    } catch (error) {
      notifyMessage(t(error.message));
    }
  },

  loadInitPaletteFromStore: async () => {
    set({ isLoading: true });
    const isUserAlreadyExits = await Storage.checkUserAlreadyExists();
    if (isUserAlreadyExits != 'true') {
      // IF USER IS COMING FIRST TIME
      await Storage.setUserAlreadyExists();
      await Storage.setUserDeviceId();
    }
    Platform.OS === 'android' &&
      (await initPurchase(
        useApplicationStore.getState().setPurchase,
        /* showMessage=*/ !isUserAlreadyExits
      ));
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes, isLoading: false });
  },

  setPurchase: (details) => {
    set({ isPro: true, purchaseDetails: details });
  },

  setDetailedColor: (detailedColor) => {
    set({ detailedColor });
  },

  setCommonPalettes: (commonPalettes) => {
    set({ commonPalettes });
  }
}));

export default useApplicationStore;
