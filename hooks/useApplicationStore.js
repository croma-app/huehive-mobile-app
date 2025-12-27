import { create } from 'zustand';
import Storage from '../libs/Storage';
import { initPurchase } from '../libs/Helpers';
import network from '../network';

const useApplicationStore = create((set) => ({
  allPalettes: [],
  deletedPalettes: {},
  isLoading: false,
  pro: {
    plan: 'proPlus' // starter, pro, proPlus, change to starter to disable automatic proPlus for limited time.
  },
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
    await network.createPalette({
      ...palette,
      colors: palette.colors.map((color) => ({ name: null, hex: color.color }))
    });
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes });
  },

  updatePalette: async (id, _palette) => {
    await network.patchPalette(id, _palette);
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes });
  },

  deleteColorFromPalette: async (paletteId, colorId) => {
    await network.deleteColorFromPalette(paletteId, colorId);
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes });
  },

  addNewColorToPalette: async (paletteId, color) => {
    await network.addNewColorToPalette(paletteId, color);
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes });
  },

  deletePalette: async (id) => {
    await network.deletePalette(id);
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes });
  },

  reloadPalettes: async () => {
    set({ isLoading: true });
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes, isLoading: false });
  },

  loadInitPaletteFromStore: async () => {
    set({ isLoading: true });
    const isUserAlreadyExits = await Storage.checkUserAlreadyExists();
    if (isUserAlreadyExits != 'true') {
      // IF USER IS COMING FIRST TIME
      await Storage.setUserAlreadyExists();
      await Storage.setUserDeviceId();
    }
    await initPurchase(
        useApplicationStore.getState().setPurchase,
        /* showMessage=*/ !isUserAlreadyExits
      );
    const allPalettes = await useApplicationStore.getState().loadPalettes();
    set({ allPalettes, isLoading: false });
  },

  setPurchase: (plan) => {
    set({ pro: { plan: plan } });
  },

  setCommonPalettes: (commonPalettes) => {
    set({ commonPalettes });
  }
}));

export default useApplicationStore;
