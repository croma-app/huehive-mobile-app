import React, { useState } from 'react';
import Storage from './../libs/Storage';
import { initPurchase, notifyMessage } from '../libs/Helpers';
import { Platform } from 'react-native';
import network from '../network';
import { t } from 'i18next';

//import { getAvailablePurchases } from 'react-native-iap';
const UNDO_TIMEOUT = 3000;

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

const sortPaletteColors = (palette) => palette.colors.sort((a, b) => (a.color > b.color ? 1 : -1));

const sortPalettes = (allPalettes) => {
  // sorting palettes before save
  const allPalettesArray = Object.keys(allPalettes).map((key) => allPalettes[key]);
  allPalettesArray.sort((a, b) => {
    // Just a check for old user
    if (!a.createdAt) {
      a.createdAt = 0;
    }
    if (!b.createdAt) {
      b.createdAt = 0;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const ordered = {};
  allPalettesArray.forEach(function (_palette) {
    ordered[_palette.name] = _palette;
  });
  return ordered;
};

export default function useApplicationHook() {
  const addPalette = async (palette) => {
    try {
      const res = await network.createPalette({
        ...palette,
        colors: palette.colors.map((color) => ({ name: null, hex: color.color }))
      });
      console.log({ res });
    } catch (error) {
      notifyMessage(t(error.message));
    }
  };

  const renamePalette = (oldName, name) => {
    if (oldName === name) {
      return;
    }
    setState((state) => {
      const { allPalettes } = state;
      allPalettes[name] = allPalettes[oldName];
      allPalettes[name]['name'] = name;
      delete allPalettes[oldName];
      const ordered = sortPalettes(allPalettes);
      return { ...state, allPalettes: ordered };
    });
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
      await addPalette(DEFAULT_PALETTES);
    }
    const deviceId = await Storage.getUserDeviceId();
    if (isUserAlreadyExits == 'true' && deviceId.length == 0) {
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
        Promise.all(paletteCreatePromises);
        await Storage.setUserDeviceId();
      } catch (error) {
        console.log('error', error);
      }
      await Storage.setUserDeviceId();
    }

    let allPalettes = _state.allPalettes;
    try {
      const res = await network.getAllPalettes();
      allPalettes = res.data;
    } catch (error) {
      console.log('error', error);
    }

    allPalettes = allPalettes.map((palette) => ({
      name: palette.name,
      colors: palette.colors.map((color) => ({ name: color.name, color: color.hex }))
    }));

    setState((state) => ({ ...state, ..._state, allPalettes, isLoading: false }));
    setStoreLoaded(true);
    return;
  };

  const removePaletteFromStateByName = (name) => {
    setState((state) => {
      const { deletedPalettes } = state;
      clearTimeout(deletedPalettes[name]['timeout']);
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
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

  const addColorToPalette = (name, color) => {
    setState((state) => {
      const { allPalettes } = state;
      allPalettes[name].colors = allPalettes[name].colors.concat(color);
      return { ...state, allPalettes };
    });
  };

  const updatePalette = (name, colors) => {
    setState((state) => {
      const { allPalettes } = state;
      allPalettes[name].colors = [...colors];
      return { ...state, allPalettes };
    });
  };

  const deletePaletteByName = async (name) => {
    setState((state) => {
      const { allPalettes, deletedPalettes } = state;
      if (allPalettes[name]) {
        deletedPalettes[name] = { ...allPalettes[name] };
        delete allPalettes[name];
        deletedPalettes[name]['timeout'] = setTimeout(() => {
          removePaletteFromStateByName(name);
        }, UNDO_TIMEOUT);
        return { ...state, allPalettes, deletedPalettes };
      }
      return { ...state };
    });
  };

  const undoDeletionByName = (name) => {
    setState((state) => {
      const { deletedPalettes } = state;
      if (deletedPalettes[name]) {
        addPalette({ ...deletedPalettes[name] });
        removePaletteFromStateByName(name);
      }
      return { ...state };
    });
  };

  const colorDeleteFromPalette = (name, colorIndex) => {
    setState((state) => {
      const { allPalettes } = state;
      const deletedColor = allPalettes[name].colors.splice(colorIndex, 1);
      deletedColor[0]['timeout'] = setTimeout(() => {
        clearDeletedColor(name, deletedColor[0]);
      }, UNDO_TIMEOUT);
      if (allPalettes[name].deletedColors) {
        allPalettes[name].deletedColors.push({ ...deletedColor[0] });
      } else {
        allPalettes[name].deletedColors = [...deletedColor];
      }
      return { ...state, allPalettes };
    });
  };

  const undoColorDeletion = (name, colorName) => {
    setState((state) => {
      const { allPalettes } = state;
      allPalettes[name].colors.push({ color: colorName });
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorName) {
          clearTimeout(color.timeout);
          allPalettes[name].deletedColors.splice(index, 1);
        }
      });
      return { ...state, allPalettes };
    });
  };

  const clearDeletedColor = (name, colorObj) => {
    setState((state) => {
      const { allPalettes } = state;
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorObj.color) {
          allPalettes[name].deletedColors.splice(index, 1);
        }
      });
      clearTimeout(colorObj.timeout);
      return { ...state, allPalettes };
    });
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
    undoDeletionByName,
    deletePaletteByName,
    addPalette,
    updatePalette,
    renamePalette,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette,
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
