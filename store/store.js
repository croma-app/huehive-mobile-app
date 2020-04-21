import React, { useState, useEffect } from "react";
import Storage from "./../libs/Storage";
const UNDO_TIMEOUT = 3000;

export const initState = {
  allPalettes: {},
  deletedPalettes: {},
  isLoading: false,
  isPro: false
};

const syncStateToStore = function (state) {
  Storage.setApplicationState(state);
};

const sortPalette = palette =>
  palette.colors.sort((a, b) => (a.color > b.color ? 1 : -1));

export default function applicationHook(initState) {
  const addPalette = async palette => {
    setState(state => {
      const { allPalettes } = state;
      sortPalette(palette);
      allPalettes[palette.name] = palette;
      // sorting palettes before save 
      const ordered = {};
      Object.keys(allPalettes).sort().forEach(function (key) {
        ordered[key] = allPalettes[key];
      });
      return { ...state, allPalettes: ordered };
    });
  };

  const loadInitPaletteFromStore = async () => {
    // Loading application state from localStorage
    const _state = await Storage.getApplicationState();
    setState(state => ({
      ...state,
      ..._state
    }));

    // Setting default palette when user comming first time
    let defaultPalettes = {};
    const isUserAleadyExits = await Storage.checkUserAlreadyExists();
    if (isUserAleadyExits != "true") {
      Storage.setUserAlreadyExists();
      defaultPalettes = {
        name: "Croma example palette",
        colors: [
          { color: "#F0675F" },
          { color: "#F3D163" },
          { color: "#EBEF5C" },
          { color: "#C9EF5B" }
        ]
      };
      addPalette(defaultPalettes);
    }
  };

  const removePaletteFromStateByName = name => {
    setState(state => {
      const { deletedPalettes } = state;
      clearTimeout(deletedPalettes[name]['timeout'])
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
  };

  const setPurchase = details => {
    setState(state => {
      return { ...state, isPro: true, purchaseDetails: details };
    });
  };

  const addColorToPalette = (name, color) => {
    setState(state => {
      const { allPalettes } = state;
      allPalettes[name].colors = allPalettes[name].colors.concat(color);
      sortPalette(allPalettes[name]);
      return { ...state, allPalettes };
    });
  };

  const deletePaletteByName = async name => {
    setState(state => {
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
    setState(state => {
      const { allPalettes } = state;
      allPalettes[name].colors.push({ color: colorName });
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorName) {
          clearTimeout(color.timeout)
          allPalettes[name].deletedColors.splice(index, 1);
        }
      });
      sortPalette(allPalettes[name]);
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
      clearTimeout(colorObj.timeout)
      return { ...state, allPalettes };
    });
  };

  const [state, setState] = useState({
    ...initState,
    loadInitPaletteFromStore,
    undoDeletionByName,
    deletePaletteByName,
    addPalette,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette,
    setPurchase
  });

  // Sync state to local storage
  if (
    Object.keys(state.allPalettes).length !== 0 ||
    Object.keys(state.deletedPalettes).length !== 0 ||
    state.isPro !== initState.isPro
  ) {
    syncStateToStore(state);
  }
  return state;
}

export const Croma = React.createContext();
