import React, { useState } from "react";
import InAppBilling from "react-native-billing";
import Storage from "./../libs/Storage";
import { Platform, ToastAndroid } from "react-native";
const UNDO_TIMEOUT = 3000;

const syncStateToStore = function(state) {
  // TODO: We need to find a better way to do storage management. isMenuOpen should not be saved.
  // Fix this in a generic way with better storage management.
  const isMenuOpen = state.isMenuOpen;
  delete state.isMenuOpen;
  Storage.setApplicationState(state);
  state.isMenuOpen = isMenuOpen;
};

const sortPaletteColors = palette =>
  palette.colors.sort((a, b) => (a.color > b.color ? 1 : -1));

const sortPalettes = allPalettes => {
  // sorting palettes before save
  const allPalettesArray = Object.keys(allPalettes).map(
    key => allPalettes[key]
  );
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
  allPalettesArray.forEach(function(_palette) {
    ordered[_palette.name] = _palette;
  });
  return ordered;
};

export default function applicationHook() {
  const addPalette = async palette => {
    setState(state => {
      const { allPalettes } = state;
      sortPaletteColors(palette);
      if (!palette.createdAt) {
        palette.createdAt = new Date().valueOf();
      }
      allPalettes[palette.name] = palette;
      const ordered = sortPalettes(allPalettes);
      return { ...state, allPalettes: ordered };
    });
  };

  const renamePalette = (oldName, name) => {
    if (oldName === name) {
      return;
    }
    setState(state => {
      const { allPalettes } = state;
      allPalettes[name] = allPalettes[oldName];
      allPalettes[name]["name"] = name;
      delete allPalettes[oldName];
      const ordered = sortPalettes(allPalettes);
      return { ...state, allPalettes: ordered };
    });
  };

  const loadInitPaletteFromStore = async () => {
    setState(state => ({ ...state, isLoading: true }));
    // Loading application state from localStorage
    const _state = await Storage.getApplicationState();
    setState(state => ({
      ...state,
      ..._state,
      isLoading: false
    }));

    // Setting default palette when user comming first time
    let defaultPalettes = {};
    const isUserAleadyExits = await Storage.checkUserAlreadyExists();

    if (isUserAleadyExits != "true") {
      if (Platform.OS !== "web") {
        try {
          await InAppBilling.open();
          // If subscriptions/products are updated server-side you
          // will have to update cache with loadOwnedPurchasesFromGoogle()
          await InAppBilling.loadOwnedPurchasesFromGoogle();
          isPurchased = await InAppBilling.isPurchased("croma_pro");
          if (isPurchased) {
            ToastAndroid.show(
              "Your purchase restored successfully..",
              ToastAndroid.LONG
            );
          }
          setState(state => {
            return { ...state, isPro: isPurchased };
          });
        } catch (err) {
          ToastAndroid.show(
            "Loading purchase detail failed. " + err,
            ToastAndroid.LONG
          );
        } finally {
          await InAppBilling.close();
        }
      }
      Storage.setUserAlreadyExists();
      defaultPalettes = {
        name: "Croma example palette",
        colors: [
          { color: "#f0675f" },
          { color: "#2f95dc" },
          { color: "#ebef5c" },
          { color: "#c9ef5b" }
        ]
      };
      addPalette(defaultPalettes);
    }
  };

  const removePaletteFromStateByName = name => {
    setState(state => {
      const { deletedPalettes } = state;
      clearTimeout(deletedPalettes[name]["timeout"]);
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
  };

  const setPurchase = details => {
    setState(state => {
      return { ...state, isPro: true, purchaseDetails: details };
    });
  };
  const setMenu = isMenuOpen => {
    setState(state => {
      return { ...state, isMenuOpen: isMenuOpen };
    });
  };
  const setUser = user => {
    setState(state => {
      return { ...state, user: user };
    });
  };

  const addColorToPalette = (name, color) => {
    setState(state => {
      const { allPalettes } = state;
      allPalettes[name].colors = allPalettes[name].colors.concat(color);
      sortPaletteColors(allPalettes[name]);
      return { ...state, allPalettes };
    });
  };

  const deletePaletteByName = async name => {
    setState(state => {
      const { allPalettes, deletedPalettes } = state;
      if (allPalettes[name]) {
        deletedPalettes[name] = { ...allPalettes[name] };
        delete allPalettes[name];
        deletedPalettes[name]["timeout"] = setTimeout(() => {
          removePaletteFromStateByName(name);
        }, UNDO_TIMEOUT);
        return { ...state, allPalettes, deletedPalettes };
      }
      return { ...state };
    });
  };

  const undoDeletionByName = name => {
    setState(state => {
      const { deletedPalettes } = state;
      if (deletedPalettes[name]) {
        addPalette({ ...deletedPalettes[name] });
        removePaletteFromStateByName(name);
      }
      return { ...state };
    });
  };

  const colorDeleteFromPalette = (name, colorIndex) => {
    setState(state => {
      const { allPalettes } = state;
      const deletedColor = allPalettes[name].colors.splice(colorIndex, 1);
      deletedColor[0]["timeout"] = setTimeout(() => {
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
    setState(state => {
      const { allPalettes } = state;
      allPalettes[name].colors.push({ color: colorName });
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorName) {
          clearTimeout(color.timeout);
          allPalettes[name].deletedColors.splice(index, 1);
        }
      });
      sortPaletteColors(allPalettes[name]);
      return { ...state, allPalettes };
    });
  };

  const clearDeletedColor = (name, colorObj) => {
    setState(state => {
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
  const [state, setState] = useState({
    ...{
      allPalettes: {},
      deletedPalettes: {},
      isLoading: false,
      isPro: false,
      isMenuOpen: false,
      user: {}
    },
    loadInitPaletteFromStore,
    undoDeletionByName,
    deletePaletteByName,
    addPalette,
    renamePalette,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette,
    setPurchase,
    setMenu,
    setUser
  });

  // Sync state to local storage
  if (
    Object.keys(state.allPalettes).length !== 0 ||
    Object.keys(state.deletedPalettes).length !== 0 ||
    state.isPro === true
  ) {
    syncStateToStore(state);
  }
  return state;
}

export const CromaContext = React.createContext();
