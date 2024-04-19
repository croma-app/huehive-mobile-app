import React, { useState } from 'react';
import Storage from './../libs/Storage';
import { initPurchase, notifyMessage } from '../libs/Helpers';
import { Platform } from 'react-native';
import network from '../network';
import { t } from 'i18next';

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
    const isUserAlreadyExits = await Storage.checkUserAlreadyExists();
    if (isUserAlreadyExits != 'true') {
      // IF USER IS COMING FIRST TIME
      await Storage.setUserAlreadyExists();
      await Storage.setUserDeviceId();
    }
    Platform.OS === 'android' &&
      (await initPurchase(setPurchase, /* showMessage=*/ !isUserAlreadyExits));
    const allPalettes = await loadPlalettes();
    setState((state) => ({ ...state, allPalettes, isLoading: false }));
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

  const updatePalette = async (id, _palette) => {
    try {
      setState((state) => {
        const allPalettes = state.allPalettes.map((palette) => {
          if (palette.id === id) {
            return _palette;
          }
          return palette;
        });
        return { ...state, allPalettes: [...allPalettes] };
      });
      await network.patchPalette(id, _palette);
      // const allPalettes = await loadPlalettes();
      // setState((state) => ({ ...state, allPalettes }));
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

  const setDetailedColor = (detailedColor) => {
    setState((state) => {
      return { ...state, detailedColor };
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
  };

  const [state, setState] = useState({
    ...{
      allPalettes: {},
      currentPalette: {},
      deletedPalettes: {},
      suggestedName: '',
      isLoading: false,
      isPro: false,
      user: {},
      isStoreLoaded: false
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
    setCommonPalettes,
    setSuggestedName,
    clearPalette
  });
  return state;
}

export const CromaContext = React.createContext();
