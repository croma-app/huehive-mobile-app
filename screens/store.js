import React, { useState, useEffect } from "react";
import Storage from "./../libs/Storage";
const UNDO_TIMEOUT = 3000

export const initState = {
  allPalettes: {},
  deletedPalettes: {},
  isLoading: false,
};

const shrinkStateToStore = function (allPalettes) {
  Storage.saveAllPalette(allPalettes)
}

export default function applicationHook(initState) {
  const addPalette = async palette => {
    setState(state => {
      const { allPalettes } = state;
      allPalettes[palette.name] = palette;
      return { ...state, allPalettes };
    });
  };

  const loadInitPaletteFromStore = async () => {
    const allPalettes = await Storage.getAllPalettes();
    setState(state => ({ ...state, allPalettes }));
  };

  const removePaletteFromStateByName = name => {
    setState(state => {
      const { deletedPalettes } = state;
      delete deletedPalettes[name];
      return { ...state, deletedPalettes };
    });
  };

  const addColorToPalette = (name, color) => {
    setState((state) => {
      const { allPalettes } = state
      allPalettes[name].colors = allPalettes[name].colors.concat(color)
      return { ...state, allPalettes }
    })
  }

  const deletePaletteByName = async name => {
    await Storage.deletePaletteByName(name);
    setState(state => {
      const { allPalettes } = state;
      const { deletedPalettes } = state;
      if (allPalettes[name]) {
        deletedPalettes[name] = { ...allPalettes[name] };
        delete allPalettes[name];
        setTimeout(() => {
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
        addPalette({ ...deletedPalettes[name] })
        removePaletteFromStateByName(name);
      }
      return { ...state };
    });
  };

  const colorDeleteFromPalette = (name, colorIndex) => {
    setState((state) => {
      const { allPalettes } = state
      const deletedColor = allPalettes[name].colors.splice(colorIndex, 1)
      if (allPalettes[name].deletedColors) {
        allPalettes[name].deletedColors.push(deletedColor[0])
      } else {
        allPalettes[name].deletedColors = deletedColor
      }
      setTimeout(() => {
        clearDeletedColor(name, deletedColor[0].color)
      }, UNDO_TIMEOUT)
      return { ...state, allPalettes }
    })
  }

  const undoColorDeletion = (name, colorName) => {
    setState(state => {
      const { allPalettes } = state
      allPalettes[name].colors.push({ color: colorName })
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorName) {
          allPalettes[name].deletedColors.splice(index, 1)
        }
      })
      return { ...state, allPalettes }
    })
  }

  const clearDeletedColor = (name, colorName) => {
    setState(state => {
      const { allPalettes } = state
      allPalettes[name].deletedColors.forEach((color, index) => {
        if (color.color === colorName) {
          allPalettes[name].deletedColors.splice(index, 1)
        }
      })
      return { ...state, allPalettes }
    })
  }

  const [state, setState] = useState({
    ...initState,
    loadInitPaletteFromStore,
    undoDeletionByName,
    deletePaletteByName,
    addPalette,
    colorDeleteFromPalette,
    undoColorDeletion,
    addColorToPalette
  });
  if (Object.keys(state.allPalettes).length > 0) {
    shrinkStateToStore(state.allPalettes)
  }
  console.log(state, "updated state ");
  return state;
}


export const Croma = React.createContext();