import React, { useState } from 'react';
import Storage from './../libs/Storage';
import { initPurchase, notifyMessage } from '../libs/Helpers';
import { Platform } from 'react-native';
import network from '../network';
import { t } from 'i18next';
import { resetAxiosClient } from '../network/axios.client';

//import { getAvailablePurchases } from 'react-native-iap';
// const UNDO_TIMEOUT = 3000;

const DEFAULT_PALETTES = {
  name: 'Croma example palette',
  colors: [{ color: '#f0675f' }, { color: '#2f95dc' }, { color: '#ebef5c' }, { color: '#c9ef5b' }]
};

const syncStateToStore = function (state) {
  // TODO: We need to find a better way to do storage management.
  // Fix this in a generic way with better storage management.
  const stateCopy = JSON.parse(JSON.stringify(state));
  delete stateCopy.isStoreLoaded;
  Storage.setApplicationState(stateCopy);
};

// const sortPaletteColors = (palette) => palette.colors.sort((a, b) => (a.color > b.color ? 1 : -1));

// const sortPalettes = (allPalettes) => {
//   // sorting palettes before save
//   const allPalettesArray = Object.keys(allPalettes).map((key) => allPalettes[key]);
//   allPalettesArray.sort((a, b) => {
//     // Just a check for old user
//     if (!a.createdAt) {
//       a.createdAt = 0;
//     }
//     if (!b.createdAt) {
//       b.createdAt = 0;
//     }
//     return new Date(b.createdAt) - new Date(a.createdAt);
//   });
//   const ordered = {};
//   allPalettesArray.forEach(function (_palette) {
//     ordered[_palette.name] = _palette;
//   });
//   return ordered;
// };

const loadPlalettes = async () => {
  const res = await network.getAllPalettes();
  const allPalettes = res.data;
  return allPalettes.map((palette) => ({
    name: palette.name,
    id: palette.id,
    colors: palette.colors.map((color) => ({ id: color.id, name: color.name, color: color.hex }))
  }));
};

export default function useApplicationHook() {
  const addPalette = async (palette) => {
    try {
      await network.createPalette({
        ...palette,
        colors: palette.colors.map((color) => ({ name: null, hex: color.color }))
      });
      const allPalettes = await loadPlalettes();
      setState((state) => ({ ...state, allPalettes }));
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const loadInitPaletteFromStore = async () => {
    setState((state) => ({ ...state, isLoading: true }));
    // Loading application state from localStorage
    // TODO network call...
    const _state = await Storage.getApplicationState();
    const isUserAlreadyExits = await Storage.checkUserAlreadyExists();
    if (isUserAlreadyExits != 'true') {
      // For first time user check if user is pro or not.
      Platform.OS === 'android' && (await initPurchase(setPurchase));
      // IF USER IS COMING FIRST TIME
      await Storage.setUserAlreadyExists();
      await Storage.setUserDeviceId();
      resetAxiosClient();
      await addPalette(DEFAULT_PALETTES);
    }
    const deviceId = await Storage.getUserDeviceId();
    if (isUserAlreadyExits == 'true' && !deviceId && deviceId.length == 0) {
      // Update user device id and local palettes to server if user is already exists
      const paletteCreatePromises = _state.allPalettes.map(async (palette) => {
        const payload = {
          name: palette.name,
          colors: palette.colors.map((color) => ({
            name: color.name ? color.name : null,
            hex: color.color
          }))
        };
        return network.createPalette(payload);
      });
      try {
        await Promise.all(paletteCreatePromises);
      } catch (error) {
        console.log('error', error);
      }
      await Storage.setUserDeviceId();
      resetAxiosClient();
    }

    let allPalettes = _state.allPalettes;
    try {
      allPalettes = await loadPlalettes();
    } catch (error) {
      console.log('error', error);
    }
    setState((state) => ({ ...state, ..._state, allPalettes, isLoading: false }));
    setStoreLoaded(true);
    return;
  };

  const setPurchase = (details) => {
    setState((state) => {
      return { ...state, isPro: true, purchaseDetails: details };
    });
  };

  const setUser = (user) => {
    setState((state) => {
      return { ...state, user: user };
    });
  };

  const updatePalette = async (id, palette) => {
    try {
      await network.patchPalette(id, palette);
      const allPalettes = await loadPlalettes();
      setState((state) => ({ ...state, allPalettes }));
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const deleteColorFromPalette = async (paletteId, colorId) => {
    try {
      await network.deleteColorFromPalette(paletteId, colorId);
      const allPalettes = await loadPlalettes();
      setState((state) => ({ ...state, allPalettes }));
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const addNewColorToPalette = async (paletteId, color) => {
    try {
      await network.addNewColorToPalette(paletteId, color);
      const allPalettes = await loadPlalettes();
      setState((state) => ({ ...state, allPalettes }));
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const deletePalette = async (id) => {
    try {
      await network.deletePalette(id);
      const allPalettes = await loadPlalettes();
      setState((state) => ({ ...state, allPalettes }));
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const setStoreLoaded = (isStoreLoaded) => {
    setState((state) => {
      return { ...state, isStoreLoaded };
    });
  };

  const setCurrentPalette = (currentPalette) => {
    setState((state) => {
      return { ...state, currentPalette };
    });
  };

  const setColorList = (colorList) => {
    setState((state) => {
      return { ...state, colorList };
    });
  };

  const setDetailedColor = (detailedColor) => {
    setState((state) => {
      return { ...state, detailedColor };
    });
  };

  const setColorPickerCallback = (colorPickerCallback) => {
    setState((state) => {
      return { ...state, colorPickerCallback };
    });
  };

  const setCommonPalettes = (commonPalettes) => {
    setState((state) => {
      return { ...state, commonPalettes };
    });
  };

  const setSuggestedName = (suggestedName) => {
    setState((state) => {
      return { ...state, suggestedName };
    });
  };

  const clearPalette = () => {
    setSuggestedName('');
    setCurrentPalette({});
    setColorList([]);
  };

  const [state, setState] = useState({
    ...{
      allPalettes: {},
      currentPalette: {},
      colorList: [],
      deletedPalettes: {},
      suggestedName: '',
      isLoading: false,
      isPro: false,
      user: {},
      isStoreLoaded: false,
      colorPickerCallback: () => {}
    },
    loadInitPaletteFromStore,
    deleteColorFromPalette,
    addNewColorToPalette,
    deletePalette,
    addPalette,
    updatePalette,
    setPurchase,
    setUser,
    setStoreLoaded,
    setCurrentPalette,
    setDetailedColor,
    setColorList,
    setColorPickerCallback,
    setCommonPalettes,
    setSuggestedName,
    clearPalette
  });
  // Sync state to local storage
  if (state.isStoreLoaded === true) {
    syncStateToStore(state);
  }
  return state;
}

export const CromaContext = React.createContext();
